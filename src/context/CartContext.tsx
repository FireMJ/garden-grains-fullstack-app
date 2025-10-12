"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { AddOn, Fry, Juice } from "@/types/menu";

export interface CartItem {
  id?: string;
  name: string;
  price: number; // base price
  quantity?: number; // default 1
  addOns?: AddOn[];
  fries?: Fry[];
  juices?: Juice[];
  specialInstructions?: string;
  dressing?: string;
  base?: string;
  image?: string;
  totalPrice?: number; // recalculated price including addOns, fries, juices * quantity
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

// ---- helpers ----
export const normaliseAddOns = (addOns: AddOn[] = []) => {
  const map = new Map<string, AddOn>();
  addOns.forEach((a) => {
    const key = a.name.toLowerCase();
    if (!map.has(key)) map.set(key, { ...a, quantity: a.quantity || 1 });
    else map.get(key)!.quantity! += a.quantity || 1;
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const normaliseFries = (fries: Fry[] = []) => {
  const map = new Map<string, Fry>();
  fries.forEach((f) => {
    const key = f.name.toLowerCase();
    if (!map.has(key)) map.set(key, { ...f, quantity: f.quantity || 1 });
    else map.get(key)!.quantity! += f.quantity || 1;
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const normaliseJuices = (juices: Juice[] = []) => {
  const map = new Map<string, Juice>();
  juices.forEach((j) => {
    const key = `${j.name.toLowerCase()}-${j.size.toLowerCase()}`;
    if (!map.has(key)) map.set(key, { ...j, quantity: j.quantity || 1 });
    else map.get(key)!.quantity! += j.quantity || 1;
  });
  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name) || a.size.localeCompare(b.size)
  );
};

export const areAddOnsEqual = (a: AddOn[] = [], b: AddOn[] = []) => {
  const normA = normaliseAddOns(a);
  const normB = normaliseAddOns(b);
  if (normA.length !== normB.length) return false;
  return normA.every(
    (v, i) => v.name === normB[i].name && v.quantity === normB[i].quantity
  );
};

export const areFriesEqual = (a: Fry[] = [], b: Fry[] = []) => {
  const normA = normaliseFries(a);
  const normB = normaliseFries(b);
  if (normA.length !== normB.length) return false;
  return normA.every(
    (v, i) => v.name === normB[i].name && v.quantity === normB[i].quantity
  );
};

export const areJuicesEqual = (a: Juice[] = [], b: Juice[] = []) => {
  const normA = normaliseJuices(a);
  const normB = normaliseJuices(b);
  if (normA.length !== normB.length) return false;
  return normA.every(
    (v, i) =>
      v.name === normB[i].name &&
      v.size === normB[i].size &&
      v.quantity === normB[i].quantity
  );
};

// ---- price calculator ----
const calculateTotalPrice = (item: CartItem, qty: number = 1) => {
  const addOnsTotal =
    item.addOns?.reduce(
      (sum, a) => sum + a.price * (a.quantity || 1),
      0
    ) || 0;
  const friesTotal =
    item.fries?.reduce(
      (sum, f) => sum + f.price * (f.quantity || 1),
      0
    ) || 0;
  const juicesTotal =
    item.juices?.reduce(
      (sum, j) => sum + j.price * (j.quantity || 1),
      0
    ) || 0;
  return (item.price + addOnsTotal + friesTotal + juicesTotal) * qty;
};

// ---- context ----
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
          (i.base || "") === (item.base || "") &&
          (i.specialInstructions || "") === (item.specialInstructions || "")
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        const newQty = (updatedCart[existingIndex].quantity || 1) + quantity;
        updatedCart[existingIndex].quantity = newQty;
        updatedCart[existingIndex].totalPrice = calculateTotalPrice(
          updatedCart[existingIndex],
          newQty
        );
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            ...item,
            quantity,
            totalPrice: calculateTotalPrice(item, quantity),
          },
        ];
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
        (cartItem.base || "") === (item.base || "") &&
        (cartItem.specialInstructions || "") === (item.specialInstructions || "")
          ? {
              ...cartItem,
              quantity: Math.max(newQty, 1),
              totalPrice: calculateTotalPrice(cartItem, Math.max(newQty, 1)),
            }
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
            (cartItem.base || "") === (item.base || "") &&
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

  const cartItemCount = cart.reduce(
    (total, item) => total + (item.quantity || 1 || 0),
    0
  );

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
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
