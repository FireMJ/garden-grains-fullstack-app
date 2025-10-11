// app/api/orders/reconcile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Utility to verify payment status with Yoco
async function verifyYocoPayment(paymentId: string) {
  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  // Check if Yoco secret key is available
  if (!process.env.YOCO_SECRET_KEY) {
    throw new Error("YOCO_SECRET_KEY is not configured");
  }

  const res = await fetch(`https://online.yoco.com/v1/charges/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Yoco API error: ${res.status} ${res.statusText}`);
  }

  const payment = await res.json();
  return payment;
}

async function handleReconcile() {
  try {
    // Find orders that are pending and created more than 5 minutes ago
    const cutoff = new Date(Date.now() - 5 * 60 * 1000);
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        createdAt: { lt: cutoff },
        paymentId: { not: null },
      },
      select: {
        id: true,
        paymentId: true,
        total: true,
        userEmail: true,
        createdAt: true,
        status: true,
      },
    });

    console.log(`🔍 Reconciling ${pendingOrders.length} pending orders...`);

    const results = {
      checked: pendingOrders.length,
      paid: [] as string[],
      failed: [] as string[],
      errors: [] as string[],
      skipped: [] as string[],
    };

    for (const order of pendingOrders) {
      try {
        if (!order.paymentId) {
          results.skipped.push(order.id);
          continue;
        }

        console.log(`🔄 Checking payment status for order ${order.id}, payment: ${order.paymentId}`);

        const payment = await verifyYocoPayment(order.paymentId);
        
        let newStatus: "PAID" | "FAILED" | "PENDING" = "PENDING";

        switch (payment.status) {
          case "successful":
          case "succeeded":
            newStatus = "PAID";
            results.paid.push(order.id);
            break;
          case "failed":
          case "cancelled":
          case "canceled":
            newStatus = "FAILED";
            results.failed.push(order.id);
            break;
          default:
            // If still pending but older than 5 min, mark as failed for safety
            newStatus = "FAILED";
            results.failed.push(order.id);
            console.log(`⚠️ Order ${order.id} has unknown status "${payment.status}", marking as FAILED`);
            break;
        }

        // Only update if status changed
        if (order.status !== newStatus) {
          await prisma.order.update({
            where: { id: order.id },
            data: { 
              status: newStatus,
              ...(newStatus === "PAID" && { paidAt: new Date() }),
              ...(newStatus === "FAILED" && { paymentFailedAt: new Date() })
            },
          });
          console.log(`✅ Order ${order.id} updated from ${order.status} to ${newStatus}`);
        } else {
          console.log(`ℹ️ Order ${order.id} already has status ${newStatus}, skipping update`);
          results.skipped.push(order.id);
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error reconciling order ${order.id}:`, errorMessage);
        results.errors.push(`Order ${order.id}: ${errorMessage}`);
        
        // Mark as failed if we can't verify payment status
        try {
          await prisma.order.update({
            where: { id: order.id },
            data: { 
              status: "FAILED",
              paymentFailedAt: new Date()
            },
          });
          console.log(`⚠️ Order ${order.id} marked as FAILED due to verification error`);
        } catch (dbError) {
          console.error(`❌ Failed to update order ${order.id} status:`, dbError);
        }
      }
    }

    const message = `Reconciliation completed. Checked: ${results.checked}, Paid: ${results.paid.length}, Failed: ${results.failed.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`;
    
    console.log(`📊 ${message}`);

    return {
      success: true,
      message,
      ...results,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error("❌ Reconciliation process failed:", error);
    throw error; // Re-throw to be handled by the route handlers
  }
}

export async function GET() {
  try {
    const result = await handleReconcile();
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ GET reconciliation failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Reconciliation process failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await handleReconcile();
    
    // Enhance the response for POST requests
    return NextResponse.json({
      ...result,
      triggeredBy: "POST request",
      manualReconciliation: true,
    });
  } catch (error) {
    console.error("❌ POST reconciliation failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Manual reconciliation failed",
        details: error instanceof Error ? error.message : "Unknown error",
        triggeredBy: "POST request"
      },
      { status: 500 }
    );
  }
}

// Optional: Add a simple health check
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}