/**
 * test-yoco-webhook.ts
 * 
 * Run: npx ts-node test-yoco-webhook.ts
 */

import fetch from "node-fetch";
import crypto from "crypto";

// Your local webhook URL (use ngrok if testing locally)
const WEBHOOK_URL = "http://localhost:3000/api/webhooks/yoco";

// Secret key for signing webhook (matches YOCO_WEBHOOK_SECRET in .env)
const YOCO_WEBHOOK_SECRET = process.env.YOCO_WEBHOOK_SECRET || "test_secret";

// Sample order IDs to test
const SAMPLE_ORDER_ID = "order_test_001";

// Types of events to test
const EVENTS = [
  { type: "checkout.completed", status: "successful" },
  { type: "checkout.completed", status: "FAILED" },
  { type: "payment.refunded", status: "refunded" },
  { type: "payment.canceled", status: "canceled" },
];

function generateSignature(payload: string) {
  return crypto.createHmac("sha256", YOCO_WEBHOOK_SECRET).update(payload).digest("hex");
}

async function sendWebhook(event: any) {
  const payload = JSON.stringify({
    type: event.type,
    data: {
      id: "pay_test_001",
      status: event.status,
      metadata: { orderId: SAMPLE_ORDER_ID },
      amount: 12345, // in cents
      currency: "ZAR"
    }
  });

  const signature = generateSignature(payload);

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-yoco-signature": signature,
    },
    body: payload,
  });

  const data = await res.json();
  console.log(`✅ Event: ${event.type} / ${event.status} -> Response:`, data);
}

// Run all events sequentially
(async () => {
  for (const event of EVENTS) {
    await sendWebhook(event);
  }
})();
