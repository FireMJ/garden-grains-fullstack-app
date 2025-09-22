"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function ScheduleOrderPage() {
  const { 
    cart, 
    scheduledDate, 
    scheduledTime, 
    setSchedule 
  } = useCart();
  
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Initialize form with existing schedule if available
  useEffect(() => {
    if (scheduledDate && scheduledTime) {
      setSelectedDateTime(`${scheduledDate}T${scheduledTime}`);
      setIsConfirmed(true);
    }
  }, [scheduledDate, scheduledTime]);

  // Calculate total safely including all components
  const total = cart.reduce((sum, item) => {
    const baseTotal = item.price * item.quantity;
    const addOnsTotal = item.addOns?.reduce((a, o) => a + (o.price * (o.quantity || 1)), 0) || 0;
    const friesTotal = item.fries?.reduce((a, o) => a + (o.price * (o.quantity || 1)), 0) || 0;
    const juiceTotal = item.juices?.reduce((a, o) => a + (o.price * (o.quantity || 1)), 0) || 0;
    return sum + baseTotal + addOnsTotal + friesTotal + juiceTotal;
  }, 0);

  const handleDateTimeConfirm = () => {
    if (selectedDateTime) {
      const [date, time] = selectedDateTime.split('T');
      setSchedule(date, time);
      setIsConfirmed(true);
      alert(`Order scheduled for ${new Date(selectedDateTime).toLocaleString()}`);
    }
  };

  const handleClearSchedule = () => {
    setSchedule('', '');
    setSelectedDateTime('');
    setIsConfirmed(false);
  };

  const handleCheckout = () => {
    if (scheduledDate && scheduledTime) {
      // Redirect to checkout with schedule parameters
      window.location.href = `/checkout?scheduleDate=${encodeURIComponent(scheduledDate)}&scheduleTime=${encodeURIComponent(scheduledTime)}`;
    } else {
      window.location.href = '/checkout';
    }
  };

  // Format date for display
  const formatScheduleDate = () => {
    if (!scheduledDate || !scheduledTime) return "";
    const date = new Date(`${scheduledDate}T${scheduledTime}`);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-[#1E4259] mb-8">Schedule Your Order</h1>
      
      {/* Cart Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item, index) => {
          const itemTotal = (item.price * item.quantity) +
            (item.addOns?.reduce((a, o) => a + (o.price * (o.quantity || 1)), 0) || 0) +
            (item.fries?.reduce((a, o) => a + (o.price * (o.quantity || 1)), 0) || 0) +
            (item.juices?.reduce((a, o) => a + (o.price * (o.quantity || 1)), 0) || 0);
            
          return (
            <div key={item.id || index} className="flex justify-between py-2 border-b">
              <div>
                <span>{item.name} × {item.quantity}</span>
                {item.addOns && item.addOns.length > 0 && (
                  <div className="text-sm text-gray-600 ml-2">
                    Add-ons: {item.addOns.map(a => a.name).join(', ')}
                  </div>
                )}
                {item.fries && item.fries.length > 0 && (
                  <div className="text-sm text-gray-600 ml-2">
                    Fries: {item.fries.map(f => f.name).join(', ')}
                  </div>
                )}
                {item.juices && item.juices.length > 0 && (
                  <div className="text-sm text-gray-600 ml-2">
                    Juices: {item.juices.map(j => `${j.name} (${j.size})`).join(', ')}
                  </div>
                )}
              </div>
              <span>R{itemTotal.toFixed(2)}</span>
            </div>
          );
        })}
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
          <span>Total</span>
          <span>R{(total || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Delivery/Pickup Time
          </label>
          <input
            type="datetime-local"
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1E4259] focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDateTimeConfirm}
            disabled={!selectedDateTime}
            className="flex-1 bg-[#2A536B] text-white py-3 rounded-md hover:bg-[#1E4259] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConfirmed ? 'Update Schedule' : 'Confirm Schedule'}
          </button>
          
          {isConfirmed && (
            <button
              onClick={handleClearSchedule}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition"
            >
              Clear Schedule
            </button>
          )}
        </div>

        {isConfirmed && scheduledDate && scheduledTime && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
            <p>✅ Order scheduled for {formatScheduleDate()}</p>
          </div>
        )}
      </div>

      {/* Checkout Action */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="w-full bg-[#1E4259] text-white py-4 rounded-md hover:bg-[#2A536B] transition disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
        >
          {scheduledDate && scheduledTime 
            ? 'Proceed to Checkout (Scheduled)' 
            : 'Proceed to Checkout'}
        </button>
        
        {!scheduledDate && !scheduledTime && (
          <p className="text-sm text-gray-600 mt-3 text-center">
            Your order will be prepared immediately upon checkout
          </p>
        )}
      </div>
    </div>
  );
}