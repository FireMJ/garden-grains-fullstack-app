// src/app/api/webhooks/yoco/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Yoco Webhook Handler
 * Docs: https://developer.yoco.com/docs/webhooks
 * 
 * Handles both payment events and checkout events from Yoco
 */
export async function POST(req: Request) {
  const yocoWebhookSecret = process.env.YOCO_WEBHOOK_SECRET;
  const yocoSecretKey = process.env.YOCO_SECRET_KEY;

  // Validate environment configuration
  if (!yocoWebhookSecret && process.env.NODE_ENV === 'production') {
    console.error("❌ YOCO_WEBHOOK_SECRET is required in production");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const bodyText = await req.text();
    const signatureHeader = req.headers.get("x-yoco-signature");

    // Log webhook receipt (sanitize sensitive data in production)
    if (process.env.NODE_ENV === 'development') {
      console.log("🔔 Incoming Yoco webhook:", bodyText);
    } else {
      console.log("🔔 Incoming Yoco webhook received");
    }

    // Verify webhook signature for security
    if (yocoWebhookSecret) {
      if (!signatureHeader) {
        console.error("⚠️ Missing Yoco signature header");
        return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
      }

      const isValidSignature = verifyYocoSignature(bodyText, signatureHeader, yocoWebhookSecret);
      if (!isValidSignature) {
        console.error("❌ Invalid Yoco signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
      }
    } else {
      console.warn("⚠️ Skipping signature verification - YOCO_WEBHOOK_SECRET not set");
    }

    const event = JSON.parse(bodyText);
    console.log(`🔄 Processing Yoco event: ${event.type || event.event}`);

    // Extract event data based on Yoco webhook format
    const { orderId, paymentId, amount, status, currency, eventType } = extractWebhookData(event);

    if (!orderId) {
      console.error("⚠️ Missing orderId in webhook metadata");
      return NextResponse.json({ error: "No orderId in metadata" }, { status: 400 });
    }

    console.log(`📦 Processing webhook for order ${orderId}, status: ${status}`);

    // Validate and process the order
    const result = await processOrderWebhook({
      orderId,
      paymentId,
      amount,
      status,
      currency,
      eventType,
      rawEvent: event
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode || 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Webhook processed successfully",
      orderId,
      status: result.newStatus
    });

  } catch (error) {
    console.error("❌ Yoco webhook processing error:", error);
    return NextResponse.json(
      { 
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Extract standardized data from Yoco webhook event
 */
function extractWebhookData(event: any) {
  let orderId: string | undefined;
  let paymentId: string | undefined;
  let amount: number | undefined;
  let status: string | undefined;
  let currency: string | undefined;
  let eventType: string | undefined;

  // Format 1: Checkout events (type = "checkout.completed")
  if (event.type) {
    eventType = event.type;
    orderId = event.data?.metadata?.orderId;
    paymentId = event.data?.id;
    status = event.data?.status;
    amount = event.data?.amount;
    currency = event.data?.currency;
  } 
  // Format 2: Payment events (event = "payment.succeeded")
  else if (event.event) {
    eventType = event.event;
    orderId = event.data?.metadata?.orderId;
    paymentId = event.data?.id;
    status = event.data?.status;
    amount = event.data?.amount;
    currency = event.data?.currency;
  }

  return { orderId, paymentId, amount, status, currency, eventType };
}

/**
 * Process order webhook and update database
 */
async function processOrderWebhook(params: {
  orderId: string;
  paymentId?: string;
  amount?: number;
  status?: string;
  currency?: string;
  eventType?: string;
  rawEvent: any;
}) {
  const { orderId, paymentId, amount, status, eventType, rawEvent } = params;

  // Find the order first to ensure it exists
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { 
      id: true, 
      status: true, 
      total: true, 
      paymentId: true,
      userEmail: true,
      createdAt: true
    }
  });

  if (!order) {
    console.error(`❌ Order not found: ${orderId}`);
    return { success: false, error: "Order not found", statusCode: 404 };
  }

  // Log current order status
  console.log(`📊 Order ${orderId} current status: ${order.status}`);

  // Skip processing if order is already in final state
  if (['PAID', 'FAILED', 'REFUNDED', 'CANCELLED'].includes(order.status)) {
    console.log(`ℹ️ Order ${orderId} already in final state: ${order.status}`);
    return { success: true, newStatus: order.status };
  }

  // Verify payment amount matches order total (security check)
  if (amount && order.total !== undefined) {
    const paymentAmountInRands = amount / 100; // Yoco amounts are in cents
    const amountDifference = Math.abs(order.total - paymentAmountInRands);
    
    if (amountDifference > 0.01) { // Allow small rounding differences
      console.error(`⚠️ Amount mismatch: Order R${order.total} vs Payment R${paymentAmountInRands}`);
      // Continue processing but log the discrepancy for review
    }
  }

  // Determine new status based on event type and status
  const { newStatus, updateData } = getStatusUpdate(eventType, status, paymentId, rawEvent);

  if (newStatus) {
    try {
      await prisma.order.update({
        where: { id: orderId },
        data: updateData,
      });

      console.log(`✅ Order ${orderId} updated to ${newStatus}`);

      // Trigger side effects based on status change
      await handleStatusSideEffects(orderId, newStatus, order.userEmail);

      return { success: true, newStatus };
    } catch (dbError) {
      console.error(`❌ Database update failed for order ${orderId}:`, dbError);
      return { success: false, error: "Database update failed" };
    }
  } else {
    console.log(`ℹ️ No status change needed for event: ${eventType} with status: ${status}`);
    return { success: true, newStatus: order.status };
  }
}

/**
 * Determine the new status and update data based on webhook event
 */
function getStatusUpdate(eventType?: string, status?: string, paymentId?: string, rawEvent?: any) {
  let newStatus: string | null = null;
  const updateData: any = {};

  // Checkout completed events
  if (eventType === "checkout.completed") {
    if (status === "successful") {
      newStatus = "PAID";
      updateData.status = newStatus;
      updateData.paymentConfirmedAt = new Date();
      updateData.paymentId = paymentId;
      updateData.paymentDetails = JSON.stringify(rawEvent.data);
    } else if (status === "failed") {
      newStatus = "FAILED";
      updateData.status = newStatus;
      updateData.paymentFailedAt = new Date();
    }
  }
  // Payment events
  else if (eventType === "payment.succeeded" || eventType === "payment.success") {
    if (status === "succeeded" || status === "successful") {
      newStatus = "PAID";
      updateData.status = newStatus;
      updateData.paymentConfirmedAt = new Date();
      updateData.paymentId = paymentId;
    }
  }
  // Failed events
  else if (eventType === "payment.failed" && status === "failed") {
    newStatus = "FAILED";
    updateData.status = newStatus;
    updateData.paymentFailedAt = new Date();
  }
  // Refunded events
  else if (eventType === "payment.refunded") {
    newStatus = "REFUNDED";
    updateData.status = newStatus;
    updateData.refundedAt = new Date();
  }
  // Cancelled events
  else if (eventType === "payment.canceled") {
    newStatus = "CANCELLED";
    updateData.status = newStatus;
    updateData.cancelledAt = new Date();
  }

  return { newStatus, updateData };
}

/**
 * Handle side effects after status change
 */
async function handleStatusSideEffects(orderId: string, newStatus: string, userEmail?: string) {
  try {
    switch (newStatus) {
      case "PAID":
        await sendOrderConfirmation(orderId, userEmail);
        await updateInventory(orderId);
        break;
      case "FAILED":
        await sendPaymentFailedNotification(orderId, userEmail);
        break;
      case "REFUNDED":
        await sendRefundConfirmation(orderId, userEmail);
        await restoreInventory(orderId);
        break;
    }
  } catch (error) {
    console.error(`❌ Side effects failed for order ${orderId}:`, error);
    // Don't fail the webhook if side effects fail
  }
}

/**
 * Verify Yoco webhook signature for security
 */
function verifyYocoSignature(rawBody: string, signature: string, webhookSecret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    // Use timingSafeEqual to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("❌ Signature verification failed:", error);
    return false;
  }
}

/**
 * Send order confirmation (placeholder implementation)
 */
async function sendOrderConfirmation(orderId: string, userEmail?: string) {
  try {
    console.log(`📧 Order confirmation would be sent for order ${orderId} to ${userEmail}`);
    // Integrate with your email service (SendGrid, Resend, etc.)
  } catch (error) {
    console.error("Failed to send order confirmation:", error);
  }
}

/**
 * Update inventory (placeholder implementation)
 */
async function updateInventory(orderId: string) {
  try {
    console.log(`📦 Inventory would be updated for order ${orderId}`);
    // Integrate with your inventory management system
  } catch (error) {
    console.error("Failed to update inventory:", error);
  }
}

/**
 * Send payment failed notification (placeholder implementation)
 */
async function sendPaymentFailedNotification(orderId: string, userEmail?: string) {
  try {
    console.log(`⚠️ Payment failed notification would be sent for order ${orderId}`);
    // Notify user of payment failure
  } catch (error) {
    console.error("Failed to send payment failed notification:", error);
  }
}

/**
 * Send refund confirmation (placeholder implementation)
 */
async function sendRefundConfirmation(orderId: string, userEmail?: string) {
  try {
    console.log(`💸 Refund confirmation would be sent for order ${orderId}`);
    // Notify user of refund
  } catch (error) {
    console.error("Failed to send refund confirmation:", error);
  }
}

/**
 * Restore inventory after refund (placeholder implementation)
 */
async function restoreInventory(orderId: string) {
  try {
    console.log(`🔄 Inventory would be restored for order ${orderId}`);
    // Restore inventory items after refund
  } catch (error) {
    console.error("Failed to restore inventory:", error);
  }
}

/**
 * Health check endpoint for webhook testing
 */
export async function GET() {
  return NextResponse.json({
    message: "Yoco webhook endpoint is active",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    status: "operational"
  });
}