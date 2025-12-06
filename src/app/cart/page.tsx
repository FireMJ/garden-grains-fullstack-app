"use client";
export const dynamic = "force-dynamic";

import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const {
    cartItems: cart,
    totalPrice: cartTotal,
    clearCart,
    updateQuantity,
    removeFromCart
  } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert("Checkout would process in a real app");
      setIsProcessing(false);
    }, 1000);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Link
            href="/menu"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="bg-white rounded-lg shadow-md mb-6">
          {cart.map((item: any) => (
            <div key={item.id} className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">R {(item.price || 0).toFixed(2)} each</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    R {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      className="text-sm bg-gray-100 px-2 py-1 rounded"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="text-sm bg-gray-100 px-2 py-1 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="mb-6">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>R {cartTotal?.toFixed(2) || "0.00"}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
