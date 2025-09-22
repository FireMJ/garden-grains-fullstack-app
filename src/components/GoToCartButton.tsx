"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import CartDrawer from "@/components/CartDrawer";

interface GoToCartButtonProps {
  visible: boolean;
  duration?: number;
}

const GoToCartButton: React.FC<GoToCartButtonProps> = ({ visible, duration = 4000 }) => {
  const { cart } = useCart();
  const [show, setShow] = useState(visible);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity +
      (item.addOns?.reduce((a, o) => a + o.price, 0) ?? 0),
    0
  );

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  if (!show || cart.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setDrawerOpen(true)}
        className="w-full bg-[#F4A261] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#e68e42] transition flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        Go to Cart • {itemCount} item{itemCount > 1 ? "s" : ""} • R{total.toFixed(2)}
      </button>

      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default GoToCartButton;
