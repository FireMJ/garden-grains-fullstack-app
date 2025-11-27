"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function FloatingCart() {
  const { state, removeFromCart, updateQuantity } = useCart();
  const cart = state.items;
  const isCartOpen = false; // Assuming no cart open state management yet
  const openCart = () => {}; // Placeholder
  const closeCart = () => {}; // Placeholder
  const [isExpanded, setIsExpanded] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity +
      (item.addOns?.reduce((a, o) => a + o.price, 0) ?? 0) +
      (item.friesUpsell?.reduce((a, f) => a + (f.price || 0), 0) ?? 0) +
      (item.juiceUpsell?.reduce((a, j) => a + (j.price || 0), 0) ?? 0),
    0
  );

  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 bg-green-600 text-white font-semibold py-4 px-4 rounded-full shadow-lg hover:bg-green-700 transition flex items-center gap-2 z-40"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="bg-white text-green-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      </button>

      {/* Expanded Cart Panel */}
      {isExpanded && (
        <div className="fixed bottom-20 right-6 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-y-auto z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Cart</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>R {item.price.toFixed(2)} × {item.quantity}</div>
                        
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="text-xs">
                            Add-ons: {item.addOns.map((a: any) => a.name).join(", ")}
                          </div>
                        )}
                        
                        {item.friesUpsell && item.friesUpsell.length > 0 && (
                          <div className="text-xs">
                            Fries: {item.friesUpsell?.map((f: any) => f.name).join(", ") || ""}
                          </div>
                        )}
                        
                        {item.juiceUpsell && item.juiceUpsell.length > 0 && (
                          <div className="text-xs">
                            Juices: {item.juiceUpsell?.map((j: any) => `${j.name} (${j.size || "regular"})`).join(", ") || ""}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 hover:bg-red-200 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-green-600">R {total.toFixed(2)}</span>
              </div>
              
              <button
                onClick={() => {
                  setIsExpanded(false);
                  openCart();
                }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                View Full Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
