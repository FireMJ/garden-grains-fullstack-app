"use client";

import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { smoothies } from "@/data/smoothiesData";
import { useRouter } from "next/navigation";
import FloatingCartButton from "@/components/FloatingCartButton";

export default function SmoothiesPage() {
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [selectedFries, setSelectedFries] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});

  // Toggle helpers
  const toggleAddOn = (itemName: string, addOnName: string) => {
    setSelectedAddOns((prev) => {
      const current = prev[itemName] || [];
      return current.includes(addOnName)
        ? { ...prev, [itemName]: current.filter((a) => a !== addOnName) }
        : { ...prev, [itemName]: [...current, addOnName] };
    });
  };

  const toggleFries = (itemName: string, fryName: string) => {
    setSelectedFries((prev) => {
      const current = prev[itemName] || [];
      return current.includes(fryName)
        ? { ...prev, [itemName]: current.filter((f) => f !== fryName) }
        : { ...prev, [itemName]: [...current, fryName] };
    });
  };

  const handleSizeChange = (itemName: string, size: string) => {
    setSelectedSize((prev) => ({ ...prev, [itemName]: size }));
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

    const addOns =
      item.addOns?.filter((a: any) => (selectedAddOns[item.name] || []).includes(a.name)) || [];
    const fries =
      item.friesUpsell?.filter((f: any) => (selectedFries[item.name] || []).includes(f.name)) || [];

    addToCart(
      {
        ...item,
        size,
        price: item.prices[size],
        addOns,
        fries,
        specialInstructions: specialInstructions[item.name] || "",
      },
      1
    );

    alert(`${item.name} added to cart!`);
  };

  const handleClearSelections = (itemName: string) => {
    setSelectedAddOns((prev) => ({ ...prev, [itemName]: [] }));
    setSelectedFries((prev) => ({ ...prev, [itemName]: [] }));
    setSelectedSize((prev) => ({ ...prev, [itemName]: "" }));
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: "" }));
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity || 1 +
      (item.addOns?.reduce((a, o) => a + o.price, 0) ?? 0) +
      (item.fries?.reduce((a, f) => a + f.price, 0) ?? 0),
    0
  );

  return (
    <main className="px-4 py-8 text-gray-900 bg-[#1E4259]">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-green-200 text-green-900 hover:bg-green-300 transition"
        >
          ← Go Back
        </button>
        <h1 className="text-3xl font-bold text-green-900">Smoothies</h1>
        <button
          onClick={() => router.push("/cart")}
          className="px-4 py-2 rounded-lg bg-green-200 text-green-900 hover:bg-green-300 transition"
        >
          Go to Cart →
        </button>
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="sticky top-0 z-10 bg-white p-4 rounded-lg shadow-md mb-6">
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

      {/* Smoothie Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {smoothies.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl shadow-lg bg-[#6c8665] p-4 flex flex-col justify-between"
          >
            <MenuItemCard {...item} />

            <p className="mt-2 text-sm text-gray-700">{item.description}</p>

            {/* Special Instructions */}
            <textarea
              placeholder="Special instructions (optional)"
              className="mt-3 p-2 border border-gray-300 rounded-md w-full text-sm focus:ring-2 focus:ring-green-500"
              value={specialInstructions[item.name] || ""}
              onChange={(e) => handleInstructionsChange(item.name, e.target.value)}
            />

            {/* Customize My Order */}
            <details className="mt-4 bg-white rounded-md border border-gray-200">
              <summary className="cursor-pointer px-3 py-2 font-semibold text-green-900">
                Customize My Order
              </summary>
              <div className="p-3 space-y-3 text-sm text-gray-700 max-h-36 overflow-y-auto">
                {/* Cup Size */}
                <div className="mb-2">
                  <h4 className="font-semibold mb-1">Cup Size <span className="text-red-500">*</span></h4>
                  <select
                    value={selectedSize[item.name] || ""}
                    onChange={(e) => handleSizeChange(item.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- select size --</option>
                    {Object.entries(item.prices).map(([size, price]) => (
                      <option key={size} value={size}>
                        {size} (+R{price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add-ons */}
                {item.addOns?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">Add-ons</h4>
                    {item.addOns.map((addOn) => (
                      <label key={addOn.name} className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={(selectedAddOns[item.name] || []).includes(addOn.name)}
                          onChange={() => toggleAddOn(item.name, addOn.name)}
                          className="h-4 w-4 text-green-600"
                        />
                        {addOn.name} (+R{addOn.price})
                      </label>
                    ))}
                  </div>
                )}

                {/* Fries */}
                {item.friesUpsell?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">Add Fries</h4>
                    {item.friesUpsell.map((fry) => (
                      <label
                        key={fry.name}
                        className={`flex items-center justify-between gap-2 p-2 rounded-lg border cursor-pointer transition ${
                          (selectedFries[item.name] || []).includes(fry.name)
                            ? "bg-green-50 border-green-500"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={(selectedFries[item.name] || []).includes(fry.name)}
                            onChange={() => toggleFries(item.name, fry.name)}
                            className="h-4 w-4 text-green-600 mr-2"
                          />
                          {fry.name}
                        </div>
                        <span>+R{fry.price}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </details>

            {/* Clear Selections */}
            <div className="mt-2 text-right">
              <button
                onClick={() => handleClearSelections(item.name)}
                className="text-sm text-red-500 hover:text-red-700 underline"
              >
                Clear Selections
              </button>
            </div>

            {/* Bottom buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleAddToCart(item)}
                className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => router.push("/schedule-order")}
                className="flex-1 bg-yellow-100 text-yellow-900 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-200 transition"
              >
                Schedule Order
              </button>
            </div>
          </div>
        ))}
      </div>

      <FloatingCartButton />
    </main>
  );
}
