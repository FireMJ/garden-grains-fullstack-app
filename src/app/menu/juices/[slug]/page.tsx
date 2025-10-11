"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { juices } from "@/data/juicesData";
import ReviewsSection from "@/components/ReviewsSection";

export default function JuiceDetailPage() {
  const { slug } = useParams(); // slug from URL
  const router = useRouter();
  const { addToCart, cart } = useCart();

  const juice = juices.find((j) => j.id === slug);
  if (!juice) return <p className="text-center mt-8">Juice not found!</p>;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const toggleAddOn = (addOnName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnName) ? prev.filter((a) => a !== addOnName) : [...prev, addOnName]
    );
  };

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select a size before adding to cart.");

    const price = juice.prices[selectedSize];
    const addOns = juice.addOns?.filter((a) => selectedAddOns.includes(a.name)) || [];

    addToCart(
      {
        ...juice,
        selectedSize,
        price,
        addOns,
        specialInstructions,
      },
      1
    );
    alert(`${juice.name} (${selectedSize}) added to cart!`);
  };

  const total = () => {
    const sizePrice = selectedSize ? juice.prices[selectedSize] : 0;
    const addOnsTotal = selectedAddOns
      .map((a) => juice.addOns?.find((ao) => ao.name === a)?.price || 0)
      .reduce((a, b) => a + b, 0);
    return sizePrice + addOnsTotal;
  };

  return (
    <main className="px-4 py-8 bg-[#1E4259] min-h-screen text-gray-900 max-w-3xl mx-auto">
      {/* Juice Info */}
      <div className="flex flex-col md:flex-row gap-6">
        {juice.image && (
          <img
            src={juice.image}
            alt={juice.name}
            className="rounded-2xl w-full md:w-1/2 h-auto object-cover shadow-lg"
          />
        )}
        <div className="flex-1 flex flex-col">
          <h1 className="text-3xl font-bold text-green-600">{juice.name}</h1>
          <p className="mt-2 text-gray-100">{juice.description}</p>

          {/* Size Selector */}
          <div className="mt-4">
            <label className="block font-semibold text-white mb-2">
              Choose Your Size <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(juice.prices).map(([size, price]) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`p-2 border rounded-lg text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {size} <div className="text-xs mt-1">R{price}</div>
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-red-500 text-xs mt-1">Please select a size</p>
            )}
          </div>

          {/* Add-ons */}
          {juice.addOns && juice.addOns.length > 0 && (
            <div className="mt-4 bg-white p-3 rounded-md">
              <h4 className="font-semibold mb-2">Add-ons</h4>
              <div className="space-y-2">
                {juice.addOns.map((addOn) => {
                  const isSelected = selectedAddOns.includes(addOn.name);
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
                          onChange={() => toggleAddOn(addOn.name)}
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

          {/* Special Instructions */}
          <textarea
            placeholder="Special instructions (optional)"
            className="mt-3 p-2 border border-gray-300 rounded-md w-full text-sm focus:ring-2 focus:ring-[#F4A261] bg-white"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            rows={2}
          />

          {/* Total & Buttons */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-green-600">Total: R{total()}</span>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => router.push("/schedule-order")}
              className="flex-1 bg-[#F4A261] hover:bg-[#e68e42] text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Schedule Order
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-6">
        <ReviewsSection itemId={juice.id} />
      </div>
    </main>
  );
}
