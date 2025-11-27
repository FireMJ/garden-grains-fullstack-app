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
  price?: number; // ✅ Added price property
  sizes?: SizeOption[]; // optional — soups or drinks might not use this
  tags?: string[];
  image?: string;
  addOns?: AddOn[];
  selectedSize?: string;
  selectedAddOns?: string[];
  specialInstructions?: string;
  onSizeSelect?: (size: string) => void;
  onToggleAddOn?: (addOnName: string) => void;
  onSpecialInstructionsChange?: (instructions: string) => void;
  showAddOns?: boolean;
}

const MenuItemCard = ({
  name,
  description,
  price, // ✅ Added price parameter
  sizes = [],
  tags = [],
  image,
  addOns = [],
  selectedSize = "",
  selectedAddOns = [],
  specialInstructions = "",
  onSizeSelect,
  onToggleAddOn,
  onSpecialInstructionsChange,
  showAddOns = false,
}: MenuItemCardProps) => {
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSpecialInstructionsChange?.(e.target.value);
  };

  const calculateTotal = () => {
    // Use the base price if provided, otherwise calculate from sizes
    const basePrice = price || 0;
    const sizePrice =
      Array.isArray(sizes) && sizes.length > 0
        ? sizes.find((s) => s.size === selectedSize)?.price || sizes[0]?.price || 0
        : 0;
    const addonsTotal = Array.isArray(addOns)
      ? addOns
          .filter((a) => selectedAddOns.includes(a.name))
          .reduce((sum, a) => sum + a.price, 0)
      : 0;
    return basePrice + sizePrice + addonsTotal;
  };

  const hasSizes = Array.isArray(sizes) && sizes.length > 0;
  const hasAddOns = Array.isArray(addOns) && addOns.length > 0;
  const hasTags = Array.isArray(tags) && tags.length > 0;

  return (
    <div className="rounded-2xl shadow-lg bg-white p-4 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* 🖼️ Image */}
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

      {/* ℹ️ Info */}
      <div className="flex-1 mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}

        {/* ✅ Display base price if available and no sizes */}
        {price && !hasSizes && (
          <div className="mt-2">
            <span className="text-lg font-bold text-green-600">R{price.toFixed(2)}</span>
          </div>
        )}

        {/* ✅ Only render size selection if available */}
        {hasSizes && (
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

        {/* ✅ Add-ons */}
        {showAddOns && hasAddOns && (
          <div className="mt-4">
            <button
              className="w-full text-left font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition flex justify-between items-center"
              onClick={() => setCustomizeOpen((prev) => !prev)}
            >
              Customize Your Order
              <span
                className={`transform transition-transform ${
                  customizeOpen ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {customizeOpen && (
              <div className="mt-2 space-y-2">
                {addOns.map((addOn) => (
                  <label
                    key={addOn.name}
                    className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.includes(addOn.name)}
                        onChange={() => onToggleAddOn?.(addOn.name)}
                        className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{addOn.name}</span>
                    </div>
                    <span className="text-sm text-green-600">+R{addOn.price}</span>
                  </label>
                ))}

                {/* ✍️ Special Instructions */}
                <textarea
                  value={specialInstructions}
                  onChange={handleInstructionsChange}
                  placeholder="Any special requests..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent mt-2"
                  rows={2}
                />
              </div>
            )}
          </div>
        )}

        {/* ✅ Tags */}
        {hasTags && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Total (always shown, even if no sizes) */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Total:</span>
        <span className="text-lg font-bold text-green-600">
          R{calculateTotal().toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default MenuItemCard;
