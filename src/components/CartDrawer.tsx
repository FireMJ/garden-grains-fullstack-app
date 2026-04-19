'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, X, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, itemCount } = useCart();

  // Calculate item total including add-ons
  const getItemTotal = (item: any) => {
    let total = item.price * item.quantity;
    if (item.addOns && item.addOns.length > 0) {
      const addOnsTotal = item.addOns.reduce((sum: number, addon: any) => sum + (addon.price * addon.quantity), 0);
      total += addOnsTotal;
    }
    return total;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#2F5D50]" />
            <h2 className="text-xl font-semibold text-gray-900">Your Cart</h2>
            <span className="text-sm text-gray-500">({itemCount} items)</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Your cart is empty</p>
              <Link href="/menu" onClick={onClose} className="text-[#2F5D50] text-sm hover:underline mt-2 inline-block">
                Browse Menu →
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                {/* Item Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                </div>
                
                {/* Item Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">R {item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* Add-ons */}
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {item.addOns.map((addon) => (
                        <div key={addon.id} className="flex justify-between text-xs text-gray-600">
                          <span>{addon.quantity}x {addon.name}</span>
                          <span>+R {(addon.price * addon.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-bold text-gray-900">
                      R {getItemTotal(item).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>R {totalPrice.toFixed(2)}</span>
            </div>
            <Link
              href="/cart"
              onClick={onClose}
              className="block w-full text-center bg-[#2F5D50] text-white py-3 rounded-xl font-semibold hover:bg-[#23483E] transition-colors"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center border-2 border-[#2F5D50] text-[#2F5D50] py-3 rounded-xl font-semibold hover:bg-[#2F5D50]/5 transition-colors"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
