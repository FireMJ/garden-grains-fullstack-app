"use client";

import { useState, useEffect } from "react";

interface SafeAddToCartProps {
  itemId: string;
  onAddToCart: (generatedId: string) => void;
  children: React.ReactNode;
}

export const SafeAddToCart = ({ itemId, onAddToCart, children }: SafeAddToCartProps) => {
  const [generatedId, setGeneratedId] = useState("");

  useEffect(() => {
    // Generate ID on client only
    setGeneratedId(`${itemId}-${Date.now()}`);
  }, [itemId]);

  const handleClick = () => {
    if (generatedId) {
      onAddToCart(generatedId);
    }
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};
