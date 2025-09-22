"use client";

import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function FloatingCartButton() {
  const { cart, cartItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (!cart || cart.length === 0) return null;

  const total = cart.reduce((sum, item) => {
    const addOnsTotal = item.addOns?.reduce((a, o) => a + o.price * (o.quantity ?? 1), 0) ?? 0;
    const friesTotal = item.fries?.reduce((a, o) => a + o.price * (o.quantity ?? 1), 0) ?? 0;
    const juiceTotal = item.juices?.reduce((a, o) => a + o.price * (o.quantity ?? 1), 0) ?? 0;
    const itemTotal = (item.price + addOnsTotal + friesTotal + juiceTotal) * item.quantity;
    return sum + itemTotal;
  }, 0);

  const instructions = cart
    .filter(i => i.specialInstructions)
    .map(i => `${i.name}: ${i.specialInstructions}`)
    .join("\n");

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="fixed bottom-6 right-6 bg-[#1E4259] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 hover:bg-[#2A536B] transition z-50"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-semibold">{cartItemCount} item{cartItemCount > 1 ? "s" : ""}</span>
        <span className="font-bold">R{total.toFixed(2)}</span>
      </button>

      {hovered && instructions && (
        <div className="absolute bottom-full right-0 mb-2 w-64 max-h-48 overflow-y-auto bg-[#1E4259] text-white p-3 rounded shadow-lg text-sm whitespace-pre-line z-50">
          {instructions}
        </div>
      )}

      {isOpen && <CartDrawer onClose={() => setIsOpen(false)} />}
    </>
  );
}
