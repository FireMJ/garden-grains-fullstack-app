"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    instructions: ""
  });

  const deliveryFee = state.total > 0 ? 45 : 0;
  const freeDeliveryThreshold = 850;
  const qualifiesForFreeDelivery = state.total >= freeDeliveryThreshold;
  const finalTotal = qualifiesForFreeDelivery ? state.total : state.total + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically integrate with your payment processor
    alert("Order placed successfully! (Payment integration would go here)");
    clearCart();
    router.push("/order-confirmation");
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#1E4259] text-white pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#F4A261]">Checkout</h1>
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
        <h1 className="text-4xl font-bold mb-8 text-[#F4A261]">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-[#F4A261] mb-4">Delivery Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F4A261]"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F4A261]"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F4A261]"
                      placeholder="Enter your email (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F4A261]"
                      placeholder="Enter your delivery address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Instructions</label>
                    <textarea
                      name="instructions"
                      value={customerInfo.instructions}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F4A261] resize-none"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-[#F4A261] mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      defaultChecked
                      className="w-4 h-4 text-[#F4A261]"
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      className="w-4 h-4 text-[#F4A261]"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="yoco"
                      className="w-4 h-4 text-[#F4A261]"
                    />
                    <span>Yoco Payment</span>
                  </label>
                </div>

                {/* Payment integration would go here */}
                <div className="mt-4 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    Payment integration would be implemented here with Yoco, Stripe, or another payment processor.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F4A261] hover:bg-[#e68e42] text-white font-bold py-4 px-6 rounded-lg transition text-lg"
              >
                Place Order - R{finalTotal.toFixed(2)}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
              <h2 className="text-2xl font-bold text-[#F4A261] mb-4">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-white/10">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-green-200">{item.name}</h3>
                        <p className="font-bold text-[#F4A261]">R{item.total.toFixed(2)}</p>
                      </div>
                      
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>

                      {/* Base Selection */}
                      {item.base && (
                        <p className="text-xs text-gray-400">Base: {item.base}</p>
                      )}

                      {/* Dressing Selection */}
                      {item.dressing && (
                        <p className="text-xs text-gray-400">Dressing: {item.dressing}</p>
                      )}

                      {/* Add-ons */}
                      {item.addOns && item.addOns.length > 0 && (
                        <p className="text-xs text-gray-400">
                          Add-ons: {item.addOns.map(addOn => addOn.name).join(", ")}
                        </p>
                      )}

                      {/* Fries - FIXED: using 'fries' not 'friesUpsell' */}
                      {item.fries && (
                        <p className="text-xs text-gray-400">Fries: {item.fries.name}</p>
                      )}

                      {/* Juice */}
                      {item.juice && (
                        <p className="text-xs text-gray-400">
                          Juice: {item.juice.size} {item.juice.option.name}
                        </p>
                      )}

                      {/* Special Instructions */}
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-400">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
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

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-green-400/10 border border-green-400/20 rounded-lg">
                <h3 className="font-semibold text-green-400 mb-2">Delivery Information</h3>
                <p className="text-sm text-gray-300">
                  • Free delivery on orders over R850<br/>
                  • Delivery within 10km radius<br/>
                  • Estimated delivery time: 30-45 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
