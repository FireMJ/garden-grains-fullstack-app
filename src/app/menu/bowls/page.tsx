"use client";
import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { bowls, bowlDressings } from "@/data/bowlsData";
import FloatingCartButton from "@/components/FloatingCartButton";

export default function BowlsPage() {
  const { addToCart } = useCart();
  const router = useRouter();

  // Track add-on quantities per bowl
  const [selectedAddOns, setSelectedAddOns] = useState<
    Record<string, Record<string, number>>
  >({});
  const [selectedBases, setSelectedBases] = useState<Record<string, string>>({});
  const [selectedDressings, setSelectedDressings] = useState<Record<string, string>>({});
  const [selectedJuices, setSelectedJuices] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});

  const updateAddOnQuantity = (bowlName: string, addOnName: string, quantity: number) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [bowlName]: {
        ...prev[bowlName],
        [addOnName]: quantity,
      },
    }));
  };

  const handleBaseChange = (bowlName: string, base: string) => {
    setSelectedBases((prev) => ({ ...prev, [bowlName]: base }));
  };

  const handleDressingChange = (bowlName: string, dressing: string) => {
    setSelectedDressings((prev) => ({ ...prev, [bowlName]: dressing }));
  };

  const toggleJuiceSelection = (bowlName: string, juiceKey: string) => {
    setSelectedJuices((prev) => {
      const current = prev[bowlName] || [];
      return {
        ...prev,
        [bowlName]: current.includes(juiceKey)
          ? current.filter((j) => j !== juiceKey)
          : [...current, juiceKey],
      };
    });
  };

  const handleInstructionsChange = (bowlName: string, text: string) => {
    setSpecialInstructions((prev) => ({ ...prev, [bowlName]: text }));
  };

  const handleAddToCart = (bowl: any, schedule = false) => {
    const base = selectedBases[bowl.name];
    if (!base) {
      alert("Please select a base before adding to order.");
      return;
    }

    const dressing = selectedDressings[bowl.name];
    if (!dressing) {
      alert("Please select a dressing before adding to order.");
      return;
    }

    // Build addOns array with quantities
    const addOns =
      bowl.addOns
        ?.map((a: any) => {
          const qty = selectedAddOns[bowl.name]?.[a.name] || 0;
          return qty > 0 ? { ...a, quantity: qty } : null;
        })
        .filter(Boolean) || [];

    // Get selected juices
    const juices = (bowl.juiceUpsell || [])
      .flatMap((group: any) => (group.options || []).map((opt: any) => ({ ...opt, size: group.size })))
      .filter((j: any) => (selectedJuices[bowl.name] || []).includes(`${j.name}|${j.size}`));

    // Calculate total price including extras
    const basePrice = typeof bowl.price === "string" ? parseFloat(bowl.price) : bowl.price;
    const addOnsTotal = addOns.reduce((sum, a) => sum + (a.price * a.quantity), 0);
    const juicesTotal = juices.reduce((sum, j) => sum + j.price, 0);
    const totalPrice = basePrice + addOnsTotal + juicesTotal;

    // Generate a unique ID for this specific combination
    const uniqueId = `${bowl.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    addToCart(
      {
        ...bowl,
        id: uniqueId,
        base,
        dressing,
        addOns,
        juices,
        specialInstructions: specialInstructions[bowl.name] || "",
        totalPrice,
      }
    );

    if (schedule) router.push("/schedule-order");
  };

  return (
    <main className="px-4 py-8 text-gray-900 bg-[#1E4259] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600">Bowls</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-[#F4A261] text-white hover:bg-[#e68e42] transition"
        >
          ← Go Back
        </button>
      </div>

      {/* Bowl Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {bowls.map((item, index) => {
          const flattenedJuices = (item.juiceUpsell || []).flatMap((g: any) =>
            (g.options || []).map((opt: any) => ({ ...opt, size: g.size }))
          );

          return (
            <div
              key={index}
              className="rounded-2xl shadow-lg bg-[#6c8665] p-4 flex flex-col justify-between border border-gray-100"
            >
              <MenuItemCard
                {...item}
                className="border-none shadow-none p-0 mb-4"
                juiceUpsell={flattenedJuices}
                selectedJuices={selectedJuices[item.name] || []}
                onToggleJuice={(nameAndSize: string) => toggleJuiceSelection(item.name, nameAndSize)}
              />

              {/* Base Selection */}
              <div className="mt-4">
                <h4 className="font-semibold text-[#1E4259] mb-2">
                  Base <span className="text-red-500">*</span>
                </h4>
                <select
                  value={selectedBases[item.name] || ""}
                  onChange={(e) => handleBaseChange(item.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#F4A261]"
                >
                  <option value="">-- select a base --</option>
                  {item.baseOptions?.map((base: string, i: number) => (
                    <option key={i} value={base}>
                      {base}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add-ons with quantity controls */}
              {item.addOns?.length > 0 && (
                <div className="mt-3 mb-3">
                  <h4 className="font-semibold text-[#1E4259] mb-2">Add-ons</h4>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 flex flex-col scrollbar-thin scrollbar-thumb-[#F4A261] scrollbar-track-gray-100">
                    {item.addOns.map((addOn: any, i: number) => {
                      const qty = selectedAddOns[item.name]?.[addOn.name] || 0;
                      return (
                        <div
                          key={i}
                          className="flex items-center justify-between mb-2 text-sm text-[#4A665E]"
                        >
                          <label className="flex items-center gap-2 cursor-pointer flex-grow">
                            <input
                              type="checkbox"
                              checked={qty > 0}
                              onChange={(e) =>
                                updateAddOnQuantity(
                                  item.name,
                                  addOn.name,
                                  e.target.checked ? 1 : 0
                                )
                              }
                              className="h-4 w-4 text-[#F4A261] focus:ring-[#F4A261]"
                            />
                            {addOn.name} (+R{addOn.price})
                          </label>
                          {qty > 0 && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateAddOnQuantity(
                                    item.name,
                                    addOn.name,
                                    Math.max(qty - 1, 0)
                                  )
                                }
                                className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="w-5 text-center">{qty}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateAddOnQuantity(item.name, addOn.name, qty + 1)
                                }
                                className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dressing */}
              <div className="mt-4">
                <h4 className="font-semibold text-[#1E4259] mb-2">
                  Dressing <span className="text-red-500">*</span>
                </h4>
                <select
                  value={selectedDressings[item.name] || ""}
                  onChange={(e) => handleDressingChange(item.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#F4A261]"
                >
                  <option value="">-- select a dressing --</option>
                  {bowlDressings.map((dressing, i) => (
                    <option key={i} value={dressing}>
                      {dressing}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Instructions */}
              <textarea
                placeholder="Special instructions (optional)"
                className="mt-3 p-2 border border-gray-300 rounded-md w-full text-sm focus:ring-2 focus:ring-[#F4A261]"
                value={specialInstructions[item.name] || ""}
                onChange={(e) => handleInstructionsChange(item.name, e.target.value)}
                rows={2}
              />

              {/* Add to Cart & Schedule Order */}
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
        })}
      </div>

      {/* Floating Cart Button */}
      <FloatingCartButton />
    </main>
  );
}