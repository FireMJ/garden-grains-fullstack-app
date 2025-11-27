"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface JuiceOption {
  id: string;
  name: string;
  price: number;
}

export interface JuiceGroup {
  size: string;
  options: JuiceOption[];
}

export interface FriesUpsell {
  id: string;
  name: string;
  price: number;
  optional?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  total: number; // This should be the final total including all extras
  image: string;
  category: string;
  addOns?: AddOn[];
  juice?: { size: string; option: JuiceOption } | null;
  fries?: FriesUpsell;
  base?: string;
  dressing?: string;
  specialInstructions?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Helper function to calculate item total including all extras
const calculateItemTotal = (item: CartItem): number => {
  const baseTotal = item.price * item.quantity;
  
  // Calculate add-ons total
  const addOnsTotal = (item.addOns || []).reduce((sum, addOn) => sum + addOn.price, 0) * item.quantity;
  
  // Calculate juice upsell total
  const juiceTotal = (item.juice ? item.juice.option.price : 0) * item.quantity;
  
  // Calculate fries upsell total
  const friesTotal = (item.fries ? item.fries.price : 0) * item.quantity;
  
  return baseTotal + addOnsTotal + juiceTotal + friesTotal;
};

// Helper function to calculate cart total
const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { 
                ...item, 
                quantity: item.quantity + action.payload.quantity,
                total: calculateItemTotal({ ...item, quantity: item.quantity + action.payload.quantity })
              }
            : item
        );

        const total = calculateCartTotal(updatedItems);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          ...state,
          items: updatedItems,
          total,
          itemCount
        };
      } else {
        const newItem = {
          ...action.payload,
          total: calculateItemTotal(action.payload)
        };
        const updatedItems = [...state.items, newItem];
        const total = calculateCartTotal(updatedItems);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          ...state,
          items: updatedItems,
          total,
          itemCount
        };
      }
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const total = calculateCartTotal(updatedItems);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: updatedItems,
        total,
        itemCount
      };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { 
              ...item, 
              quantity: Math.max(0, action.payload.quantity),
              total: calculateItemTotal({ ...item, quantity: Math.max(0, action.payload.quantity) })
            }
          : item
      ).filter(item => item.quantity > 0);

      const total = calculateCartTotal(updatedItems);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: updatedItems,
        total,
        itemCount
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
