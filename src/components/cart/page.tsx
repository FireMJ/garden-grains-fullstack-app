"use client";
import React from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  // calculate total
  const total = cart.reduce((sum, item) => {
    const addOnsTotal = item.addOns?.reduce((a, o) => a + o.price, 0) || 0;
    return sum + (item.price + addOnsTotal) * item.quantity || 1;
  }, 0);

  return (
    <main className="min-h-screen bg-[#F3F5F0] p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2F5D50] mb-6">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600 mb-4">Your cart is empty 🛒</p>
          <Link
            href="/menu"
            className="inline-block bg-[#2F5D50] hover:bg-[#244a3f] text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 flex gap-4"
            >
              {/* Item Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}

              {/* Item Details */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-[#2F5D50]">
                  {item.name}
                </h2>
                <p className="text-gray-600">
                  R{item.price} × {item.quantity || 1}
                </p>

                {/* Add-ons */}
                {item.addOns && item.addOns.length > 0 && (
                  <p className="text-sm text-gray-700 mt-1">
                    Extras:{" "}
                    {item.addOns.map((a) => `${a.name} (+R${a.price})`).join(", ")}
                  </p>
                )}

                {/* Special instructions */}
                {item.instructions && (
                  <p className="text-sm italic text-gray-500">
                    “{item.instructions}”
                  </p>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(index)}
                  className="mt-2 text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-xl shadow text-right">
            <p className="text-lg font-semibold text-[#2F5D50] mb-4">
              Total: R{total.toFixed(2)}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={clearCart}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
              >
                Clear Cart
              </button>
              <Link
                href="/checkout"
                className="bg-[#2F5D50] hover:bg-[#244a3f] text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Checkout →
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
