'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

export default function CartPage() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [deliveryFee, setDeliveryFee] = useState(35);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate delivery fee based on total
  useEffect(() => {
    const total = cart.totalPrice || 0;
    if (total >= 200) {
      setIsFreeDelivery(true);
      setDeliveryFee(0);
    } else {
      setIsFreeDelivery(false);
      setDeliveryFee(35);
    }
  }, [cart.totalPrice]);

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const formatPrice = (price: number) => {
    return `R ${price.toFixed(2)}`;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={64} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/menu" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalPrice;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.cartItems.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 relative flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{item.category || 'Item'}</p>
                          </div>
                          <button
                            onClick={() => cart.removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-lg font-bold text-green-600">{formatPrice(item.price)}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        {/* Expand/Collapse button for extras */}
                        {(item.addOns?.length > 0 || item.fries || item.juice || item.specialInstructions) && (
                          <button
                            onClick={() => toggleExpandItem(item.id)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 mt-3"
                          >
                            {expandedItems[item.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {expandedItems[item.id] ? 'Hide' : 'Show'} Extras
                          </button>
                        )}
                        
                        {/* Expanded extras section */}
                        {expandedItems[item.id] && (
                          <div className="mt-3 pt-3 border-t space-y-2">
                            {/* Base and Dressing */}
                            {item.base && (
                              <p className="text-sm text-gray-600">Base: {item.base}</p>
                            )}
                            {item.dressing && (
                              <p className="text-sm text-gray-600">Dressing: {item.dressing}</p>
                            )}
                            {item.protein && (
                              <p className="text-sm text-gray-600">Protein: {item.protein}</p>
                            )}
                            
                            {/* Add-ons */}
                            {item.addOns && item.addOns.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-1">Add-ons:</p>
                                {item.addOns.map((addon, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm pl-2">
                                    <span>{addon.name} {addon.quantity > 1 && `(x${addon.quantity})`}</span>
                                    <span className="text-green-600">+{formatPrice(addon.price * addon.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Fries */}
                            {item.fries && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-1">Fries:</p>
                                <div className="pl-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{item.fries.name}</span>
                                    <span className="text-green-600">+{formatPrice(item.fries.price)}</span>
                                  </div>
                                  {item.fries.dip && (
                                    <div className="flex justify-between text-sm pl-4">
                                      <span className="text-gray-600">└ {item.fries.dip}</span>
                                      {item.fries.dipPrice > 0 && <span className="text-green-600">+{formatPrice(item.fries.dipPrice)}</span>}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Juice */}
                            {item.juice && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-1">Juice:</p>
                                <div className="pl-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{item.juice.name} ({item.juice.size})</span>
                                    <span className="text-green-600">+{formatPrice(item.juice.price)}</span>
                                  </div>
                                  {item.juice.addOns && item.juice.addOns.length > 0 && (
                                    <div className="pl-4 mt-1">
                                      {item.juice.addOns.map((booster, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                          <span className="text-gray-600">└ + {booster.name}</span>
                                          <span className="text-green-600">+{formatPrice(booster.price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {/* Special Instructions */}
                            {item.specialInstructions && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-1">Special Instructions:</p>
                                <p className="text-sm text-gray-600 pl-2">{item.specialInstructions}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={isFreeDelivery ? 'text-green-600 font-medium' : ''}>
                    {isFreeDelivery ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>
              
              {/* Free delivery progress */}
              {!isFreeDelivery && subtotal > 0 && subtotal < 200 && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Free delivery over R200</span>
                    <span>R{(200 - subtotal).toFixed(2)} more to go!</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 rounded-full h-2 transition-all"
                      style={{ width: `${Math.min(100, (subtotal / 200) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">VAT included</p>
              </div>
              
              <Link href="/checkout">
                <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add to cart page - delivery availability check
const isDeliveryAvailable = (distance: number) => {
  return distance <= 60;
};
