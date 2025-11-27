"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

export default function FloatingCart() {
  const { state } = useCart();

  if (state.items.length === 0) {
    return null;
  }

  // Calculate total including add-ons, fries, and juice
  const cartTotal = state.items.reduce(
    (total, item) =>
      total +
      item.price * item.quantity +
      (item.addOns?.reduce((a, o) => a + o.price, 0) ?? 0) * item.quantity +
      (item.fries ? item.fries.price : 0) * item.quantity +
      (item.juice ? item.juice.option.price : 0) * item.quantity,
    0
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-[#F4A261] text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
            />
          </svg>
          <span className="font-bold">{state.itemCount}</span>
        </div>
        <div className="border-l border-white/30 h-6"></div>
        <span className="font-bold">R{cartTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
