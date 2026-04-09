"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

export interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  description?: string;
  instructions?: string;
  selectedSize?: string;
  bases?: string[];
  dressings?: string[];
  addOns?: { name: string; price: number; id?: string; quantity?: number }[];
  fries?: { name: string; price: number; size?: string };
  juice?: { name: string; price: number; size?: string };
  juices?: { name: string; price: number; size?: string }[]; // Add juices array
  friesUpsell?: { name: string; price: number; size?: string };
  juiceUpsell?: { name: string; price: number; size?: string };
  juiceSize?: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  getItemPriceBreakdown?: (id: string) => {
    basePrice: number;
    addonsTotal: number;
    juiceUpsellPrice: number;
    friesUpsellPrice: number;
    itemTotal: number;
  };
}

export default function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  category,
  description,
  instructions,
  selectedSize,
  bases = [],
  dressings = [],
  addOns = [],
  fries,
  juices = [],
  friesUpsell,
  juiceUpsell,
  juiceSize,
  onUpdateQuantity,
  onRemove,
  getItemPriceBreakdown,
}: CartItemProps) {

  // Calculate total price including all customizations
  const calculateItemTotal = () => {
    let total = price * quantity;

    // Add add-ons
    addOns.forEach(addOn => {
      total += (addOn.price || 0) * (addOn.quantity || 1) * quantity;
    });

    // Add fries
    if (fries) {
      total += fries.price * quantity;
    }

    // Add fries upsell
    if (friesUpsell) {
      total += friesUpsell.price * quantity;
    }

    // Add juice upsell
    if (juiceUpsell) {
      total += juiceUpsell.price * quantity;
    }
    
    // Add juices array
    if (juices && juices.length > 0) {
      juices.forEach(juice => {
        total += (juice.price || 0) * quantity;
      });
    }

    return total;
  };

  const displayTotal = calculateItemTotal();
  const hasCustomizations =
    addOns.length > 0 ||
    !!fries ||
    !!friesUpsell ||
    !!juiceUpsell ||
    (juices && juices.length > 0) ||
    bases.length > 0 ||
    dressings.length > 0 ||
    selectedSize ||
    instructions;

  return (
    <div className="flex gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition">
      {/* Item Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            🍽️
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            {category && (
              <p className="text-xs text-gray-500 uppercase">{category}</p>
            )}
            {description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
            )}
          </div>
          <button
            onClick={() => onRemove(id)}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Customizations Section */}
        {hasCustomizations && (
          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
            {/* Bases */}
            {bases.length > 0 && (
              <div className="flex items-center gap-1 text-xs mb-1">
                <span className="font-medium">Base:</span>
                <span>{bases.join(', ')}</span>
              </div>
            )}

            {/* Dressings */}
            {dressings.length > 0 && (
              <div className="flex items-center gap-1 text-xs mb-1">
                <span className="font-medium">Dressing:</span>
                <span>{dressings.join(', ')}</span>
              </div>
            )}

            {/* Add-ons */}
            {addOns.length > 0 && (
              <div className="mb-1">
                <span className="font-medium text-xs">Add-ons:</span>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {addOns.map((addOn, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>+ {addOn.name}</span>
                      <span className="text-green-600">R{addOn.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fries */}
            {fries && (
              <div className="flex justify-between text-xs mb-1">
                <span>+ {fries.name} {fries.size && `(${fries.size})`}</span>
                <span className="text-green-600">+R{fries.price.toFixed(2)}</span>
              </div>
            )}

            {/* Fries Upsell */}
            {friesUpsell && (
              <div className="flex justify-between text-xs mb-1">
                <span>+ {friesUpsell.name} {friesUpsell.size && `(${friesUpsell.size})`}</span>
                <span className="text-green-600">+R{friesUpsell.price.toFixed(2)}</span>
              </div>
            )}

            {/* Juice Upsell */}
            {juiceUpsell && (
              <div className="flex justify-between text-xs mb-1">
                <span>+ {juiceUpsell.name} {juiceSize && `(${juiceSize})`}</span>
                <span className="text-green-600">+R{juiceUpsell.price.toFixed(2)}</span>
              </div>
            )}

            {/* Juices array */}
            {juices && juices.length > 0 && (
              <div className="mb-1">
                {juices.map((juice, idx) => (
                  <div key={idx} className="flex justify-between text-xs mb-1">
                    <span>+ {juice.name} {juice.size && `(${juice.size})`}</span>
                    <span className="text-green-600">+R{juice.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Special Instructions */}
            {instructions && (
              <div className="text-xs text-gray-500 italic mt-1 pt-1 border-t border-gray-200">
                Note: {instructions}
              </div>
            )}
          </div>
        )}

        {/* Price and Quantity Controls */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="font-bold text-gray-900">
            R{displayTotal.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
