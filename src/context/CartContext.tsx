"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Constants for delivery
const FREE_DELIVERY_THRESHOLD = 850;
const STANDARD_DELIVERY_FEE = 35;

// Base interface that both structures share
interface BaseCartItem {
  id: string;
  name: string;
  price: number; // Base price
  quantity: number;
  image: string;
  category: string;
  description?: string;
  specialInstructions?: string;
}

// Interface for add-ons with prices
interface PricedAddon {
  name: string;
  price: number;
  id?: string;
}

// New structure (preferred)
interface NewCartItem extends BaseCartItem {
  addons?: PricedAddon[];
  dressings?: string[];
  bases?: string[];
  juiceUpsell?: {
    name: string;
    price: number;
    size?: string;
  };
  friesUpsell?: {
    name: string;
    price: number;
    size?: string;
  };
}

// Old structure (from bowls page) - addOns can be objects with prices
interface OldCartItem extends BaseCartItem {
  addOns?: any[]; // Can be array of objects with name and price
  base?: string;
  dressing?: string;
  fries?: any;
  juice?: any;
  total?: number;
}

// Union type that accepts both structures
export type CartItem = NewCartItem | OldCartItem;

// Helper to normalize old items to new structure with prices
const normalizeCartItem = (item: CartItem): NewCartItem => {
  // If it's already a new structure item, return as is
  if ('addons' in item || 'dressings' in item || 'bases' in item) {
    return item as NewCartItem;
  }
  
  // Convert old structure to new structure with prices
  const oldItem = item as OldCartItem;
  const newItem: NewCartItem = {
    id: oldItem.id,
    name: oldItem.name,
    price: oldItem.price,
    quantity: oldItem.quantity,
    image: oldItem.image,
    category: oldItem.category,
    description: oldItem.description,
    specialInstructions: oldItem.specialInstructions,
  };
  
  // Convert addOns to addons with prices
  if (oldItem.addOns && Array.isArray(oldItem.addOns)) {
    newItem.addons = oldItem.addOns.map((addon: any) => {
      if (typeof addon === 'object' && addon.name && addon.price !== undefined) {
        return {
          name: addon.name,
          price: addon.price || 0,
          id: addon.id
        };
      } else if (typeof addon === 'string') {
        return {
          name: addon,
          price: 0 // Default price for string addons
        };
      }
      return {
        name: 'Add-on',
        price: 0
      };
    }).filter((addon: any): addon is PricedAddon => addon !== null);
  }
  
  // Convert base to bases array
  if (oldItem.base) {
    newItem.bases = [oldItem.base];
  }
  
  // Convert dressing to dressings array
  if (oldItem.dressing) {
    newItem.dressings = [oldItem.dressing];
  }
  
  // Convert juice to juiceUpsell with price
  if (oldItem.juice) {
    if (typeof oldItem.juice === 'object' && oldItem.juice.name && oldItem.juice.price !== undefined) {
      newItem.juiceUpsell = {
        name: oldItem.juice.name,
        price: oldItem.juice.price || 0,
        size: oldItem.juice.size || ''
      };
    } else if (typeof oldItem.juice === 'string') {
      newItem.juiceUpsell = {
        name: oldItem.juice,
        price: 0,
        size: ''
      };
    }
  }
  
  // Convert fries to friesUpsell with price
  if (oldItem.fries) {
    if (typeof oldItem.fries === 'object' && oldItem.fries.name && oldItem.fries.price !== undefined) {
      newItem.friesUpsell = {
        name: oldItem.fries.name,
        price: oldItem.fries.price || 0,
        size: oldItem.fries.size || ''
      };
    } else if (typeof oldItem.fries === 'string') {
      newItem.friesUpsell = {
        name: oldItem.fries,
        price: 0,
        size: ''
      };
    }
  }
  
  return newItem;
};

