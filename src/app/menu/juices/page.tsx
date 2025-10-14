"use client";

import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { juices } from "@/data/juicesData";
import ReviewsSection from "@/components/ReviewsSection";

export default function JuicesPage() {
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  const toggleAddOn = (itemName: string, addOnName: string) => {
    setSelectedAddOns((prev) => {
      const current = prev[itemName] || [];
      return {
        ...prev,
        [itemName]: current.includes(addOnName)
          ? current.filter((a) => a !== addOnName)
          : [...current, addOnName],
      };
    });
  };

  const handleInstructionsChange = (itemName: string, text: string) => {
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: text }));
  };

  const handleSizeChange = (itemName: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemName]: size }));
  };

  const handleAddToCart = (item: any) => {
    const selectedSize = selectedSizes[item.name];
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const price = item.prices[selectedSize];
    const addOns =
      item.addOns?.filter((a: any) => (selectedAddOns[item.name] || []).includes(a.name)) || [];

    addToCart(
      {
        ...item,
        selectedSize,
        price,
        addOns,
        specialInstructions: specialInstructions[item.name] || "",
      },
      1
    );

    alert(`${item.name} (${selectedSize}) added to cart!`);
  };

  const handleClearSelections = (itemName: string) => {
    setSelectedAddOns((prev) => ({ ...prev, [itemName]: [] }));
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: "" }));
    setSelectedSizes((prev) => ({ ...prev, [itemName]: "" }));
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity +
      (item.addOns?.reduce((a, o) => a + o.price, 0) ?? 0),
    0
  );

  return (
    <main className="px-4 py-8 text-gray-900 bg-[#1E4259] min-h-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-[#F4A261] text-white hover:bg-[#e68e42] transition"
        >
          ← Go Back
        </button>
        <h1 className="text-3xl font-bold text-green-600">Fresh Juices</h1>
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
                Items in cart: {cart.reduce((sum, item) => sum + item.quantity, 0)}
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

      {/* Juices Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {juices.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl shadow-lg bg-[#6c8665] p-4 flex flex-col justify-between border border-gray-100"
          >
            <MenuItemCard {...item} />

            {/* Size Selector */}
            <div className="mt-4">
              <label className="block font-semibold text-white mb-2">
                Choose Your Size <span className="text-red-400">*</span>
              </label>
              <select
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#F4A261]"
                value={selectedSizes[item.name] || ""}
                onChange={(e) => handleSizeChange(item.name, e.target.value)}
              >
                <option value="">Select size</option>
                {Object.entries(item.prices).map(([size, price]) => (
                  <option key={size} value={size}>
                    {size} — R{price}
                  </option>
                ))}
              </select>
            </div>

            {/* Customize My Order */}
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
                className="text-sm text-red-500 hover:text-red-700 underline transition"
              >
                Clear Selections
              </button>
            </div>

            {/* Reviews Section */}
            <div className="mt-4">
              <ReviewsSection itemId={item.id || item.name} />
            </div>

            {/* Bottom Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleAddToCart(item)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={() => router.push("/schedule-order")}
                className="flex-1 bg-[#F4A261] hover:bg-[#e68e42] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
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
