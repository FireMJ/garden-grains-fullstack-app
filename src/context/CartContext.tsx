"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { AddOn, Fry, Juice } from "@/types/menu";

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  addOns?: AddOn[];
  fries?: Fry[];
  juices?: Juice[];
  specialInstructions?: string;
  dressing?: string;
  image?: string;
  id?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem, quantity?: number) => void;
  updateQuantity: (item: CartItem, newQty: number) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  scheduledDate: string | null;
  scheduledTime: string | null;
  setSchedule: (date: string, time: string) => void;
  showFloatingCartButton: boolean;
  setShowFloatingCartButton: (show: boolean) => void;
  cartItemCount: number;
}

// --- Helpers ---
export const normaliseAddOns = (addOns: AddOn[] = []) => {
  const map = new Map<string, { name: string; price: number; quantity?: number }>();
  addOns.forEach((addOn) => {
    const key = addOn.name.toLowerCase();
    if (!map.has(key)) {
      map.set(key, { ...addOn });
    } else {
      const existing = map.get(key)!;
      existing.quantity = (existing.quantity || 1) + (addOn.quantity || 1);
    }
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const normaliseFries = (fries: Fry[] = []) => {
  const map = new Map<string, { name: string; price: number; quantity?: number }>();
  fries.forEach((fry) => {
    const key = fry.name.toLowerCase();
    if (!map.has(key)) {
      map.set(key, { ...fry });
    } else {
      const existing = map.get(key)!;
      existing.quantity = (existing.quantity || 1) + (fry.quantity || 1);
    }
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const normaliseJuices = (juices: Juice[] = []) => {
  const map = new Map<string, { name: string; size: string; price: number; quantity?: number }>();
  juices.forEach((juice) => {
    const key = `${juice.name.toLowerCase()}-${juice.size.toLowerCase()}`;
    if (!map.has(key)) {
      map.set(key, { ...juice });
    } else {
      const existing = map.get(key)!;
      existing.quantity = (existing.quantity || 1) + (juice.quantity || 1);
    }
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name) || a.size.localeCompare(b.size));
};

export const areAddOnsEqual = (a: AddOn[] = [], b: AddOn[] = []) => {
  const normA = normaliseAddOns(a);
  const normB = normaliseAddOns(b);
  if (normA.length !== normB.length) return false;
  return normA.every((addOn, idx) => 
    addOn.name === normB[idx].name && 
    addOn.quantity === normB[idx].quantity
  );
};

export const areFriesEqual = (a: Fry[] = [], b: Fry[] = []) => {
  const normA = normaliseFries(a);
  const normB = normaliseFries(b);
  if (normA.length !== normB.length) return false;
  return normA.every((fry, idx) => 
    fry.name === normB[idx].name && 
    fry.quantity === normB[idx].quantity
  );
};

export const areJuicesEqual = (a: Juice[] = [], b: Juice[] = []) => {
  const normA = normaliseJuices(a);
  const normB = normaliseJuices(b);
  if (normA.length !== normB.length) return false;
  return normA.every((juice, idx) => 
    juice.name === normB[idx].name && 
    juice.size === normB[idx].size &&
    juice.quantity === normB[idx].quantity
  );
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [showFloatingCartButton, setShowFloatingCartButton] = useState(true);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (item: CartItem, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (i) =>
          i.name === item.name &&
          areAddOnsEqual(i.addOns, item.addOns) &&
          areFriesEqual(i.fries, item.fries) &&
          areJuicesEqual(i.juices, item.juices) &&
          (i.dressing || "") === (item.dressing || "") &&
          (i.specialInstructions || "") === (item.specialInstructions || "")
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
    openCart();
  };

  const updateQuantity = (item: CartItem, newQty: number) => {
    setCart((prev) =>
      prev.map((cartItem) =>
        cartItem.name === item.name &&
        areAddOnsEqual(cartItem.addOns, item.addOns) &&
        areFriesEqual(cartItem.fries, item.fries) &&
        areJuicesEqual(cartItem.juices, item.juices) &&
        (cartItem.dressing || "") === (item.dressing || "") &&
        (cartItem.specialInstructions || "") === (item.specialInstructions || "")
          ? { ...cartItem, quantity: Math.max(newQty, 1) }
          : cartItem
      )
    );
  };

  const removeFromCart = (item: CartItem) => {
    setCart((prev) =>
      prev.filter(
        (cartItem) =>
          !(
            cartItem.name === item.name &&
            areAddOnsEqual(cartItem.addOns, item.addOns) &&
            areFriesEqual(cartItem.fries, item.fries) &&
            areJuicesEqual(cartItem.juices, item.juices) &&
            (cartItem.dressing || "") === (item.dressing || "") &&
            (cartItem.specialInstructions || "") === (item.specialInstructions || "")
          )
      )
    );
  };

  const clearCart = () => setCart([]);

  const setSchedule = (date: string, time: string) => {
    setScheduledDate(date);
    setScheduledTime(time);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        scheduledDate,
        scheduledTime,
        setSchedule,
        showFloatingCartButton,
        setShowFloatingCartButton,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};