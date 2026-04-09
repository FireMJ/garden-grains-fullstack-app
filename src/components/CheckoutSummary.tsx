"use client";

import { useCart } from "@/context/CartContext";
import { CartItem } from "@/context/CartContext";

export default function CheckoutSummary() {
  const { cartItems } = useCart();
  
  // Calculate values since they are not provided by CartContext
  const totalItems = (cartItems || []).reduce((total: number, item: CartItem) => total + (item.quantity || 0), 0);
  const totalPrice = (cartItems || []).reduce((total: number, item: CartItem) => total + ((item.price || 0) * (item.quantity || 0)), 0);
  const deliveryFee = totalPrice > 0 ? 35 : 0;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Items ({totalItems})</span>
          <span>R{totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span>R{deliveryFee.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span>R{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
