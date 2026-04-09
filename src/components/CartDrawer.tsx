"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaTimes, FaTrash, FaPlus, FaMinus } from "react-icons/fa";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (!isOpen) return null;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-[#2F5D50]">
            Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Link 
                href="/menu" 
                onClick={onClose}
                className="inline-block bg-[#2F5D50] text-white px-4 py-2 rounded-lg hover:bg-[#244a3f] transition"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                // Calculate item total including add-ons
                const addOnsTotal = item.addOns?.reduce((sum, addOn) => sum + (addOn.price || 0), 0) || 0;
                const friesTotal = item.fries?.price || 0;
                const juiceTotal = item.juice?.price || 0;
                const baseExtra = item.baseExtra || 0;
                const itemTotal = (item.price + addOnsTotal + friesTotal + juiceTotal + baseExtra) * item.quantity;

                return (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    {/* Image */}
                    {item.image && (
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                          sizes="64px"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">R{item.price.toFixed(2)} each</p>
                      
                      {/* Juice add-on */}
                      {item.juice && (
                        <p className="text-xs text-gray-500 mt-1">
                          + {(item.juice as any).option?.name || item.juice.name}
                          {item.juice.size && ` (${item.juice.size})`}
                        </p>
                      )}

                      {/* Fries add-on */}
                      {item.fries && (
                        <p className="text-xs text-gray-500">
                          + {item.fries.name}
                        </p>
                      )}

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center text-sm"
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center text-sm"
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-[#2F5D50]">
                        R{itemTotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="text-green-600">R35.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#2F5D50] pt-2 border-t">
                <span>Total</span>
                <span>R{(totalPrice + 35).toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/order"
              onClick={onClose}
              className="block w-full bg-[#2F5D50] text-white text-center py-3 rounded-lg hover:bg-[#244a3f] transition font-semibold"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
