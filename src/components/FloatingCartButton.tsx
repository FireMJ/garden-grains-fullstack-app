"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import CartDrawer from "./CartDrawer";

export default function FloatingCartButton() {
  const { cart, cartItemCount } = useCart();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  const role = session?.user?.role;

  // Only show for guests or regular users (hide for admin/staff)
  if (role && role !== "USER") return null;

  // Don't show if cart is empty
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
        className="fixed bottom-6 right-6 bg-[#1E4259] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-3 hover:bg-[#2A536B] transition z-50 group"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-semibold">{cartItemCount} item{cartItemCount > 1 ? "s" : ""}</span>
        <span className="font-bold">R{total.toFixed(2)}</span>
        
        {/* Badge showing item count */}
        {cartItemCount > 0 && (
          <span className="bg-[#F4A261] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center absolute -top-2 -right-2">
            {cartItemCount}
          </span>
        )}
      </button>

      {/* Special Instructions Tooltip */}
      {hovered && instructions && (
        <div className="fixed bottom-20 right-6 w-64 max-h-48 overflow-y-auto bg-[#1E4259] text-white p-3 rounded shadow-lg text-sm whitespace-pre-line z-50 border border-[#F4A261]">
          <div className="font-semibold text-[#F4A261] mb-1">Special Instructions:</div>
          {instructions}
        </div>
      )}

      {/* Cart Drawer */}
      {isOpen && <CartDrawer onClose={() => setIsOpen(false)} />}
    </>
  );
}