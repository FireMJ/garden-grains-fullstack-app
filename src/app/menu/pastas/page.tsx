"use client";

import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { pastas } from "@/data/pastasData";
import { useRouter } from "next/navigation";

export default function PastasPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});

  const handleAddOnChange = (pastaName: string, addOnName: string) => {
    setSelectedAddOns((prev) => {
      const current = prev[pastaName] || [];
      return {
        ...prev,
        [pastaName]: current.includes(addOnName)
          ? current.filter((a) => a !== addOnName)
          : [...current, addOnName],
      };
    });
  };

  const handleInstructionsChange = (itemName: string, text: string) => {
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: text }));
  };

  const handleAddToCart = (item: any) => {
    const addOns =
      item.addOns?.filter((a: any) => (selectedAddOns[item.name] || []).includes(a.name)) || [];

    addToCart(
      {
        ...item,
        addOns,
        specialInstructions: specialInstructions[item.name] || "",
      },
      1
    );
  };

  return (
    <main className="px-4 py-8 text-gray-900 bg-[#1E4259] min-h-screen">
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E4259]">Pastas</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-[#F4A261] text-white hover:bg-[#e68e42] transition"
        >
          ← Go Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {pastas.map((item, index) => (
          <div key={index} className="rounded-2xl shadow-lg bg-[#6c8665] p-4 flex flex-col justify-between border border-gray-100">
            {/* MenuItemCard handles the image, name, description, and price */}
            <MenuItemCard 
              {...item} 
              className="border-none shadow-none p-0 mb-4"
            />

            {/* Add-ons with selection capability */}
            {item.addOns?.length > 0 && (
              <div className="mt-3 mb-3">
                <h4 className="font-semibold text-[#1E4259] mb-2">Add-ons</h4>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {item.addOns.map((addOn) => (
                    <label key={addOn.name} className="flex items-center justify-between mb-2 text-sm text-[#4A665E]">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={(selectedAddOns[item.name] || []).includes(addOn.name)}
                          onChange={() => handleAddOnChange(item.name, addOn.name)}
                          className="h-4 w-4 text-[#F4A261] focus:ring-[#F4A261] mr-2"
                        />
                        <span>{addOn.name}</span>
                      </div>
                      <span>+R{addOn.price}</span>
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