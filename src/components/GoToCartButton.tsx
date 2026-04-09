"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface GoToCartButtonProps {
  className?: string;
}

export default function GoToCartButton({ className = "" }: GoToCartButtonProps) {
  const { cartItems } = useCart();
  
  const totalItems = cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  if (totalItems === 0) return null;

  return (
    <Link href="/order">
      <button className={`bg-[#2F5D50] text-white px-4 py-2 rounded-lg hover:bg-[#244a3f] transition flex items-center gap-2 ${className}`}>
        <span>🛒</span>
        <span>Go to Cart ({totalItems})</span>
      </button>
    </Link>
  );
}
