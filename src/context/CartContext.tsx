"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const FREE_DELIVERY_THRESHOLD = 850;
const STANDARD_DELIVERY_FEE = 35;

export interface AddOn {
  id?: string;
  name: string;
  price: number;
  quantity?: number;
}

export interface UpsellItem {
  name: string;
  price: number;
  size?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  description?: string;
  specialInstructions?: string;
  addOns?: AddOn[];
  base?: string;
  dressing?: string;
  size?: string;
  baseExtra?: number;
  fries?: { name: string; price: number; size?: string };
  juice?: { name: string; price: number; size?: string };
  friesUpsell?: UpsellItem;
  juiceUpsell?: UpsellItem;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  isFreeDelivery: boolean;
  deliveryFee: number;
  amountNeededForFreeDelivery: number;
  finalTotal: number;
  deliveryProgress: number;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateItemDetails: (id: string, updates: Partial<CartItem>) => void;
  updateAddOnQuantity: (itemId: string, addOnIndex: number, newQuantity: number) => void;
  removeAddOn: (itemId: string, addOnIndex: number) => void;
  clearAddOns: (itemId: string) => void;
  getItemTotal: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedCart = localStorage.getItem('garden-grains-cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('garden-grains-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isClient]);

  const getItemTotal = (item: CartItem): number => {
    let total = (item.price || 0) * (item.quantity || 1);
    
    // Add-ons
    const addOnsList = item.addOns || [];
    if (addOnsList.length > 0) {
      const addOnsTotal = addOnsList.reduce((sum: number, addOn: any) => 
        sum + ((addOn.price || 0) * (addOn.quantity || 1)), 0);
      total += addOnsTotal;
    }
    
    // Fries upsell
    if (item.friesUpsell) {
      total += (item.friesUpsell.price || 0) * (item.quantity || 1);
    }
    
    // Juice upsell
    if (item.juiceUpsell) {
      total += (item.juiceUpsell.price || 0) * (item.quantity || 1);
    }
    
    // Legacy support
    if (item.baseExtra) {
      total += item.baseExtra * (item.quantity || 1);
    }
    if (item.fries) {
      total += (item.fries.price || 0) * (item.quantity || 1);
    }
    if (item.juice) {
      total += (item.juice.price || 0) * (item.quantity || 1);
    }
    
    return total;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0);
  const isFreeDelivery = totalPrice >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice);
  const finalTotal = totalPrice + deliveryFee;
  const deliveryProgress = Math.min(100, (totalPrice / FREE_DELIVERY_THRESHOLD) * 100);

  const addToCart = (itemData: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = itemData.quantity || 1;
    const newItem: CartItem = { ...itemData, quantity } as CartItem;
    
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === newItem.id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + quantity
        };
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateItemDetails = (id: string, updates: Partial<CartItem>) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const updateAddOnQuantity = (itemId: string, addOnIndex: number, newQuantity: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      const addOnsList = item.addOns || [];
      if (addOnsList.length === 0) return item;
      
      const updatedAddOns = [...addOnsList];
      
      if (newQuantity <= 0) {
        updatedAddOns.splice(addOnIndex, 1);
      } else {
        updatedAddOns[addOnIndex] = {
          ...updatedAddOns[addOnIndex],
          quantity: newQuantity
        };
      }
      
      return { ...item, addOns: updatedAddOns };
    }));
  };

  const removeAddOn = (itemId: string, addOnIndex: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      const addOnsList = item.addOns || [];
      if (addOnsList.length === 0) return item;
      
      const updatedAddOns = addOnsList.filter((_, idx) => idx !== addOnIndex);
      return { ...item, addOns: updatedAddOns };
    }));
  };

  const clearAddOns = (itemId: string) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, addOns: [] } : item
    ));
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItems,
      totalPrice,
      isFreeDelivery,
      deliveryFee,
      amountNeededForFreeDelivery,
      finalTotal,
      deliveryProgress,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      updateItemDetails,
      updateAddOnQuantity,
      removeAddOn,
      clearAddOns,
      getItemTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}
