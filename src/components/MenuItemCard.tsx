"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface FriesUpsell {
  name: string;
  price: number;
}

export interface JuiceItem {
  name: string;
  price: number;
  size: string;
}

export interface AddOn {
  name: string;
  price: number;
}

export interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price?: number; // Make price optional
  tags?: string[];
  image?: string;
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceItem[];
  addOns?: AddOn[];
  selectedFries?: string[];
  selectedJuices?: string[];
  selectedAddOns?: string[];
  specialInstructions?: string;
  onToggleFries?: (friesName: string) => void;
  onToggleJuice?: (juiceIdentifier: string) => void;
  onToggleAddOn?: (addOnName: string) => void;
  onSpecialInstructionsChange?: (instructions: string) => void;
}

const MenuItemCard = ({
  name,
  description,
  price = 0, // Default to 0 if undefined
  tags = [],
  image,
  friesUpsell = [],
  juiceUpsell = [],
  addOns = [],
  selectedFries = [],
  selectedJuices = [],
  selectedAddOns = [],
  specialInstructions = "",
  onToggleFries,
  onToggleJuice,
  onToggleAddOn,
  onSpecialInstructionsChange,
}: MenuItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSpecialInstructionsChange?.(e.target.value);
  };

  const calculateTotal = () => {
    const basePrice = price || 0; // Safe base price
    
    const friesTotal = friesUpsell
      .filter(f => selectedFries.includes(f.name))
      .reduce((sum, f) => sum + (f.price || 0), 0);

    const juicesTotal = juiceUpsell
      .filter(j => selectedJuices.includes(`${j.name} - ${j.size}`))
      .reduce((sum, j) => sum + (j.price || 0), 0);

    const addonsTotal = addOns
      .filter(a => selectedAddOns.includes(a.name))
      .reduce((sum, a) => sum + (a.price || 0), 0);

    return basePrice + friesTotal + juicesTotal + addonsTotal;
  };

  // Safe price formatting
  const formatPrice = (amount: number) => {
    return `R${(amount || 0).toFixed(2)}`;
  };

  return (
    <div className="rounded-2xl shadow-lg bg-white p-4 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-shadow duration-300">
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
        
        {/* Safe price display */}
        <p className="text-green-600 font-bold mt-1">
          {price !== undefined ? formatPrice(price) : "Price unavailable"}
        </p>

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

      {/* Total - Only show if there are upsells/addons */}
      {(friesUpsell.length > 0 || juiceUpsell.length > 0 || addOns.length > 0) && (
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total:</span>
          <span className="text-lg font-bold text-green-600">{formatPrice(calculateTotal())}</span>
        </div>
      )}
    </div>
  );
};

export default MenuItemCard;