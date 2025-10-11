"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface Juice {
  id: string;
  name: string;
  description: string;
  prices: { S: number; M: number; L: number };
  image: string;
  addOns?: AddOn[];
}

export default function JuiceCustomizer({ juice }: { juice: Juice }) {
  const { addToCart } = useCart();

  const [size, setSize] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string>("");

  const toggleAddOn = (addOnName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnName)
        ? prev.filter((a) => a !== addOnName)
        : [...prev, addOnName]
    );
  };

  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const chosenAddOns =
      juice.addOns?.filter((a) => selectedAddOns.includes(a.name)) || [];

    const basePrice = juice.prices[size as keyof typeof juice.prices];
    const addOnTotal = chosenAddOns.reduce((sum, a) => sum + a.price, 0);

    addToCart(
      {
        ...juice,
        size,
        addOns: chosenAddOns,
        specialInstructions: instructions,
        price: basePrice + addOnTotal,
      },
      1
    );

    alert(`${juice.name} (${size}) added to cart!`);
  };

  return (
    <div className="bg-white text-gray-800 p-4 rounded-xl shadow-md space-y-4">
      {/* Size Selector */}
      <div>
        <label className="block font-semibold mb-2 text-green-900">
          Choose your size <span className="text-red-500">*</span>
        </label>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F4A261]"
        >
          <option value="">-- Select Size --</option>
          <option value="S">Small - R{juice.prices.S}</option>
          <option value="M">Medium - R{juice.prices.M}</option>
          <option value="L">Large - R{juice.prices.L}</option>
        </select>
      </div>

      {/* Add-ons */}
      {juice.addOns && juice.addOns.length > 0 && (
        <div>
          <label className="block font-semibold mb-2 text-green-900">
            Add-ons
          </label>
          <div className="space-y-2">
            {juice.addOns.map((addOn) => {
              const isSelected = selectedAddOns.includes(addOn.name);
              return (
                <label
                  key={addOn.id}
                  className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-green-50 border-green-500 shadow-sm"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAddOn(addOn.name)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-gray-700">{addOn.name}</span>
                  </div>
                  <span className="text-green-600 font-medium">
                    +R{addOn.price}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Special Instructions */}
      <div>
        <label className="block font-semibold mb-2 text-green-900">
          Special instructions (optional)
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={2}
          placeholder="Add any special notes..."
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F4A261]"
        />
      </div>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-[#F4A261] hover:bg-[#e68e42] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
      >
        Add to Cart
      </button>
    </div>
  );
}
