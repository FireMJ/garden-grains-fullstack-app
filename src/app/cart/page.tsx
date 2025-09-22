"use client";
import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, scheduledDate, scheduledTime } = useCart();

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity +
      (item.addOns?.reduce((a, o) => a + o.price, 0) ?? 0),
    0
  );

  return (
    <main className="px-4 py-8 bg-[#F3F5F0] min-h-screen">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-700 text-lg mb-8">Your cart is empty.</p>
          <Link 
            href="/"
            className="px-6 py-3 rounded-lg bg-[#F4A261] text-white font-semibold hover:bg-[#e68e42] transition"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
              <div className="flex justify-between">
                <h3 className="font-semibold text-green-900">{item.name}</h3>
                <p className="text-sm text-gray-700">
                  R {item.price} × {item.quantity}
                </p>
              </div>
              {item.dressing && (
                <p className="text-xs text-gray-600">Dressing: {item.dressing}</p>
              )}
              {item.addOns && item.addOns.length > 0 && (
                <p className="text-xs text-gray-600">
                  Add-ons: {item.addOns.map((a) => `${a.name} (+R${a.price})`).join(", ")}
                </p>
              )}
              {item.instructions && (
                <p className="text-xs text-gray-600 italic">Note: {item.instructions}</p>
              )}
              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Show schedule if set */}
          {(scheduledDate || scheduledTime) && (
            <div className="bg-yellow-50 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-800">
                🗓 Scheduled for:{" "}
                <strong>{scheduledDate ?? "Not set"} at {scheduledTime ?? "Not set"}</strong>
              </p>
            </div>
          )}

          {/* Cart Total */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-lg font-bold text-green-900">
              Total: R {total.toFixed(2)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition text-center font-medium"
            >
              ← Add More Items
            </Link>
            <button
              onClick={clearCart}
              className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              Clear Cart
            </button>
            <Link
              href="/checkout"
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-center font-semibold hover:bg-green-700 transition"
            >
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}