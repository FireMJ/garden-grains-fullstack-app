"use client";

import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { smoothies } from "@/data/smoothiesData";
import { useRouter } from "next/navigation";

export default function SmoothiesPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});

  const handleSizeChange = (itemName: string, size: string) => {
    setSelectedSize((prev) => ({ ...prev, [itemName]: size }));
  };

  const toggleAddOn = (itemName: string, addOnName: string) => {
    setSelectedAddOns((prev) => {
      const current = prev[itemName] || [];
      if (current.includes(addOnName)) {
        return { ...prev, [itemName]: current.filter((a) => a !== addOnName) };
      } else {
        return { ...prev, [itemName]: [...current, addOnName] };
      }
    });
  };

  const handleInstructionsChange = (itemName: string, text: string) => {
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: text }));
  };

  const handleAddToCart = (item: any) => {
    const size = selectedSize[item.name];
    if (!size) {
      alert("Please select a cup size before adding to order.");
      return;
    }

    const addOns = (selectedAddOns[item.name] || []).map(
      (name) => item.addOns.find((a: any) => a.name === name)
    );

    addToCart(
      {
        ...item,
        size,
        price: item.prices[size],
        addOns,
        specialInstructions: specialInstructions[item.name] || "",
      },
      1
    );
  };

  return (
    <main className="px-4 py-8 text-gray-900 bg-[#FAF7F2] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E4259]">Smoothies</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-[#F4A261] text-white hover:bg-[#e68e42] transition"
        >
          ← Go Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {smoothies.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-lg bg-white p-4 flex flex-col justify-between border border-gray-100"
          >
            {/* MenuItemCard handles the image, name, description, and price */}
            <MenuItemCard 
              {...item} 
              className="border-none shadow-none p-0 mb-4"
            />

            {/* Cup Size */}
            <div className="mt-3">
              <h4 className="font-semibold text-[#1E4259] mb-2">
                Cup Size <span className="text-red-500">*</span>
              </h4>
              <select
                value={selectedSize[item.name] || ""}
                onChange={(e) => handleSizeChange(item.name, e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#F4A261]"
              >
                <option value="">-- select size --</option>
                {Object.entries(item.prices || {}).map(([size, price]) => (
                  <option key={size} value={size}>
                    {size} (+R{price})
                  </option>
                ))}
              </select>
            </div>

            {/* Add-Ons */}
            {item.addOns?.length > 0 && (
              <div className="mt-3 mb-3">
                <h4 className="font-semibold text-[#1E4259] mb-2">Add-Ons</h4>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {item.addOns.map((addOn: any, i: number) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 mb-2 text-sm text-[#4A665E]"
                    >
                      <input
                        type="checkbox"
                        checked={(selectedAddOns[item.name] || []).includes(addOn.name)}
                        onChange={() => toggleAddOn(item.name, addOn.name)}
                        className="h-4 w-4 text-[#F4A261] focus:ring-[#F4A261]"
                      />
                      {addOn.name} (+R{addOn.price})
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <textarea
              placeholder="Special instructions (optional)"
              className="mt-3 p-2 border border-gray-300 rounded-md w-full text-sm focus:ring-2 focus:ring-[#F4A261]"
              value={specialInstructions[item.name] || ""}
              onChange={(e) => handleInstructionsChange(item.name, e.target.value)}
              rows={2}
            />

            {/* Buttons */}
            <div className="mt-4 flex gap-2 flex-col">
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full bg-[#1E4259] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#2A536B] transition"
              >
                Add to Order
              </button>
              <button
                onClick={() => router.push("/schedule-order")}
                className="w-full bg-[#F4A261] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#e68e42] transition"
              >
                Schedule Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}