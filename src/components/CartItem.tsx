'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    addOns?: Array<{ id: string; name: string; price: number; quantity: number }>;
    specialInstructions?: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart, updateAddOnQuantity, removeAddOn } = useCart();

  // Calculate item total including add-ons
  const getItemTotal = () => {
    let total = item.price * item.quantity;
    if (item.addOns && item.addOns.length > 0) {
      const addOnsTotal = item.addOns.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
      total += addOnsTotal;
    }
    return total;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3">
      <div className="flex gap-3">
        {/* Image */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No image
            </div>
          )}
        </div>
        
        {/* Details */}
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
            <div className="mt-2 space-y-1">
              {item.addOns.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{addon.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateAddOnQuantity(item.id, addon.id, addon.quantity - 1)}
                        className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50]"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs w-4 text-center">{addon.quantity}</span>
                      <button
                        onClick={() => updateAddOnQuantity(item.id, addon.id, addon.quantity + 1)}
                        className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50]"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <span className="text-green-600">R {(addon.price * addon.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-3">
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
              R {getItemTotal().toFixed(2)}
            </span>
          </div>
          
          {/* Special Instructions */}
          {item.specialInstructions && (
            <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <span className="font-medium">Note:</span> {item.specialInstructions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
