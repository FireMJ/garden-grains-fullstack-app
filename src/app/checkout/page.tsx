"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const {
    state: { items: cart, total: cartTotal, itemCount },
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryInstructions: "",
    paymentMethod: "card",
  });

  const getCartTotal = () => {
    return cartTotal;
  };

  const getTotalItems = () => {
    return itemCount;
  };

  const deliveryFee = getCartTotal() > 200 ? 0 : 25;
  const finalTotal = getCartTotal() + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }

    // In a real app, you would process the payment and order here
    alert("Order placed successfully! Thank you for your order.");
    clearCart();
    // Redirect to order confirmation page
    window.location.href = "/order-confirmation";
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#1E4259] pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#F4A261] mb-8">Checkout</h1>
          <div className="bg-white/10 rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-300 mb-6">Add some delicious items from our menu to checkout!</p>
            <a 
              href="/menu"
              className="inline-block bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition font-semibold"
            >
              Browse Menu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E4259] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#F4A261] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Delivery Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
                  placeholder="+27 12 345 6789"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Delivery Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
                  placeholder="123 Main Street, Newlands"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
                    placeholder="Cape Town"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
                    placeholder="7700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Delivery Instructions (Optional)</label>
                <textarea
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] resize-none"
                  placeholder="Gate code, building number, etc."
                />
              </div>

              <div>
                <label className="block text-white mb-2">Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="cash">Cash on Delivery</option>
                  <option value="eft">EFT</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#F4A261] text-white rounded-lg hover:bg-[#e68e42] transition font-semibold text-lg"
              >
                Place Order - R{finalTotal.toFixed(2)}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-white/10">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-gray-300 text-sm">Qty: {item.quantity}</p>
                    
                    {/* Display customizations */}
                    {item.addOns && item.addOns.length > 0 && (
                      <div className="mt-1">
                        <p className="text-xs text-gray-400">Add-ons: {item.addOns.map((addOn: any) => addOn.name).join(", ")}</p>
                      </div>
                    )}
                    
                    {item.friesUpsell && item.friesUpsell.length > 0 && (
                      <p className="text-xs text-gray-400">Fries: {item.friesUpsell.map((fry: any) => fry.name).join(", ")}</p>
                    )}
                    
                    {item.juiceUpsell && item.juiceUpsell.length > 0 && (
                      <p className="text-xs text-gray-400">Juice: {item.juiceUpsell.map((juice: any) => juice.name).join(", ")}</p>
                    )}
                  </div>
                  <span className="text-[#F4A261] font-semibold">
                    R{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-white/20 pt-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
                <span>R{getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-300">
                <span>Delivery Fee</span>
                <span>R{deliveryFee.toFixed(2)}</span>
              </div>
              
              {deliveryFee === 0 && (
                <div className="flex justify-between text-green-400 text-sm">
                  <span>Free Delivery Applied!</span>
                  <span>-R25.00</span>
                </div>
              )}
              
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between text-lg font-semibold text-white">
                  <span>Total</span>
                  <span>R{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {getCartTotal() < 200 && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm text-center">
                  Add R{(200 - getCartTotal()).toFixed(2)} more for free delivery!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
