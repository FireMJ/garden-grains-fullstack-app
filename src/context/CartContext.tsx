"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AddOn {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface FriesItem {
  name: string;
  price: number;
  dip?: string;
  dipPrice?: number;
}

export interface JuiceItem {
  name: string;
  price: number;
  size: string;
  addOns?: JuiceAddOn[];
}

export interface JuiceAddOn {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  description?: string;
  specialInstructions?: string;
  addOns?: AddOn[];
  fries?: FriesItem | null;
  juice?: JuiceItem | null;
  base?: string;
  dressing?: string;
  protein?: string;
  basting?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateAddOnQuantity: (itemId: string, addOnId: string, quantity: number) => void;
  removeAddOn: (itemId: string, addOnId: string) => void;
  updateItemDetails: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed);
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((sum, item) => {
      const itemQty = item.quantity || 1;
      let itemTotal = (item.price || 0) * itemQty;

      if (item.addOns && item.addOns.length > 0) {
        itemTotal += item.addOns.reduce((addSum, addon) => {
          return addSum + ((addon.price || 0) * (addon.quantity || 1));
        }, 0);
      }

      if (item.fries) {
        let friesTotal = (item.fries.price || 0) * itemQty;
        if (item.fries.dipPrice) {
          friesTotal += (item.fries.dipPrice || 0) * itemQty;
        }
        itemTotal += friesTotal;
      }

      if (item.juice) {
        let juiceTotal = (item.juice.price || 0) * itemQty;
        if (item.juice.addOns && item.juice.addOns.length > 0) {
          juiceTotal += item.juice.addOns.reduce((sum, addon) => sum + (addon.price || 0), 0) * itemQty;
        }
        itemTotal += juiceTotal;
      }

      return sum + itemTotal;
    }, 0);
  };

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setTotalPrice(calculateTotalPrice(cartItems));
      setTotalItems(cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0));
    }
  }, [cartItems, mounted]);

  const addToCart = (item: CartItem) => {
    console.log("Adding to cart:", JSON.stringify(item, null, 2));
    
    setCartItems(prev => {
      const existingIndex = prev.findIndex(i => {
        if (i.id !== item.id) return false;
        
        const existingAddOns = JSON.stringify(i.addOns || []);
        const newAddOns = JSON.stringify(item.addOns || []);
        if (existingAddOns !== newAddOns) return false;
        
        const existingFries = JSON.stringify(i.fries || null);
        const newFries = JSON.stringify(item.fries || null);
        if (existingFries !== newFries) return false;
        
        const existingJuice = JSON.stringify(i.juice || null);
        const newJuice = JSON.stringify(item.juice || null);
        if (existingJuice !== newJuice) return false;
        
        return true;
      });

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + (item.quantity || 1)
        };
        return updated;
      }

      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const updateAddOnQuantity = (itemId: string, addOnId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id !== itemId) return item;
        const updatedAddOns = item.addOns?.map(addon =>
          addon.id === addOnId ? { ...addon, quantity } : addon
        );
        return { ...item, addOns: updatedAddOns };
      })
    );
  };

  const removeAddOn = (itemId: string, addOnId: string) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          addOns: item.addOns?.filter(addon => addon.id !== addOnId)
        };
      })
    );
  };

  const updateItemDetails = (itemId: string, updates: Partial<CartItem>) => {
    setCartItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, ...updates } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateAddOnQuantity,
      removeAddOn,
      updateItemDetails,
      clearCart,
      totalPrice,
      totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};
