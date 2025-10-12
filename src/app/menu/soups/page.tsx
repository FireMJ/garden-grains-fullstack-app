"use client";
import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { soups } from "@/data/soupsData";
import { useRouter } from "next/navigation";

export default function SoupsPage() {
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [selectedJuices, setSelectedJuices] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});

  const toggleAddOn = (soupName: string, addOnName: string) => {
    setSelectedAddOns((prev) => {
      const current = prev[soupName] || [];
      return {
        ...prev,
        [soupName]: current.includes(addOnName)
          ? current.filter((a) => a !== addOnName)
          : [...current, addOnName],
      };
    });
  };

  const toggleJuice = (soupName: string, juiceIdentifier: string) => {
    setSelectedJuices((prev) => {
      const current = prev[soupName] || [];
      return {
        ...prev,
        [soupName]: current.includes(juiceIdentifier)
          ? current.filter((j) => j !== juiceIdentifier)
          : [...current, juiceIdentifier],
      };
    });
  };

  const handleInstructionsChange = (soupName: string, text: string) => {
    setSpecialInstructions((prev) => ({ ...prev, [soupName]: text }));
  };

  const handleAddToCart = (item: any) => {
    const addOns =
      item.addOns?.filter((a: any) => (selectedAddOns[item.name] || []).includes(a.name)) || [];

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
        juices,
        specialInstructions: specialInstructions[item.name] || "",
      },
      1
    );

    alert(`${item.name} added to cart!`);
  };

  const handleClearSelections = (itemName: string) => {
    setSelectedAddOns((prev) => ({ ...prev, [itemName]: [] }));
    setSelectedJuices((prev) => ({ ...prev, [itemName]: [] }));
    setSpecialInstructions((prev) => ({ ...prev, [itemName]: "" }));
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity || 1 +
      (item.addOns?.reduce((a, o) => a + o.price, 0) ?? 0) +
      (item.juices?.reduce((a, j) => a + j.price, 0) ?? 0),
    0
  );

  return (
    <main className="px-4 py-8 text-gray-900 bg-[#1E4259]">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-blue-200 text-blue-900 hover:bg-blue-300 transition"
        >
          ← Go Back
        </button>
        <h1 className="text-3xl font-bold text-green-900">Hearty Soups</h1>
        <button
          onClick={() => router.push("/cart")}
          className="px-4 py-2 rounded-lg bg-blue-200 text-blue-900 hover:bg-blue-300 transition"
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
              <p className="text-blue-900 font-bold">Total: R {total.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/cart")}
                className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 transition"
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

      {/* Soup Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {soups.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl shadow-lg bg-[#6c8665] p-4 flex flex-col justify-between"
          >
            <MenuItemCard {...item} />
            <p className="mt-2 text-sm text-gray-700">{item.description}</p>

            {/* Special Instructions */}
            <textarea
              placeholder="Special instructions (optional)"
              className="mt-3 p-2 border border-gray-300 rounded-md w-full text-sm focus:ring-2 focus:ring-blue-500"
              value={specialInstructions[item.name] || ""}
              onChange={(e) => handleInstructionsChange(item.name, e.target.value)}
            />

            {/* Customize My Order */}
            <details className="mt-4 bg-white rounded-md border border-gray-200">
              <summary className="cursor-pointer px-3 py-2 font-semibold text-blue-900">
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
                          className="h-4 w-4 text-blue-600"
                        />
                        {addOn.name} (+R{addOn.price})
                      </label>
                    ))}
                  </div>
                )}

                {/* Juice Upsell */}
                {item.juiceUpsell && (
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
                                ${isSelected ? "bg-blue-50 border-blue-500" : "bg-white border-gray-300 hover:bg-gray-50"}`}
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleJuice(item.name, identifier)}
                                  className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">{opt.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm text-blue-600">+R{opt.price}</span>
                                {isSelected && <span className="text-blue-800 font-semibold">✓</span>}
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

            {/* Bottom buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleAddToCart(item)}
                className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
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
    </main>
  );
}
