"use client";

import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { bowls, bowlDressings } from "@/data/bowlsData";
import ReviewsSection from "@/components/ReviewsSection";

export default function BowlsPage() {
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [selectedJuices, setSelectedJuices] = useState<Record<string, string[]>>({});
  const [selectedFries, setSelectedFries] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});
  const [selectedDressing, setSelectedDressing] = useState<Record<string, string>>({});
  const [selectedBase, setSelectedBase] = useState<Record<string, string>>({});

  const toggleAddOn = (itemName: string, addOnName: string) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [itemName]: prev[itemName]?.includes(addOnName)
        ? prev[itemName].filter((a) => a !== addOnName)
        : [...(prev[itemName] || []), addOnName],
    }));
  };

  const toggleJuice = (itemName: string, juiceIdentifier: string) => {
    setSelectedJuices((prev) => ({
      ...prev,
      [itemName]: prev[itemName]?.includes(juiceIdentifier)
        ? prev[itemName].filter((j) => j !== juiceIdentifier)
        : [...(prev[itemName] || []), juiceIdentifier],
    }));
  };

  const toggleFries = (itemName: string, fryName: string) => {
    setSelectedFries((prev) => ({
      ...prev,
      [itemName]: prev[itemName]?.includes(fryName)
        ? prev[itemName].filter((f) => f !== fryName)
        : [...(prev[itemName] || []), fryName],
    }));
  };

  const handleInstructionsChange = (itemName: string, text: string) => {
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: text }));
  };

  const handleDressingChange = (itemName: string, dressing: string) => {
    setSelectedDressing((prev) => ({ ...prev, [itemName]: dressing }));
  };

  const handleBaseChange = (itemName: string, base: string) => {
    setSelectedBase((prev) => ({ ...prev, [itemName]: base }));
  };

  const handleAddToCart = (item: any) => {
    if (!selectedBase[item.name] || !selectedDressing[item.name]) {
      alert("Please select a base and dressing before adding to cart!");
      return;
    }

    const addOns = item.addOns?.filter((a: any) => 
      (selectedAddOns[item.name] || []).includes(a.name)
    ) || [];

    const fries = item.friesUpsell?.filter((f: any) => 
      (selectedFries[item.name] || []).includes(f.name)
    ) || [];

    const juices = item.juiceUpsell?.flatMap((group: any) =>
      group.options
        .filter((opt: any) =>
          (selectedJuices[item.name] || []).includes(`${opt.name} - ${group.size}`)
        )
        .map((opt: any) => ({ ...opt, size: group.size }))
    ) || [];

    // Calculate total price including add-ons, fries, and juices
    const addOnsPrice = addOns.reduce((sum: number, addOn: any) => sum + addOn.price, 0);
    const friesPrice = fries.reduce((sum: number, fry: any) => sum + fry.price, 0);
    const juicesPrice = juices.reduce((sum: number, juice: any) => sum + juice.price, 0);
    const totalPrice = item.price + addOnsPrice + friesPrice + juicesPrice;

    const cartItem = {
      ...item,
      base: selectedBase[item.name],
      dressing: selectedDressing[item.name],
      addOns,
      fries,
      juices,
      specialInstructions: specialInstructions[item.name] || "",
      price: totalPrice, // Use calculated total price
    };

    addToCart(cartItem, 1);
    alert(`${item.name} added to cart!`);
  };

  const handleClearSelections = (itemName: string) => {
    setSelectedAddOns((prev) => ({ ...prev, [itemName]: [] }));
    setSelectedFries((prev) => ({ ...prev, [itemName]: [] }));
    setSelectedJuices((prev) => ({ ...prev, [itemName]: [] }));
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: "" }));
    setSelectedDressing((prev) => ({ ...prev, [itemName]: "" }));
    setSelectedBase((prev) => ({ ...prev, [itemName]: "" }));
  };

  // Calculate current total for display
  const calculateCurrentTotal = (item: any) => {
    const addOns = item.addOns?.filter((a: any) => 
      (selectedAddOns[item.name] || []).includes(a.name)
    ) || [];

    const fries = item.friesUpsell?.filter((f: any) => 
      (selectedFries[item.name] || []).includes(f.name)
    ) || [];

    const juices = item.juiceUpsell?.flatMap((group: any) =>
      group.options
        .filter((opt: any) =>
          (selectedJuices[item.name] || []).includes(`${opt.name} - ${group.size}`)
        )
        .map((opt: any) => ({ ...opt, size: group.size }))
    ) || [];

    const addOnsPrice = addOns.reduce((sum: number, addOn: any) => sum + addOn.price, 0);
    const friesPrice = fries.reduce((sum: number, fry: any) => sum + fry.price, 0);
    const juicesPrice = juices.reduce((sum: number, juice: any) => sum + juice.price, 0);
    
    return item.price + addOnsPrice + friesPrice + juicesPrice;
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity || 1 +
      (item.addOns?.reduce((a, o) => a + o.price, 0) ?? 0) +
      (item.fries?.reduce((a, f) => a + f.price, 0) ?? 0) +
      (item.juices?.reduce((a, j) => a + j.price, 0) ?? 0),
    0
  );

  return (
    <main className="px-4 py-8 text-gray-900 bg-[#1E4259] min-h-screen">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-[#F4A261] text-white hover:bg-[#e68e42] transition"
        >
          ← Go Back
        </button>
        <h1 className="text-3xl font-bold text-green-200">Fresh Bowls</h1>
        <button
          onClick={() => router.push("/cart")}
          className="px-4 py-2 rounded-lg bg-[#F4A261] text-white hover:bg-[#e68e42] transition"
        >
          Go to Cart →
        </button>
      </div>

      {/* Sticky Cart */}
      {cart.length > 0 && (
        <div className="sticky top-0 z-10 bg-white p-4 rounded-lg shadow-md mb-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                Items in cart: {cart.reduce((sum, item) => sum + item.quantity || 1, 0)}
              </p>
              <p className="text-green-900 font-bold">Total: R {total.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/cart")}
                className="px-4 py-2 bg-green-100 text-green-900 rounded-lg hover:bg-green-200 transition"
              >
                Go to Cart
              </button>
              <button
                onClick={() => router.push("/schedule-order")}
                className="px-4 py-2 bg-yellow-100 text-yellow-900 rounded-lg hover:bg-yellow-200 transition"
              >
                Schedule Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bowls Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {bowls.map((item) => {
          const isReadyToAdd = selectedBase[item.name] && selectedDressing[item.name];
          const currentTotal = calculateCurrentTotal(item);

          return (
            <div
              key={item.name}
              className="rounded-2xl shadow-lg bg-[#6c8665] p-4 flex flex-col justify-between border border-gray-100"
            >
              <MenuItemCard {...item} />

              {/* Base Selection */}
              <div className="mt-4">
                <label className="font-semibold text-white mb-2 block">
                  Base <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedBase[item.name] || ""}
                  onChange={(e) => handleBaseChange(item.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#F4A261] bg-white"
                >
                  <option value="">-- select a base --</option>
                  {item.baseOptions?.map((base: string) => (
                    <option key={base} value={base}>
                      {base}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dressing Selection */}
              <div className="mt-4">
                <label className="font-semibold text-white mb-2 block">
                  Dressing <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDressing[item.name] || ""}
                  onChange={(e) => handleDressingChange(item.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-[#F4A261] bg-white"
                >
                  <option value="">-- select a dressing --</option>
                  {bowlDressings?.map((dressing: string) => (
                    <option key={dressing} value={dressing}>
                      {dressing}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Total Display */}
              {isReadyToAdd && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-green-800">Current Total:</span>
                    <span className="text-green-600 text-lg">R{currentTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Customize Order Section */}
              <details className="mt-4 bg-white rounded-md border border-gray-200">
                <summary className="cursor-pointer px-3 py-2 font-semibold text-green-900 hover:bg-gray-50 transition">
                  Customize My Order
                </summary>
                <div className="p-3 space-y-3 text-sm text-gray-700">
                  {/* Add-ons */}
                  {item.addOns && item.addOns.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Add-ons</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {item.addOns.map((addOn) => {
                          const isSelected = (selectedAddOns[item.name] || []).includes(addOn.name);
                          return (
                            <label
                              key={addOn.name}
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
                                  onChange={() => toggleAddOn(item.name, addOn.name)}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                                />
                                <span className="ml-2 text-gray-700">{addOn.name}</span>
                              </div>
                              <span className="text-green-600 font-medium">+R{addOn.price}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Fries Upsell */}
                  {item.friesUpsell && item.friesUpsell.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Add Fries</h4>
                      <div className="space-y-2">
                        {item.friesUpsell.map((fry) => {
                          const isSelected = (selectedFries[item.name] || []).includes(fry.name);
                          return (
                            <label
                              key={fry.name}
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
                                  onChange={() => toggleFries(item.name, fry.name)}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                                />
                                <span className="ml-2 text-gray-700">{fry.name}</span>
                              </div>
                              <span className="text-green-600 font-medium">
                                {fry.price > 0 ? `+R${fry.price}` : 'Free'}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Juice Upsell */}
                  {item.juiceUpsell && item.juiceUpsell.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Add a Fresh Juice</h4>
                      <div className="space-y-3">
                        {item.juiceUpsell.map((juiceGroup) => (
                          <div key={juiceGroup.size}>
                            <p className="font-medium text-gray-800 mb-1">{juiceGroup.size}</p>
                            <div className="space-y-2 ml-2">
                              {juiceGroup.options.map((option) => {
                                const identifier = `${option.name} - ${juiceGroup.size}`;
                                const isSelected = (selectedJuices[item.name] || []).includes(identifier);
                                return (
                                  <label
                                    key={identifier}
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
                                        onChange={() => toggleJuice(item.name, identifier)}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                                      />
                                      <span className="ml-2 text-gray-700">{option.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-green-600 font-medium">+R{option.price}</span>
                                      {isSelected && (
                                        <span className="text-green-600 font-bold">✓</span>
                                      )}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </details>

              {/* Special Instructions */}
              <textarea
                placeholder="Special instructions (optional)"
                className="mt-3 p-2 border border-gray-300 rounded-md w-full text-sm focus:ring-2 focus:ring-[#F4A261] bg-white"
                value={specialInstructions[item.name] || ""}
                onChange={(e) => handleInstructionsChange(item.name, e.target.value)}
                rows={2}
              />

              {/* Clear Selections */}
              <div className="mt-2 text-right">
                <button
                  onClick={() => handleClearSelections(item.name)}
                  className="text-sm text-red-300 hover:text-red-200 underline transition"
                >
                  Clear Selections
                </button>
              </div>

              {/* Reviews Section */}
              <div className="mt-4">
                <ReviewsSection itemId={item.id || item.name} />
              </div>

              {/* Action Buttons - FIXED */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!isReadyToAdd}
                  className={`flex-1 font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ${
                    isReadyToAdd
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isReadyToAdd ? `Add to Cart - R${currentTotal.toFixed(2)}` : "Select Base & Dressing"}
                </button>
                <button
                  onClick={() => {
                    if (!isReadyToAdd) {
                      alert("Please select base and dressing first.");
                      return;
                    }
                    router.push("/schedule-order");
                  }}
                  className="flex-1 bg-[#F4A261] hover:bg-[#e68e42] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Schedule Order
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}