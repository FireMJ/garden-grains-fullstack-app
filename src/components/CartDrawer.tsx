'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, X, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getItemTotal = (item: any) => {
    let total = item.price * item.quantity;
    if (item.addOns) {
      total += item.addOns.reduce((sum: number, addon: any) => sum + (addon.price * addon.quantity), 0);
    }
    if (item.fries) {
      total += item.fries.price * item.quantity;
      if (item.fries.dipPrice) {
        total += item.fries.dipPrice * item.quantity;
      }
    }
    if (item.juice) {
      total += item.juice.price * item.quantity;
      if (item.juice.addOns) {
        total += item.juice.addOns.reduce((sum: number, addon: any) => sum + addon.price, 0) * item.quantity;
      }
    }
    return total;
  };

  const formatPrice = (price: number) => {
    return `R ${price.toFixed(2)}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Your Cart ({totalItems})</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 180px)' }}>
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-3">
                {/* Image */}
                <div className="w-20 h-20 relative flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                
                {/* Details */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  
                  {/* Add-ons summary */}
                  {item.addOns && item.addOns.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      + {item.addOns.map(a => a.name).join(', ')}
                    </p>
                  )}
                  {item.fries && (
                    <p className="text-xs text-gray-400">+ {item.fries.name}</p>
                  )}
                  {item.juice && (
                    <p className="text-xs text-gray-400">+ {item.juice.name} ({item.juice.size})</p>
                  )}
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-medium text-green-600">{formatPrice(getItemTotal(item))}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-green-600 text-lg">{formatPrice(totalPrice)}</span>
          </div>
          <Link href="/cart" onClick={onClose}>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold">
              View Cart & Checkout
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
