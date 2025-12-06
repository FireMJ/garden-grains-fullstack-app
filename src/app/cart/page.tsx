"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { 
  FiShoppingCart, 
  FiArrowLeft, 
  FiPackage, 
  FiLock, 
  FiAlertCircle,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiTruck,
  FiShield,
  FiStar,
  FiCheck,
  FiCoffee,
  FiDroplet,
  FiShoppingBag,
  FiEdit2,
  FiDollarSign
} from "react-icons/fi";

interface DeliveryInfo {
  distance: number;
  deliveryFee: number;
  freeDelivery: boolean;
}

// Helper to format prices
const formatPrice = (price: number) => {
  return `R${price.toFixed(2)}`;
};

export default function CartPage() {
  const router = useRouter();
  const {
    cart, // FIXED: Changed from cartItems to cart
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getDeliveryFee
  } = useCart();
  
  const { user, loading: authLoading } = useAuth();
  const [pastOrders, setPastOrders] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    distance: 5,
    deliveryFee: 30,
    freeDelivery: false
  });
  const [isClient, setIsClient] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate derived values
  const totalItems = Array.isArray(cart) ? cart.reduce((total, item) => total + (item.quantity || 1), 0) : 0;
  const totalPrice = getCartTotal();

  // Helper function
  const getItemTotal = (item: CartItem): number => {
    const basePrice = item.price || 0;
    
    // Handle add-ons
    const addOns = item.addOns || item.addons || [];
    const addOnsTotal = addOns.reduce((sum: number, addon: any) => sum + (addon.price || 0), 0);
    
    // Handle fries upsell
    const friesItem = item.fries || item.friesUpsell;
    const friesTotal = friesItem?.price || 0;
    
    // Handle juice upsell
    const juiceItem = item.juice || item.juiceUpsell;
    const juiceTotal = juiceItem?.price || 0;
    
    return (basePrice + addOnsTotal + friesTotal + juiceTotal) * (item.quantity || 1);
  };

  // Get normalized items
  const getNormalizedItems = (): CartItem[] => {
    if (!Array.isArray(cart)) return [];
    return cart.map(item => ({
      ...item,
      addons: item.addOns || item.addons || [],
      bases: item.bases || [],
      dressings: item.dressings || [],
      friesUpsell: item.fries || item.friesUpsell,
      juiceUpsell: item.juice || item.juiceUpsell
    }));
  };

  const normalizedItems = getNormalizedItems();

  // Calculate delivery fee
  useEffect(() => {
    const freeDeliveryThreshold = 850;
    if (totalPrice >= freeDeliveryThreshold) {
      setDeliveryInfo(prev => ({
        ...prev,
        deliveryFee: 0,
        freeDelivery: true
      }));
    } else {
      setDeliveryInfo(prev => ({
        ...prev,
        deliveryFee: 30,
        freeDelivery: false
      }));
    }
  }, [totalPrice]);

  // Mock past orders
  useEffect(() => {
    if (user) {
      setPastOrders(3);
    }
  }, [user]);

  const handleCheckout = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    router.push("/checkout");
  };

  const handleQuantityChange = (id: string, change: number) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity >= 1) {
        updateQuantity(id, newQuantity);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  if (!isClient || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading your cart...</div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <FiShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Add some delicious, healthy items from our menu to get started!
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
            >
              <FiArrowLeft className="mr-3" />
              Browse Our Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Authentication Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <FiAlertCircle className="w-8 h-8 text-yellow-500 mr-3" />
              <h3 className="text-xl font-bold">Sign In Required</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              To complete your purchase and enjoy a seamless shopping experience, please create an account or sign in.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push("/auth/signup?returnUrl=/checkout")}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Create Account & Checkout
              </button>
              
              <button
                onClick={() => router.push("/auth/signin?returnUrl=/checkout")}
                className="w-full py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                Sign In to Checkout
              </button>
              
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="w-full py-3 text-gray-600 hover:text-gray-800"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center text-gray-900">
                <FiShoppingCart className="mr-3" />
                Your Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2">
                Review your items and proceed to checkout
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && pastOrders > 0 && (
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                  <FiPackage className="mr-2" />
                  <span className="font-medium">{pastOrders} past order{pastOrders !== 1 ? "s" : ""}</span>
                </div>
              )}
              
              {!user && (
                <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                  <FiLock className="mr-2" />
                  <span className="font-medium">Guest checkout</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-600 mt-1">
                  {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart • Verify your order below
                </p>
              </div>
              
              <div className="divide-y">
                {cart.map((cartItem, index) => {
                  const normalizedItem = normalizedItems[index];
                  const itemTotal = getItemTotal(cartItem);
                  
                  return (
                    <div key={cartItem.id} className="p-6">
                      <div className="flex flex-col md:flex-row">
                        {/* Product Image */}
                        <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mb-4 md:mb-0">
                          {cartItem.image ? (
                            <Image
                              src={cartItem.image}
                              alt={cartItem.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FiShoppingBag className="w-12 h-12" />
                            </div>
                          )}
                        </div>
                        
                        {/* Product Details */}
                        <div className="md:ml-6 flex-grow">
                          <div className="flex flex-col md:flex-row md:items-start justify-between">
                            <div className="mb-4 md:mb-0 flex-grow">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold text-lg text-gray-900">{cartItem.name}</h3>
                                  <p className="text-gray-600 mt-1">
                                    <span className="font-semibold">{formatPrice(cartItem.price)}</span> base price each
                                  </p>
                                </div>
                                <button
                                  onClick={() => setEditingItem(editingItem === cartItem.id ? null : cartItem.id)}
                                  className="md:hidden text-blue-600 hover:text-blue-800"
                                >
                                  <FiEdit2 className="w-5 h-5" />
                                </button>
                              </div>
                              
                              {/* Display customizations */}
                              {normalizedItem.addons && normalizedItem.addons.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Add-ons:</p>
                                  <div className="space-y-1">
                                    {normalizedItem.addons.map((addon: any, idx: number) => (
                                      <div key={idx} className="flex items-center justify-between">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded flex items-center">
                                          <FiPlus className="w-3 h-3 mr-1" />
                                          {addon.name}
                                        </span>
                                        <span className="text-xs font-medium text-blue-700">
                                          +{formatPrice(addon.price || 0)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Quantity Controls */}
                              <div className="mt-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center border rounded-lg">
                                    <button
                                      onClick={() => handleQuantityChange(cartItem.id, -1)}
                                      disabled={cartItem.quantity <= 1}
                                      className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <FiMinus className="w-5 h-5" />
                                    </button>
                                    <span className="px-4 py-2 font-medium min-w-[60px] text-center border-x">
                                      {cartItem.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityChange(cartItem.id, 1)}
                                      className="p-2 text-gray-600 hover:text-blue-600"
                                    >
                                      <FiPlus className="w-5 h-5" />
                                    </button>
                                  </div>
                                  
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">
                                      {formatPrice(itemTotal)}
                                    </p>
                                    <button
                                      onClick={() => handleRemoveItem(cartItem.id)}
                                      className="mt-1 flex items-center text-red-600 hover:text-red-800 text-sm"
                                    >
                                      <FiTrash2 className="mr-1 w-4 h-4" />
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Cart Actions */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <button
                    onClick={clearCart}
                    className="flex items-center text-red-600 hover:text-red-800 font-medium"
                  >
                    <FiTrash2 className="mr-2" />
                    Clear Entire Cart
                  </button>
                  
                  <Link
                    href="/menu"
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <FiArrowLeft className="mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Total</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={`font-medium ${deliveryInfo.freeDelivery ? 'text-green-600' : ''}`}>
                    {deliveryInfo.freeDelivery ? 'FREE' : formatPrice(deliveryInfo.deliveryFee)}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {formatPrice(totalPrice + (deliveryInfo.freeDelivery ? 0 : deliveryInfo.deliveryFee))}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition mb-6 shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
