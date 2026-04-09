"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function FloatingCartButton() {
  const { cartItems, totalItems, totalPrice } = useCart();
  
  const itemCount = totalItems || cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  const price = totalPrice || cartItems?.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0) || 0;

  if (itemCount === 0) return null;

  return (
    <Link href="/order">
      <div className="fixed bottom-20 right-4 bg-[#2F5D50] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#244a3f] transition cursor-pointer z-50 flex items-center gap-2">
        <span className="text-lg">🛒</span>
        <span className="font-semibold">{itemCount} items</span>
        <span className="font-bold">R{price.toFixed(2)}</span>
      </div>
    </Link>
  );
}
