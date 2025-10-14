"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function FloatingCartButton() {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-[#F4A261] text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:bg-[#e68e42] transition flex items-center gap-2 z-40"
    >
      <span>🛒</span>
      <span>Go to Cart</span>
      {itemCount > 0 && (
        <span className="bg-[#1E4259] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
