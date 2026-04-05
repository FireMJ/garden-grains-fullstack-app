"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function CartPage() {
  const { user } = useAuth();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("🛒 Cart items from context:", cart.cartItems);
  }, []);

  // Wait for client-side hydration
  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#F3F5F0] p-6 sm:p-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </main>
    );
  }

  // Get cart items - YOUR CART HAS ITEMS!
  const cartItems = cart.cartItems || [];
  
  // Debug: Log what we have
  console.log("📦 Rendering with", cartItems.length, "items");

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F3F5F0] p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2F5D50] mb-6">
          Your Cart
        </h1>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600 mb-4">Your cart is empty 🛒</p>
          <Link
            href="/menu"
            className="inline-block bg-[#2F5D50] hover:bg-[#244a3f] text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F5F0] p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2F5D50] mb-6">
        Your Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="space-y-6">
        {cartItems.map((item) => {
          // Calculate item total including add-ons
          const addOnsTotal = item.addOns?.reduce((sum, addOn) => sum + (addOn.price || 0), 0) || 0;
          const friesTotal = item.fries?.price || item.friesUpsell?.price || 0;
          const juiceTotal = item.juice?.price || item.juiceUpsell?.price || 0;
          const baseExtra = item.baseExtra || 0;
          
          const itemTotal = (item.price + addOnsTotal + friesTotal + juiceTotal + baseExtra) * item.quantity;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition"
            >
              {/* Item Image */}
              {item.image && (
                <div className="relative w-24 h-24 flex-shrink-0 mx-auto sm:mx-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="96px"
                  />
                </div>
              )}

              {/* Item Details */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#2F5D50]">
                      {item.name}
                    </h2>
                    <p className="text-gray-600">
                      R{item.price.toFixed(2)} each
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Base and Dressing */}
                {item.base && (
                  <p className="text-sm text-gray-600 mt-1">Base: {item.base}</p>
                )}
                {item.dressing && (
                  <p className="text-sm text-gray-600">Dressing: {item.dressing}</p>
                )}

                {/* Add-ons */}
                {item.addOns && item.addOns.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 font-medium">Extras:</p>
                    <ul className="text-sm text-gray-600">
                      {item.addOns.map((addOn, idx) => (
                        <li key={idx}>
                          • {addOn.name} (+R{addOn.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fries */}
                {item.fries && (
                  <p className="text-sm text-gray-600 mt-1">
                    + {item.fries.name} (+R{item.fries.price.toFixed(2)})
                  </p>
                )}

                {/* Juice */}
                {item.juice && (
                  <p className="text-sm text-gray-600">
                    + {item.juice.option?.name || item.juice.name} 
                    {item.juice.size && ` (${item.juice.size})`} 
                    (+R{item.juice.price?.toFixed(2) || item.juice.option?.price.toFixed(2)})
                  </p>
                )}

                {/* Special instructions */}
                {item.specialInstructions && (
                  <p className="text-sm italic text-gray-500 mt-2">
                    “{item.specialInstructions}”
                  </p>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => cart.removeFromCart(item.id)}
                  className="mt-3 text-red-600 text-sm hover:underline font-medium"
                >
                  Remove Item
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-semibold text-[#2F5D50]">
                  R{itemTotal.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}

        {/* Cart Summary */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center text-gray-600">
              <span>Subtotal</span>
              <span>R {(cart.totalPrice || 0).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-gray-600">
              <span>Delivery Fee</span>
              <span className={cart.isFreeDelivery ? 'text-green-600 font-medium' : ''}>
                {cart.isFreeDelivery ? 'FREE' : `R ${(cart.deliveryFee || 35).toFixed(2)}`}
              </span>
            </div>

            {/* Free delivery progress */}
            {!cart.isFreeDelivery && (cart.totalPrice || 0) > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Free delivery over R850</span>
                  <span>R{(850 - (cart.totalPrice || 0)).toFixed(2)} more to go!</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#2F5D50] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, ((cart.totalPrice || 0) / 850) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-xl font-bold text-[#2F5D50] border-t pt-3">
              <span>Total</span>
              <span>R {(cart.finalTotal || cart.totalPrice || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button
              onClick={cart.clearCart}
              className="w-full sm:flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-medium transition"
            >
              Clear Cart
            </button>
            <Link
              href="/checkout"
              className="w-full sm:flex-1 bg-[#2F5D50] hover:bg-[#244a3f] text-white px-6 py-3 rounded-lg font-semibold transition text-center"
            >
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}