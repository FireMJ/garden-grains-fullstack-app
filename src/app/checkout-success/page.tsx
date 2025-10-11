"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const params = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"checking" | "paid" | "pending" | "failed">("checking");
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    const orderId = params.get("orderId") || localStorage.getItem("pendingOrderId");
    if (!orderId) return;

    async function verifyOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        if (data.order?.status === "paid") {
          clearCart();
          localStorage.removeItem("pendingOrderId");
          setStatus("paid");
        } else if (data.order?.status === "failed" || data.order?.status === "cancelled") {
          setStatus("failed");
        } else {
          // still pending
          setRetries((r) => r + 1);
          setStatus("pending");
          if (retries < 6) {
            setTimeout(verifyOrder, 5000); // retry up to 6 times (~30s)
          } else {
            setStatus("failed");
          }
        }
      } catch (err) {
        console.error(err);
        setStatus("failed");
      }
    }

    verifyOrder();
  }, [params, clearCart, retries]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow text-center max-w-md w-full">
        {status === "checking" || status === "pending" ? (
          <>
            <h1 className="text-xl font-bold text-blue-600">🔄 Verifying Payment...</h1>
            <p className="mt-2 text-gray-600">
              Please wait while we confirm your order with Yoco.
            </p>
            {retries > 0 && (
              <p className="mt-2 text-sm text-yellow-600">
                Retrying... ({retries}/6)
              </p>
            )}
          </>
        ) : status === "paid" ? (
          <>
            <h1 className="text-2xl font-bold text-green-600">🎉 Payment Confirmed</h1>
            <p className="mt-2 text-gray-600">Your order has been placed successfully.</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Back to Menu
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-red-600">⚠️ Payment Not Verified</h1>
            <p className="mt-2 text-gray-600">
              We couldn’t confirm your payment. Please check your email or contact support.
            </p>
            <button
              onClick={() => router.push("/checkout")}
              className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
