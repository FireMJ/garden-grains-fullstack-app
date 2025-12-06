"use client";
import { CartItem } from '@/types';

import React, { createContext, useContext, useState, ReactNode } from "react";



export interface PricedAddon {
  name: string;
  price: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getDeliveryFee: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      // Check if item with same customization exists
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.base === newItem.base &&
          item.dressing === newItem.dressing &&
          JSON.stringify(item.addOns) === JSON.stringify(newItem.addOns) &&
          item.fries?.name === newItem.fries?.name &&
          item.juice?.name === newItem.juice?.name &&
          item.specialInstructions === newItem.specialInstructions
      );

      if (existingIndex !== -1) {
        // Update quantity if same item exists
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += newItem.quantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(index);
      return;
    }

    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity = quantity;
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total: number, item) => {
      const addOnsTotal = item.addOns.reduce((sum: number, addon) => sum + addon.price, 0);
      const friesTotal = item.fries ? item.fries.price : 0;
      const juiceTotal = item.juice ? item.juice.price : 0;
      const itemTotal = (item.basePrice + addOnsTotal + friesTotal + juiceTotal) * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  const getDeliveryFee = () => {
    const cartTotal = getCartTotal();
    return cartTotal >= 850 ? 0 : 49.99;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getDeliveryFee,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export type { CartItem };