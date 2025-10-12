"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface SizeOption {
  size: string;
  price: number;
}

export interface AddOn {
  name: string;
  price: number;
}

export interface MenuItemCardProps {
  id?: string | number;
  name: string;
  description?: string;
  sizes?: SizeOption[]; // ← Made optional
  price?: number; // ← Added for home page items
  tags?: string[];
  image?: string;
  addOns?: AddOn[];
  selectedSize?: string;
  selectedAddOns?: string[];
  specialInstructions?: string;
  onSizeSelect?: (size: string) => void;
  onToggleAddOn?: (addOnName: string) => void;
  onSpecialInstructionsChange?: (instructions: string) => void;
  className?: string;
}

const MenuItemCard = ({
  name,
  description,
  sizes = [], // Default to empty array
  price, // For home page items
  tags = [],
  image,
  addOns = [],
  selectedSize = "",
  selectedAddOns = [],
  specialInstructions = "",
  onSizeSelect,
  onToggleAddOn,
  onSpecialInstructionsChange,
  className = "",
}: MenuItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSpecialInstructionsChange?.(e.target.value);
  };

  const calculateTotal = () => {
    // If we have sizes, use selected size price
    if (sizes.length > 0) {
      const sizePrice = sizes.find(s => s.size === selectedSize)?.price || 0;
      const addonsTotal = addOns
        .filter(a => selectedAddOns.includes(a.name))
        .reduce((sum, a) => sum + a.price, 0);
      return sizePrice + addonsTotal;
    }
    
    // If no sizes, use direct price (for home page)
    const addonsTotal = addOns
      .filter(a => selectedAddOns.includes(a.name))
      .reduce((sum, a) => sum + a.price, 0);
    return (price || 0) + addonsTotal;
  };

  const selectedSizeObj = sizes.find(s => s.size === selectedSize);

  return (
    <div className={`rounded-2xl shadow-lg bg-white p-4 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Image */}
      {image && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="transition-transform duration-500 hover:scale-105 object-cover"
          />
        </div>
      )}

      <div className="flex-1 mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        
        {/* Display price for home page items */}
        {!sizes.length && price !== undefined && (
          <p className="text-green-600 font-bold mt-1">R{price}</p>
        )}
        
        {/* Size Selection - Only show if we have sizes */}
        {sizes.length > 0 && (
          <div className="mt-3">
            <label className="font-semibold text-gray-700 mb-2 block">
              Size <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((sizeOption) => (
                <button
                  key={sizeOption.size}
                  onClick={() => onSizeSelect?.(sizeOption.size)}
                  className={`p-2 border rounded-lg text-sm font-medium transition-all ${
                    selectedSize === sizeOption.size
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {sizeOption.size}
                  <div className="text-xs mt-1">R{sizeOption.price}</div>
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-red-500 text-xs mt-1">Please select a size</p>
            )}
          </div>
        )}

        {/* Add-ons Section - Only show if we have add-ons */}
        {addOns.length > 0 && (
          <div className="mt-4">
            <label className="font-semibold text-gray-700 mb-2 block">Add-ons</label>
            <div className="space-y-2">
              {addOns.map((addOn) => (
                <label key={addOn.name} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addOn.name)}
                    onChange={() => onToggleAddOn?.(addOn.name)}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">{addOn.name}</span>
                  <span className="text-sm text-green-600">+R{addOn.price}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Special Instructions - Only show if we have callback */}
        {onSpecialInstructionsChange && (
          <div className="mt-4">
            <label className="font-semibold text-gray-700 mb-2 block">Special Instructions</label>
            <textarea
              value={specialInstructions}
              onChange={handleInstructionsChange}
              placeholder="Any special requests..."
              className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={2}
            />
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Total - Only show if we have sizes or add-ons */}
      {(sizes.length > 0 || addOns.length > 0) && (
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total:</span>
          <span className="text-lg font-bold text-green-600">
            R{calculateTotal().toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;