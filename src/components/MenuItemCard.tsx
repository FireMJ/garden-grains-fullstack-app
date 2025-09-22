"use client";
import React, { useState } from "react";
import Image from "next/image";

interface FriesUpsell {
  name: string;
  price: number;
}

interface JuiceItem {
  name: string;
  price: number;
  size: string;
}

interface AddOn {
  name: string;
  price: number;
}

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number | string;
  tags?: string[];
  image?: string;
  friesUpsell?: FriesUpsell[];
  juiceUpsell?: JuiceItem[];
  addOns?: AddOn[];
  selectedFries?: FriesUpsell[];
  selectedJuices?: JuiceItem[];
  selectedAddOns?: AddOn[];
  specialInstructions?: string;
  onToggleFries?: (fries: FriesUpsell) => void;
  onToggleJuice?: (juice: JuiceItem) => void;
  onToggleAddOn?: (addon: AddOn) => void;
  onSpecialInstructionsChange?: (instructions: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
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
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFriesToggle = (fries: FriesUpsell) => {
    if (onToggleFries) {
      onToggleFries(fries);
    }
  };

  const handleJuiceToggle = (juice: JuiceItem) => {
    if (onToggleJuice) {
      onToggleJuice(juice);
    }
  };

  const handleAddOnToggle = (addon: AddOn) => {
    if (onToggleAddOn) {
      onToggleAddOn(addon);
    }
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onSpecialInstructionsChange) {
      onSpecialInstructionsChange(e.target.value);
    }
  };

  const calculateTotal = () => {
    const basePrice = typeof price === "string" ? parseFloat(price) : price;
    const friesTotal = selectedFries.reduce((sum, fries) => sum + fries.price, 0);
    const juicesTotal = selectedJuices.reduce((sum, juice) => sum + juice.price, 0);
    const addonsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    
    return basePrice + friesTotal + juicesTotal + addonsTotal;
  };

  return (
    <div className="rounded-2xl shadow-lg bg-white p-4 flex flex-col justify-between border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Item Image */}
      {image && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        <p className="text-green-600 font-bold mt-1">R{price}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Customization Options */}
        {(friesUpsell.length > 0 || juiceUpsell.length > 0 || addOns.length > 0) && (
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center"
            >
              {isExpanded ? "Hide customization options" : "Customize your order"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="mt-3 space-y-4">
                {/* Add-ons Selection */}
                {addOns.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Add-ons:</p>
                    <div className="space-y-2">
                      {addOns.map((addon, index) => (
                        <label key={`addon-${index}`} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedAddOns.some(a => a.name === addon.name)}
                              onChange={() => handleAddOnToggle(addon)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {addon.name}
                            </span>
                          </div>
                          <span className="text-sm text-green-600">+R{addon.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fries Selection */}
                {friesUpsell.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Add Fries:</p>
                    <div className="space-y-2">
                      {friesUpsell.map((fries, index) => (
                        <label key={`fries-${index}`} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedFries.some(f => f.name === fries.name)}
                              onChange={() => handleFriesToggle(fries)}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {fries.name}
                            </span>
                          </div>
                          <span className="text-sm text-green-600">
                            {fries.price > 0 ? `+R${fries.price}` : "Optional"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Juice Upsell Selection */}
                {juiceUpsell.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Add Juice:</p>
                    <div className="space-y-2">
                      {juiceUpsell.map((juice, index) => {
                        const key = `${juice.name}|${juice.size}`;
                        return (
                          <label key={`juice-${index}`} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedJuices.some(j => `${j.name}|${j.size}` === key)}
                                onChange={() => handleJuiceToggle(juice)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {juice.name} ({juice.size})
                              </span>
                            </div>
                            <span className="text-sm text-green-600">+R{juice.price}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Special Instructions:</p>
                  <textarea
                    value={specialInstructions}
                    onChange={handleInstructionsChange}
                    placeholder="Any special requests?"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Total Display (without Add to Cart button) */}
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total:</span>
          <span className="text-lg font-bold text-green-600">R{calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;