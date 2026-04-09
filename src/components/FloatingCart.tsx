"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function FloatingCart() {
  const { cartItems } = useCart();
  
  const totalItems = cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const totalPrice = cartItems?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) || 0;

  if (totalItems === 0) return null;

  return (
    <Link href="/order">
      <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition cursor-pointer z-50">
        <div className="relative">
          <span className="text-2xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
