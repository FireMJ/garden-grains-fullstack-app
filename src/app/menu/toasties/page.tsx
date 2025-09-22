"use client";

import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { toasties } from "@/data/toastiesData";
import { useRouter } from "next/navigation";
import FloatingCartButton from "@/components/FloatingCartButton";

export default function ToastiesPage() {
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

  const handleAddToCart = (item: any, schedule = false) => {
    const addOns = (item.addOns || []).filter((a: any) =>
      (selectedAddOns[item.name] || []).includes(a.name)
    );

    const fries = (item.friesUpsell || []).filter((f: any) =>
      (selectedFries[item.name] || []).includes(f.name)
    );

    const juices = (item.juiceUpsell || [])
      .flatMap((group: any) => (group.options || []).map((opt: any) => ({ ...opt, size: group.size })))
      .filter((j: any) => (selectedJuices[item.name] || []).includes(`${j.name}|${j.size}`));

    // Calculate total price including extras
    const extrasTotal =
      addOns.reduce((sum, a) => sum + a.price, 0) +
      fries.reduce((sum, f) => sum + f.price, 0) +
      juices.reduce((sum, j) => sum + j.price, 0);

    const totalPrice = Number(item.price) + extrasTotal;

    addToCart(
      {
        ...item,
        addOns,
        fries,
        juices,
        specialInstructions: specialInstructions[item.name] || "",
        totalPrice,
      },
      1
    );

    if (schedule) router.push("/schedule-order");
  };

  return (
    <main className="px-4 py-8 text-gray-900 bg-[#1E4259] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E4259]">Toasties</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-[#F4A261] text-white hover:bg-[#e68e42] transition"
        >
          ← Go Back
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {toasties.map((item, idx) => {
          const flattenedJuices = (item.juiceUpsell || []).flatMap((g: any) =>
            (g.options || []).map((opt: any) => ({ ...opt, size: g.size }))
          );

          return (
            <div
              key={idx}
              className="rounded-2xl shadow-lg bg-[#6c8665] p-4 flex flex-col justify-between border border-gray-100"
            >
              <MenuItemCard
                {...item}
                className="border-none shadow-none p-0 mb-4"
                friesUpsell={item.friesUpsell}
                juiceUpsell={flattenedJuices}
                selectedAddOns={selectedAddOns[item.name] || []}
                selectedFries={selectedFries[item.name] || []}
                selectedJuices={selectedJuices[item.name] || []}
                onToggleAddOn={(name: string) => toggleInMap(setSelectedAddOns, item.name, name)}
                onToggleFries={(name: string) => toggleInMap(setSelectedFries, item.name, name)}
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