// Calculate total price for a single item including all customizations
const calculateItemTotal = (item: CartItem): number => {
  const normalized = normalizeCartItem(item);
  let total = normalized.price * normalized.quantity;
  
  // Add add-ons prices
  if (normalized.addons) {
    const addonsTotal = normalized.addons.reduce((sum: number, addon) => sum + (addon.price || 0), 0);
    total += addonsTotal * normalized.quantity;
  }
  
  // Add juice upsell price
  if (normalized.juiceUpsell) {
    total += normalized.juiceUpsell.price * normalized.quantity;
  }
  
  // Add fries upsell price
  if (normalized.friesUpsell) {
    total += normalized.friesUpsell.price * normalized.quantity;
  }
  
  return total;
};

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  // Delivery calculations
  isFreeDelivery: boolean;
  deliveryFee: number;
  amountNeededForFreeDelivery: number;
  finalTotal: number;
  deliveryProgress: number;
  // Methods
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateItemDetails: (id: string, updates: Partial<CartItem>) => void;
  getItemTotal: (item: CartItem) => number;
  getNormalizedItems: () => NewCartItem[];
  getItemPriceBreakdown: (item: CartItem) => {
    basePrice: number;
    addonsTotal: number;
    juiceUpsellPrice: number;
    friesUpsellPrice: number;
    itemTotal: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('📦 CartProvider: Loading from localStorage');
    try {
      const savedCart = localStorage.getItem('garden-grains-cart');
      console.log('📦 Raw localStorage:', savedCart);
      
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        console.log('📦 Parsed cart:', parsed);
        console.log('📦 Number of items:', parsed.length);
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
          console.log('📦 Cart loaded successfully:', parsed);
        } else {
          console.log('📦 Cart is empty array');
          setCartItems([]);
        }
      } else {
        console.log('📦 No cart in localStorage');
        setCartItems([]);
      }
    } catch (error) {
      console.error('📦 Error loading cart:', error);
      setCartItems([]);
    } finally {
      setIsInitialized(true);
    }
  }, []); // Empty dependency array = run once on mount

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isClient && isInitialized) {
      console.log('💾 Saving cart to localStorage:', cartItems);
      localStorage.setItem('garden-grains-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isClient, isInitialized]);

  // Helper to get normalized items for display
  const getNormalizedItems = (): NewCartItem[] => {
    return cartItems.map(normalizeCartItem);
  };

  const totalItems = cartItems.reduce((sum: number, item) => sum + item.quantity, 0);
  
  const getItemTotal = (item: CartItem): number => {
    return calculateItemTotal(item);
  };
  
  const totalPrice = cartItems.reduce((sum: number, item) => sum + getItemTotal(item), 0);

  // Calculate delivery-related values
  const isFreeDelivery = totalPrice >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice);
  const finalTotal = totalPrice + deliveryFee;
  const deliveryProgress = Math.min(100, (totalPrice / FREE_DELIVERY_THRESHOLD) * 100);

  // Get detailed price breakdown for an item
  const getItemPriceBreakdown = (item: CartItem) => {
    const normalized = normalizeCartItem(item);
    const basePrice = normalized.price * normalized.quantity;
    
    // Calculate add-ons total
    let addonsTotal = 0;
    if (normalized.addons) {
      const addonsPricePerItem = normalized.addons.reduce((sum: number, addon) => sum + (addon.price || 0), 0);
      addonsTotal = addonsPricePerItem * normalized.quantity;
    }
    
    // Calculate upsell prices
    const juiceUpsellPrice = normalized.juiceUpsell ? normalized.juiceUpsell.price * normalized.quantity : 0;
    const friesUpsellPrice = normalized.friesUpsell ? normalized.friesUpsell.price * normalized.quantity : 0;
    
    const itemTotal = basePrice + addonsTotal + juiceUpsellPrice + friesUpsellPrice;
    
    return {
      basePrice,
      addonsTotal,
      juiceUpsellPrice,
      friesUpsellPrice,
      itemTotal
    };
  };

  const addToCart = (itemData: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    console.log('➕ Adding to cart:', itemData);
    const quantity = itemData.quantity || 1;
    
    // Create the cart item with quantity
    const cartItem: CartItem = {
      ...itemData,
      quantity,
    } as CartItem;
    
    // Normalize for comparison
    const normalizedNewItem = normalizeCartItem(cartItem);
    
    setCartItems(prevItems => {
      // Check if similar item already exists
      const existingIndex = prevItems.findIndex(existingItem => {
        const normalizedExisting = normalizeCartItem(existingItem);
        
        // Basic comparison
        return normalizedExisting.id === normalizedNewItem.id &&
               JSON.stringify(normalizedExisting.addons) === JSON.stringify(normalizedNewItem.addons) &&
               JSON.stringify(normalizedExisting.dressings) === JSON.stringify(normalizedNewItem.dressings) &&
               JSON.stringify(normalizedExisting.bases) === JSON.stringify(normalizedNewItem.bases) &&
               normalizedExisting.specialInstructions === normalizedNewItem.specialInstructions;
      });
      
      if (existingIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingIndex];
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        };
        console.log('✅ Updated existing item:', updatedItems[existingIndex]);
        return updatedItems;
      } else {
        // Add new item
        console.log('✅ Added new item');
        return [...prevItems, cartItem];
      }
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    console.log('🗑️ Removing item:', id);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    console.log('🧹 Clearing cart');
    setCartItems([]);
  };

  const updateItemDetails = (id: string, updates: Partial<CartItem>) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  // Log state changes for debugging
  useEffect(() => {
    if (isInitialized) {
      console.log('🔄 Cart state updated:', {
        cartItems,
        totalItems,
        totalPrice,
        isFreeDelivery,
        finalTotal
      });
    }
  }, [cartItems, totalItems, totalPrice, isFreeDelivery, finalTotal, isInitialized]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        // Delivery values
        isFreeDelivery,
        deliveryFee,
        amountNeededForFreeDelivery,
        finalTotal,
        deliveryProgress,
        // Methods
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        updateItemDetails,
        getItemTotal,
        getNormalizedItems,
        getItemPriceBreakdown,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
