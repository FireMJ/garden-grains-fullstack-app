"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { MenuItem, AddOn } from '@/types/menu';

export interface CartItem extends MenuItem {
  quantity: number;
  addOns?: AddOn[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, addOns?: AddOn[]) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem, quantity: number = 1, addOns: AddOn[] = []) => {
    setCart(prev =>
      prev.some(i => i.id === item.id)
        ? prev.map(i =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  addOns: [...(i.addOns || []), ...addOns],
                }
              : i
          )
        : [...prev, { ...item, quantity, addOns }]
    );
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
