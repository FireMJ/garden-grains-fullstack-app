"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saveOrder = async () => {
      if (!session || cart.length === 0) {
        setSaving(false);
        return;
      }

      try {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            total: cart.reduce(
              (acc, item) => acc + item.price * (item.quantity || 1),
              0
            ),
            userEmail: session.user?.email,
          }),
        });

        if (res.ok) {
          setSaved(true);
          clearCart(); // ✅ only clear after order saved
        }
      } catch (err) {
        console.error("Failed to save order:", err);
      } finally {
        setSaving(false);
      }
    };

    saveOrder();
  }, [session, cart, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your order, {session?.user?.name || "Guest"}!
      </p>

      {saving && (
        <p className="text-gray-500">Saving your order, please wait...</p>
      )}

      {!saving && saved && (
        <>
          <p className="text-gray-700 mb-4">
            Your order has been saved successfully.  
            You’ll receive updates once it’s prepared.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            Back to Home
          </button>
        </>
      )}

      {!saving && !saved && (
        <p className="text-red-600">
          Something went wrong saving your order. Please contact support.
        </p>
      )}
    </div>
  );
}
