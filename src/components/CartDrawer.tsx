"use client";

import React, { useState } from "react";
import { useCart, CartItem } from "@/context/CartContext";
import Image from "next/image";
import { X, Minus, Plus, CalendarCheck, Clock, Trash2, CreditCard, Check } from "lucide-react";

export default function CartDrawer() {
  const {
    cart = [],
    removeFromCart,
    closeCart,
    isCartOpen,
    updateQuantity,
    schedule,
    setSchedule,
    clearSchedule,
    isScheduled,
    clearCart,
  } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [scheduleConfirmed, setScheduleConfirmed] = useState(false);

  if (!isCartOpen) return null;

  // Calculate total safely including add-ons, fries, and juices
  const total = cart.reduce((sum, item) => {
    const addOnsTotal =
      item.addOns?.reduce((a, o) => a + (o.price * (o.quantity ?? 1)), 0) ?? 0;
    const friesTotal =
      item.fries?.reduce((a, o) => a + (o.price * (o.quantity ?? 1)), 0) ?? 0;
    const juiceTotal =
      item.juices?.reduce((a, o) => a + (o.price * (o.quantity ?? 1)), 0) ?? 0;
    const itemTotal =
      (item.price + addOnsTotal + friesTotal + juiceTotal) * item.quantity;
    return sum + itemTotal;
  }, 0);

  // Format date for display
  const formatScheduleDate = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle remove item
  const handleRemoveItem = (itemToRemove: CartItem) => {
    removeFromCart(itemToRemove);
  };

  // Handle quantity update
  const handleQuantityUpdate = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    updateQuantity(item, newQuantity);
  };

  // Handle schedule confirmation
  const handleConfirmSchedule = () => {
    if (schedule) {
      setScheduleConfirmed(true);
      // You could also save this to your backend here
    }
  };

  // Handle clear schedule
  const handleClearSchedule = () => {
    setScheduleConfirmed(false);
    clearSchedule();
  };

  // Handle checkout process
  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // In a real app, this would redirect to a checkout page
    // or process payment directly
    setTimeout(() => {
      alert(`Order ${isScheduled ? `scheduled for ${formatScheduleDate(schedule)}` : 'placed successfully'}! Total: R${total.toFixed(2)}`);
      clearCart();
      setIsCheckingOut(false);
      closeCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full sm:w-96 bg-white h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-[#1E4259]">Your Cart</h2>
          <button onClick={closeCart} className="text-gray-500 hover:text-red-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scheduled Order Notice */}
        {isScheduled && schedule && scheduleConfirmed && (
          <div className="bg-green-50 p-3 border-b border-green-100 flex items-center justify-between">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-green-700">
                Order scheduled for {formatScheduleDate(schedule)}
              </span>
            </div>
            <button 
              onClick={handleClearSchedule}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Change
            </button>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 p-4 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center mt-10">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-600">Your cart is empty</p>
              <button 
                onClick={closeCart}
                className="mt-4 text-[#1E4259] hover:text-[#2A536B] font-medium"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item: CartItem, idx: number) => {
                // Create a unique identifier for this cart item
                const itemIdentifier = `${item.id}-${JSON.stringify(item.addOns)}-${JSON.stringify(item.fries)}-${JSON.stringify(item.juices)}-${item.specialInstructions}`;
                
                return (
                  <div key={itemIdentifier} className="flex pb-4 border-b border-gray-100">
                    {item.image && (
                      <div className="w-20 h-20 relative mr-4 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-[#1E4259]">
                          {item.name}
                          <span className="ml-2 text-sm text-gray-500">×{item.quantity}</span>
                        </h3>
                        <span className="font-semibold text-[#1E4259]">
                          R
                          {(
                            (item.price +
                              (item.addOns?.reduce(
                                (a, o) => a + (o.price * (o.quantity ?? 1)),
                                0
                              ) ?? 0) +
                              (item.fries?.reduce(
                                (a, o) => a + (o.price * (o.quantity ?? 1)),
                                0
                              ) ?? 0) +
                              (item.juices?.reduce(
                                (a, o) => a + (o.price * (o.quantity ?? 1)),
                                0
                              ) ?? 0)) *
                            item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>

                      {/* Add-ons */}
                      {item.addOns?.length > 0 && (
                        <div className="mt-1 text-xs text-gray-600">
                          <span className="font-medium">Add-ons:</span>
                          {item.addOns.map((addOn, i) => (
                            <div key={i} className="ml-2">
                              • {addOn.name}{addOn.quantity > 1 ? ` (×${addOn.quantity})` : ''} +R{(addOn.price * (addOn.quantity || 1)).toFixed(2)}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Fries */}
                      {item.fries?.length > 0 && (
                        <div className="mt-1 text-xs text-gray-600">
                          <span className="font-medium">Fries:</span>
                          {item.fries.map((fry, i) => (
                            <div key={i} className="ml-2">
                              • {fry.name}{fry.quantity > 1 ? ` (×${fry.quantity})` : ''} +R{(fry.price * (fry.quantity || 1)).toFixed(2)}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Juices */}
                      {item.juices?.length > 0 && (
                        <div className="mt-1 text-xs text-gray-600">
                          <span className="font-medium">Juices:</span>
                          {item.juices.map((juice, i) => (
                            <div key={i} className="ml-2">
                              • {juice.name} ({juice.size}){juice.quantity > 1 ? ` (×${juice.quantity})` : ''} +R{(juice.price * (juice.quantity || 1)).toFixed(2)}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Special Instructions */}
                      {item.specialInstructions && (
                        <div className="mt-1 text-xs text-gray-600">
                          <span className="font-medium">Note:</span> {item.specialInstructions}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityUpdate(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 border rounded-full disabled:opacity-40 hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3 text-[#1E4259]" />
                          </button>
                          <span className="text-sm font-medium text-[#1E4259]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityUpdate(item, item.quantity + 1)}
                            className="p-1 border rounded-full hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3 text-[#1E4259]" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 space-y-4">
            {/* Schedule Order */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-[#1E4259] mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Schedule Order (Optional)
              </label>
              
              {!scheduleConfirmed ? (
                <>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="datetime-local"
                      value={schedule || ""}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="flex-1 border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-[#1E4259] focus:outline-none"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    {schedule && (
                      <button
                        onClick={() => setSchedule("")}
                        className="p-2 text-gray-500 hover:text-red-500 border border-gray-300 rounded"
                        title="Clear schedule"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {schedule && (
                    <button
                      onClick={handleConfirmSchedule}
                      className="w-full flex items-center justify-center gap-2 bg-[#2A536B] text-white py-2 rounded text-sm hover:bg-[#1E4259] transition"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      Confirm Schedule for {formatScheduleDate(schedule)}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">
                    Scheduled for {formatScheduleDate(schedule)}
                  </span>
                  <button
                    onClick={handleClearSchedule}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-[#1E4259] py-2">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">R{total.toFixed(2)}</span>
            </div>

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || isCheckingOut}
              className="w-full bg-[#1E4259] text-white py-3 rounded-lg hover:bg-[#2A536B] transition font-medium flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : scheduleConfirmed ? (
                <>
                  <CalendarCheck className="w-5 h-5 mr-2" />
                  Schedule Order
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}