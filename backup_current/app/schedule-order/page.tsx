import FixedHeader from '@/components/FixedHeader';
<FixedHeader />
<FixedHeader />

import { useState } from "react";
import { useCart, type CartItem } from "@/contexts/CartContext";
import Link from "next/link";

export default function ScheduleOrderPage() {
  const { cart: cartItems } = useCart();
  // Calculate values since they are not provided by CartContext
  const totalItems = (cartItems || []).reduce((total: number, item: CartItem) => total + (item.quantity || 1), 0);
  const totalPrice = (cartItems || []).reduce((total: number, item: CartItem) => total + (item.price || 0) * (item.quantity || 1), 0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const itemCount = totalItems;
  const total = totalPrice;

  const handleScheduleOrder = () => {
    // Save scheduled order to localStorage or send to API
    const scheduledOrder = {
      date: selectedDate,
      time: selectedTime,
      address: deliveryAddress,
      instructions: specialInstructions,
      itemsCount: itemCount,
      total: total,
      scheduledAt: new Date().toISOString()
    };
    
    localStorage.setItem('scheduledOrder', JSON.stringify(scheduledOrder));
    alert('Order scheduled successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Schedule Order</h1>
              <p className="text-gray-600">Plan your meal for later</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/menu"
                className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition font-semibold"
              >
                Add More Items
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Schedule Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Details</h2>
            
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
                  required
                >
                  <option value="">Select a time</option>
                  <option value="08:00-09:00">8:00 AM - 9:00 AM</option>
                  <option value="09:00-10:00">9:00 AM - 10:00 AM</option>
                  <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                  <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
                  <option value="12:00-13:00">12:00 PM - 1:00 PM</option>
                  <option value="13:00-14:00">1:00 PM - 2:00 PM</option>
                  <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
                  <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
                  <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
                  <option value="17:00-18:00">5:00 PM - 6:00 PM</option>
                </select>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
                  placeholder="Enter your delivery address"
                  required
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
                  placeholder="Any special instructions for delivery or preparation"
                />
              </div>

              <button
                onClick={handleScheduleOrder}
                disabled={!selectedDate || !selectedTime || !deliveryAddress || itemCount === 0}
                className="w-full bg-[#F4A261] text-white py-3 rounded-lg hover:bg-[#e68e42] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Order
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {itemCount > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Items in Cart:</span>
                  <span className="font-semibold">{itemCount}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-[#F4A261]">R {total.toFixed(2)}</span>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-green-800 mb-2">Scheduled Order Benefits</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Guaranteed delivery time</li>
                    <li>• Fresh preparation</li>
                    <li>• Skip the queue</li>
                    <li>• Peace of mind</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link
                  href="/menu"
                  className="bg-[#F4A261] text-white px-6 py-2 rounded-lg hover:bg-[#e68e42] transition font-semibold inline-block"
                >
                  Browse Menu
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
