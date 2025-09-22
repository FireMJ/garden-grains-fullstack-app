"use client";

import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { fries } from "@/data/friesData";
import FloatingCartButton from "@/components/FloatingCartButton";

export default function FriesPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  // Selection states per item
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
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

  const handleAddToCart = (item: any, schedule = false) => {
    const addOns = (item.addOns || []).filter((a: any) =>
      (selectedAddOns[item.name] || []).includes(a.name)
    );

    const juices = (item.juiceUpsell || [])
      .flatMap((group: any) => (group.options || []).map((opt: any) => ({ ...opt, size: group.size })))
      .filter((j: any) => (selectedJuices[item.name] || []).includes(`${j.name}|${j.size}`));

    // Calculate total price including extras
    const extrasTotal =
      addOns.reduce((sum, a) => sum + a.price, 0) +
      juices.reduce((sum, j) => sum + j.price, 0);

    const totalPrice = Number(item.price) + extrasTotal;

    // Generate a unique ID for this specific combination
    const uniqueId = `${item.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    addToCart(
      {
        ...item,
        id: uniqueId,
        addOns,
        juices,
        specialInstructions: specialInstructions[item.name] || "",
        totalPrice,
      }
    );

    if (schedule) router.push("/schedule-order");
  };

  const items = Array.isArray(fries) ? fries : [];

  return (
    <main className="px-4 py-8 text-gray-900 bg-[#1E4259] min-h-screen">
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600">Fries</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-[#F4A261] text-white hover:bg-[#e68e42] transition"
        >
          ← Go Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.length > 0 ? (
          items.map((item, index) => {
            const flattenedJuices = (item.juiceUpsell || []).flatMap((g: any) =>
              (g.options || []).map((opt: any) => ({ ...opt, size: g.size }))
            );

            return (
              <div key={index} className="rounded-2xl shadow-lg bg-[#6c8665] p-4 flex flex-col justify-between border border-gray-100">
                <MenuItemCard
                  {...item}
                  className="border-none shadow-none p-0 mb-4"
                  juiceUpsell={flattenedJuices}
                  selectedAddOns={selectedAddOns[item.name] || []}
                  selectedJuices={selectedJuices[item.name] || []}
                  onToggleAddOn={(name: string) => toggleInMap(setSelectedAddOns, item.name, name)}
                  onToggleJuice={(nameAndSize: string) => toggleInMap(setSelectedJuices, item.name, nameAndSize)}
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

                <div className="mt-4 flex gap-2 flex-col">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors duration-300"
                  >
                    Add to Order
                  </button>
                  <button
                    onClick={() => handleAddToCart(item, true)}
                    className="w-full bg-[#F4A261] text-white font-semibold py-2 px-4 rounded-xl hover:bg-[#e68e42] transition-colors duration-300"
                  >
                    Schedule Order
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600 col-span-full text-center py-8">No fries available at the moment.</p>
        )}
      </div>

      {/* Floating Cart Button */}
      <FloatingCartButton />
    </main>
  );
}