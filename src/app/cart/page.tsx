"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const deliveryFee = state.total > 0 ? 45 : 0; // R45 delivery fee
  const freeDeliveryThreshold = 850; // R850 for free delivery
  const qualifiesForFreeDelivery = state.total >= freeDeliveryThreshold;
  const finalTotal = qualifiesForFreeDelivery ? state.total : state.total + deliveryFee;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#1E4259] text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#F4A261]">Your Cart</h1>
          <p className="text-xl mb-8">Your cart is empty</p>
          <button
            onClick={() => router.push("/menu")}
            className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E4259] text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-[#F4A261]">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm"
              >
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6C7B58] to-[#8A9B6E] flex items-center justify-center">
                      <span className="text-white/80 text-xs">Image</span>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-green-200">{item.name}</h3>
                        <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                        
                        {/* Base Selection */}
                        {item.base && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Base: <span className="text-white">{item.base}</span></p>
                          </div>
                        )}

                        {/* Dressing Selection */}
                        {item.dressing && (
                          <div className="mt-1">
                            <p className="text-sm text-gray-400">Dressing: <span className="text-white">{item.dressing}</span></p>
                          </div>
                        )}

                        {/* Add-ons */}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Add-ons:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.addOns.map((addOn) => (
                                <span
                                  key={addOn.id}
                                  className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                                >
                                  {addOn.name} +R{addOn.price}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Fries - FIXED: using 'fries' not 'friesUpsell' */}
                        {item.fries && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Fries:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                                {item.fries.name} +R{item.fries.price}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Juice */}
                        {item.juice && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Juice:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">
                                {item.juice.size} {item.juice.option.name} +R{item.juice.option.price}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Special Instructions */}
                        {item.specialInstructions && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Special Instructions:</p>
                            <p className="text-white text-sm mt-1">{item.specialInstructions}</p>
                          </div>
                        )}
                      </div>

                      {/* Price and Quantity */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#F4A261]">R{item.total.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                          >
                            -
                          </button>
                          <span className="font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
              <h2 className="text-2xl font-bold text-[#F4A261] mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>R{state.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {qualifiesForFreeDelivery ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      `R${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {!qualifiesForFreeDelivery && (
                  <div className="text-sm text-yellow-400 bg-yellow-400/10 p-2 rounded">
                    Add R{(freeDeliveryThreshold - state.total).toFixed(2)} more for FREE delivery!
                  </div>
                )}

                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#F4A261]">R{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-[#F4A261] hover:bg-[#e68e42] text-white font-bold py-4 px-6 rounded-lg transition text-lg"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => router.push("/menu")}
                  className="w-full bg-transparent border border-white text-white hover:bg-white/10 py-3 px-6 rounded-lg transition"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() => router.push("/schedule-order")}
                  className="w-full bg-[#6C7B58] hover:bg-[#5a6a4d] text-white py-3 px-6 rounded-lg transition"
                >
                  Schedule Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
