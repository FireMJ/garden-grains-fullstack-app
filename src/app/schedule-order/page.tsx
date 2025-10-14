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
  const [okPressed, setOkPressed] = useState(false);

  useEffect(() => {
    if (scheduledDate && scheduledTime) {
      setSelectedDateTime(`${scheduledDate}T${scheduledTime}`);
      setIsConfirmed(true);
    }
  }, [scheduledDate, scheduledTime]);

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

  const handleOkPress = () => {
    if (selectedDateTime) {
      setOkPressed(true);
      alert(`Date/Time selected: ${new Date(selectedDateTime).toLocaleString()}`);
    }
  };

  const handleClearSchedule = () => {
    setSchedule('', '');
    setSelectedDateTime('');
    setIsConfirmed(false);
    setOkPressed(false);
  };

  const handleCheckout = () => {
    if (scheduledDate && scheduledTime) {
      window.location.href = `/checkout?scheduleDate=${encodeURIComponent(scheduledDate)}&scheduleTime=${encodeURIComponent(scheduledTime)}`;
    } else {
      window.location.href = '/checkout';
    }
  };

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
      <h1 className="text-3xl font-bold text-[#0F3C5F] mb-8">Schedule Your Order</h1>
      
      {/* Cart Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#1C4A6E]">Order Summary</h2>
        {cart.map((item, index) => {
          const itemTotal = (item.price * item.quantity) +
            (item.addOns?.reduce((a, o) => a + (o.price * (o.quantity || 1)), 0) || 0) +
            (item.fries?.reduce((a, o) => a + (o.price * (o.quantity || 1)), 0) || 0) +
            (item.juices?.reduce((a, o) => a + (o.price * (o.quantity || 1)), 0) || 0);
            
          return (
            <div key={item.id || index} className="flex flex-col py-2 border-b">
              <div className="flex justify-between">
                <span className="text-gray-900 font-medium">{item.name} × {item.quantity}</span>
                <span className="text-gray-900 font-semibold">R{itemTotal.toFixed(2)}</span>
              </div>

              {item.addOns && item.addOns.length > 0 && (
                <div className="text-sm text-teal-700 ml-2 mt-1">
                  Add-ons: {item.addOns.map(a => a.name).join(', ')}
                </div>
              )}
              {item.fries && item.fries.length > 0 && (
                <div className="text-sm text-amber-600 ml-2 mt-1">
                  Fries: {item.fries.map(f => f.name).join(', ')}
                </div>
              )}
              {item.juices && item.juices.length > 0 && (
                <div className="text-sm text-purple-700 ml-2 mt-1">
                  Juices: {item.juices.map(j => `${j.name} (${j.size})`).join(', ')}
                </div>
              )}
            </div>
          );
        })}
        <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t text-[#0F3C5F]">
          <span>Total</span>
          <span>R{(total || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#1C4A6E]">Select Date & Time</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Delivery/Pickup Time
          </label>
          <input
            type="datetime-local"
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0F3C5F] focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDateTimeConfirm}
            disabled={!selectedDateTime}
            className="flex-1 bg-[#2A536B] text-gray-200 py-3 rounded-md hover:bg-[#1E4259] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Confirm Schedule
          </button>

          <button
            onClick={handleOkPress}
            disabled={!selectedDateTime}
            className="flex-1 bg-[#FFB347] text-gray-900 py-3 rounded-md hover:bg-[#FFA500] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            OK
          </button>

          {isConfirmed && (
            <button
              onClick={handleClearSchedule}
              className="flex-1 bg-[#E0E0E0] text-gray-800 py-3 rounded-md hover:bg-[#D1D1D1] transition font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {isConfirmed && scheduledDate && scheduledTime && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md font-medium">
            ✅ Order scheduled for {formatScheduleDate()}
          </div>
        )}

        {okPressed && !isConfirmed && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md font-medium">
            ℹ️ Date/Time selected: {new Date(selectedDateTime).toLocaleString()}
          </div>
        )}
      </div>

      {/* Checkout Action */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="w-full bg-[#0F3C5F] text-white py-4 rounded-md hover:bg-[#1C4A6E] transition disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
        >
          {scheduledDate && scheduledTime 
            ? 'Proceed to Checkout (Scheduled)' 
            : 'Proceed to Checkout'}
        </button>
        
        {!scheduledDate && !scheduledTime && (
          <p className="text-sm text-gray-700 mt-3 text-center">
            Your order will be prepared immediately upon checkout
          </p>
        )}
      </div>
    </div>
  );
}
