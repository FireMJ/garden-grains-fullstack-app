"use client";

import { useCart, type CartItem } from "@/contexts/CartContext";

export default function CheckoutSummary() {
  const { cart: cartItems } = useCart();
  // Calculate values since they are not provided by CartContext
  const totalItems = (cartItems || []).reduce((total: number, item: CartItem) => total + (item.quantity || 1), 0);
  const totalPrice = (cartItems || []).reduce((total: number, item: CartItem) => total + (item.price || 0) * (item.quantity || 1), 0);
  const cart = cartItems;
  const cartTotal = totalPrice;
  const discountedTotal = totalPrice; // Assuming no discount logic yet
  const appliedVoucher = null; // Assuming no voucher logic yet
  
  const total = discountedTotal || cartTotal;
  const promoApplied = !!appliedVoucher;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>R {cartTotal.toFixed(2)}</span>
        </div>
        
        {promoApplied && (
          <div className="flex justify-between text-green-600">
            <span>Discount Applied</span>
            <span>-R {(cartTotal - discountedTotal).toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-semibold text-lg border-t pt-2">
          <span>Total</span>
          <span>R {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
