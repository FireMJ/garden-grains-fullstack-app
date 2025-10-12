"use client";

import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { breakfasts } from "@/data/breakfastBowlsData";
import FloatingCartButton from "@/components/FloatingCartButton";

export default function BreakfastBowlsPage() {
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [selectedFries, setSelectedFries] = useState<Record<string, string[]>>({});
  const [selectedJuices, setSelectedJuices] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  // Toggle helpers
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

  const toggleFries = (itemName: string, fryName: string) => {
    setSelectedFries((prev) => {
      const current = prev[itemName] || [];
      return {
        ...prev,
        [itemName]: current.includes(fryName)
          ? current.filter((f) => f !== fryName)
          : [...current, fryName],
      };
    });
  };

  const toggleJuice = (itemName: string, juiceIdentifier: string) => {
    setSelectedJuices((prev) => {
      const current = prev[itemName] || [];
      return {
        ...prev,
        [itemName]: current.includes(juiceIdentifier)
          ? current.filter((j) => j !== juiceIdentifier)
          : [...current, juiceIdentifier],
      };
    });
  };

  const handleInstructionsChange = (itemName: string, text: string) => {
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: text }));
  };

  const calculateItemTotal = (item: any) => {
    const addOnsTotal =
      item.addOns?.filter((a: any) => (selectedAddOns[item.name] || []).includes(a.name))
        .reduce((sum: number, a: any) => sum + a.price, 0) ?? 0;
    const friesTotal =
      item.friesUpsell?.filter((f: any) => (selectedFries[item.name] || []).includes(f.name))
        .reduce((sum: number, f: any) => sum + f.price, 0) ?? 0;
    const juicesTotal =
      item.juiceUpsell
        ?.flatMap((group: any) =>
          group.options
            .filter((opt: any) =>
              (selectedJuices[item.name] || []).includes(`${opt.name} - ${group.size}`)
            )
            .map((opt: any) => opt.price)
        )
        .reduce((sum: number, p: number) => sum + p, 0) ?? 0;

    return item.price + addOnsTotal + friesTotal + juicesTotal;
  };

  const handleAddToCart = (item: any) => {
    const addOns =
      item.addOns?.filter((a: any) => (selectedAddOns[item.name] || []).includes(a.name)) || [];
    const fries =
      item.friesUpsell?.filter((f: any) => (selectedFries[item.name] || []).includes(f.name)) ||
      [];
    const juices =
      item.juiceUpsell
        ?.flatMap((group: any) =>
          group.options
            .filter((opt: any) =>
              (selectedJuices[item.name] || []).includes(`${opt.name} - ${group.size}`)
            )
            .map((opt: any) => ({ ...opt, size: group.size }))
        ) || [];

    addToCart(
      {
        ...item,
        addOns,
        fries,
        juices,
        specialInstructions: specialInstructions[item.name] || "",
      },
      1
    );

    setAddedToCart(item.name);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const handleClearSelections = (itemName: string) => {
    setSelectedAddOns((prev) => ({ ...prev, [itemName]: [] }));
    setSelectedFries((prev) => ({ ...prev, [itemName]: [] }));
    setSelectedJuices((prev) => ({ ...prev, [itemName]: [] }));
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: "" }));
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
    <main className="px-4 py-8 text-gray-900 bg-[#1E4259]">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-green-200 text-green-900 hover:bg-green-300 transition"
        >
          ← Go Back
        </button>
        <h1 className="text-3xl font-bold text-green-900">Breakfast Bowls</h1>
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

      {/* Breakfast Bowl Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {breakfasts.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl shadow-lg bg-[#6c8665] p-4 flex flex-col justify-between"
          >
            <MenuItemCard {...item} />
            <p className="mt-2 text-sm text-gray-700">{item.description}</p>

            {/* Real-time Price */}
            <p className="mt-2 font-semibold text-green-900">
              Total: R {calculateItemTotal(item).toFixed(2)}
            </p>

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
              <div className="p-3 space-y-3 text-sm text-gray-700">
                {/* Add-ons */}
                {item.addOns?.length > 0 && (
                  <div className="max-h-28 overflow-y-auto">
                    <h4 className="font-semibold mb-1">Add-ons</h4>
                    {item.addOns.map((addOn: any) => (
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
                    <h4 className="font-semibold mb-1">Fries</h4>
                    {item.friesUpsell.map((fry: any) => (
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

                {/* Juice Upsell */}
                {item.juiceUpsell?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">Add a Fresh Juice</h4>
                    {item.juiceUpsell.map((juice: any) => (
                      <div key={juice.size} className="mb-2">
                        <p className="font-medium">{juice.size}</p>
                        {juice.options.map((opt: any) => {
                          const identifier = `${opt.name} - ${juice.size}`;
                          const isSelected = (selectedJuices[item.name] || []).includes(identifier);
                          return (
                            <label
                              key={identifier}
                              className={`flex items-center justify-between gap-2 ml-2 p-2 rounded-lg border cursor-pointer transition
                                ${isSelected ? "bg-green-50 border-green-500" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleJuice(item.name, identifier)}
                                  className="h-4 w-4 text-green-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">{opt.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-green-600">+R{opt.price}</span>
                                {isSelected && <span className="text-green-800 font-semibold">✓</span>}
                              </div>
                            </label>
                          );
                        })}
                      </div>
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

            {/* Bottom Buttons */}
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

            {/* Added to Cart Toast */}
            {addedToCart === item.name && (
              <p className="mt-2 text-green-700 font-semibold text-center">
                {item.name} added to cart!
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <FloatingCartButton />
    </main>
  );
}
