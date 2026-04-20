"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AddOn {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  specialInstructions?: string;
  addOns?: AddOn[];
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
  itemCount: number;
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
  const [itemCount, setItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Ensure each item has a price
        const validated = parsed.map((item: any) => ({
          ...item,
          price: item.price || 0,
          quantity: item.quantity || 1
        }));
        setCartItems(validated);
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  // Calculate total price including add-ons
  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((sum, item) => {
      const itemPrice = item.price || 0;
      const itemQty = item.quantity || 1;
      let itemTotal = itemPrice * itemQty;
      
      // Add add-ons total
      if (item.addOns && item.addOns.length > 0) {
        const addOnsTotal = item.addOns.reduce((addSum, addon) => {
          const addonPrice = addon.price || 0;
          const addonQty = addon.quantity || 1;
          return addSum + (addonPrice * addonQty);
        }, 0);
        itemTotal += addOnsTotal;
      }
      
      return sum + itemTotal;
    }, 0);
  };

  // Save cart to localStorage and update totals
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      setTotalPrice(calculateTotalPrice(cartItems));
      setItemCount(cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0));
    }
  }, [cartItems, mounted]);

  const addToCart = (item: CartItem) => {
    const newItem = {
      ...item,
      price: item.price || 0,
      quantity: item.quantity || 1
    };
    
    setCartItems(prev => {
      // Check if same item with same add-ons exists
      const existingIndex = prev.findIndex(i => {
        if (i.id !== newItem.id) return false;
        
        // Compare add-ons
        const existingAddOns = JSON.stringify(i.addOns || []);
        const newAddOns = JSON.stringify(newItem.addOns || []);
        return existingAddOns === newAddOns;
      });
      
      if (existingIndex !== -1) {
        // Update existing item quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + (newItem.quantity || 1)
        };
        return updated;
      }
      
      return [...prev, newItem];
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
        
        const updatedAddOns = item.addOns?.map(addon => {
          if (addon.id !== addOnId) return addon;
          return { ...addon, quantity: Math.max(0, quantity) };
        }).filter(addon => addon.quantity > 0);
        
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
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};
