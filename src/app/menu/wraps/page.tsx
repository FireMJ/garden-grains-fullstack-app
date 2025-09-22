"use client";

import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { wraps } from "@/data/wrapsData";
import { useRouter } from "next/navigation";
import FloatingCartButton from "@/components/FloatingCartButton";
import { AddOn, Fry, Juice } from "@/types/menu";

export default function WrapsPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  // Selection states per item
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [selectedFries, setSelectedFries] = useState<Record<string, string[]>>({});
  const [selectedJuices, setSelectedJuices] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});

  // Helper to toggle selection in maps
  const toggleInMap = (
    mapSetter: React.Dispatch<React.SetStateAction<Record<string, string[]>>>,
    itemName: string,
    value: string
  ) => {
    mapSetter((prev) => {
      const current = prev[itemName] || [];
      return {
        ...prev,
        [itemName]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  // Special handler for juice selection (only one per size)
  const handleJuiceSelection = (itemName: string, juiceIdentifier: string) => {
    // Extract size from juice identifier (format: "size|juiceName")
    const [size] = juiceIdentifier.split('|');
    
    setSelectedJuices((prev) => {
      const current = prev[itemName] || [];
      
      // Remove any other juices of the same size
      const filtered = current.filter(j => !j.startsWith(`${size}|`));
      
      // If this juice is already selected, remove it (toggle off)
      if (current.includes(juiceIdentifier)) {
        return { ...prev, [itemName]: filtered };
      }
      
      // Otherwise, add this juice (and remove others of same size)
      return { ...prev, [itemName]: [...filtered, juiceIdentifier] };
    });
  };

  const handleAddToCart = (item: any, schedule = false) => {
    // Get selected add-ons
    const addOns: AddOn[] = (item.addOns || [])
      .filter((a: any) => (selectedAddOns[item.name] || []).includes(a.name))
      .map((a: any) => ({ ...a, quantity: 1 }));

    // Get selected fries
    const fries: Fry[] = (item.friesUpsell || [])
      .filter((f: any) => (selectedFries[item.name] || []).includes(f.name))
      .map((f: any) => ({ ...f, quantity: 1 }));

    // Get selected juices
    const juices: Juice[] = (selectedJuices[item.name] || []).map(juiceIdentifier => {
      const [size, name] = juiceIdentifier.split('|');
      
      // Find the juice in the item's juiceUpsell
      for (const group of item.juiceUpsell || []) {
        if (group.size === size) {
          const juice = group.options.find((opt: any) => opt.name === name);
          if (juice) {
            return { ...juice, size, quantity: 1 };
          }
        }
      }
      
      return null;
    }).filter(Boolean) as Juice[];

    // Create cart item with all selections
    const cartItem = {
      id: `${item.name}-${Date.now()}`,
      name: item.name,
      price: Number(item.price),
      quantity: 1,
      image: item.image,
      addOns: addOns.length > 0 ? addOns : undefined,
      fries: fries.length > 0 ? fries : undefined,
      juices: juices.length > 0 ? juices : undefined,
      specialInstructions: specialInstructions[item.name] || undefined,
    };

    addToCart(cartItem);

    if (schedule) {
      router.push("/schedule-order");
    }
  };

  // Prepare juice options for MenuItemCard (convert to array of identifiers)
  const getJuiceOptionsForItem = (item: any) => {
    const juiceOptions: any[] = [];
    
    (item.juiceUpsell || []).forEach((group: any) => {
      group.options.forEach((option: any) => {
        juiceOptions.push({
          ...option,
          identifier: `${group.size}|${option.name}`,
          displayName: `${option.name} (${group.size})`
        });
      });
    });
    
    return juiceOptions;
  };

  return (
    <main className="px-4 py-8 text-gray-900 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E4259]">Wraps</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-[#F4A261] text-white hover:bg-[#e68e42] transition"
        >
          ← Go Back
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {wraps.map((item, idx) => {
          const juiceOptions = getJuiceOptionsForItem(item);
          
          return (
            <div
              key={idx}
              className="rounded-2xl shadow-lg bg-white p-4 flex flex-col justify-between border border-gray-200"
            >
              <MenuItemCard
                {...item}
                className="border-none shadow-none p-0 mb-4"
                friesUpsell={item.friesUpsell}
                juiceUpsell={juiceOptions}
                selectedAddOns={selectedAddOns[item.name] || []}
                selectedFries={selectedFries[item.name] || []}
                selectedJuices={selectedJuices[item.name] || []}
                onToggleAddOn={(name: string) => toggleInMap(setSelectedAddOns, item.name, name)}
                onToggleFries={(name: string) => toggleInMap(setSelectedFries, item.name, name)}
                onToggleJuice={(identifier: string) => handleJuiceSelection(item.name, identifier)}
              />

              {/* Special Instructions */}
              <textarea
                placeholder="Special instructions (optional)"
                className="mt-3 p-2 border border-gray-300 rounded-md w-full text-sm focus:ring-2 focus:ring-[#F4A261]"
                value={specialInstructions[item.name] || ""}
                onChange={(e) =>
                  setSpecialInstructions((prev) => ({ ...prev, [item.name]: e.target.value }))
                }
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
                  onClick={() => handleAddToCart(item, true)}
                  className="w-full bg-[#F4A261] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#e68e42] transition"
                >
                  Schedule Order
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <FloatingCartButton />
    </main>
  );
}