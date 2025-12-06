"use client";

import Link from 'next/link';
import { useCart } from "@/contexts/CartContext"';

export default function FloatingCartButton() {
  const { cart: cartItems, totalItems, totalPrice } = useCart();
  const itemCount = cartItems.reduce((sum: number, item) => sum + item.quantity, 0);

  // Don't show if cart is empty
  if (itemCount === 0) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50 flex items-center justify-center"
      aria-label={`Cart with ${itemCount} items`}
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
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5L12 14m0 0l2.5 4.5M12 14v6m0-6h2.5" 
        />
      </svg>
      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {itemCount}
      </span>
    </Link>
  );
}
