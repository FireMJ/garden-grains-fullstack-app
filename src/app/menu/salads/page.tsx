"use client";
import React, { useState } from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { salads } from "@/data/saladsData";
import { dressings } from "@/data/dressings";

export default function SaladsPage() {
  const { addToCart, cart } = useCart();
  const router = useRouter();

  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, string[]>>({});
  const [selectedDressings, setSelectedDressings] = useState<Record<string, string>>({});
  const [specialInstructions, setSpecialInstructions] = useState<Record<string, string>>({});

  const toggleAddOn = (saladName: string, addOnName: string) => {
    setSelectedAddOns((prev) => {
      const current = prev[saladName] || [];
      return {
        ...prev,
        [saladName]: current.includes(addOnName)
          ? current.filter((a) => a !== addOnName)
          : [...current, addOnName],
      };
    });
  };

  const handleDressingChange = (saladName: string, dressing: string) => {
    setSelectedDressings((prev) => ({ ...prev, [saladName]: dressing }));
  };

  const handleInstructionsChange = (saladName: string, text: string) => {
    setSpecialInstructions((prev) => ({ ...prev, [saladName]: text }));
  };

  const handleAddToCart = (item: any) => {
    const dressing = selectedDressings[item.name] || "";
    if (!dressing) {
      alert("Please select a salad dressing before adding to order.");
      return;
    }

    const addOns = item.addOns?.filter((a: any) =>
      (selectedAddOns[item.name] || []).includes(a.name)
    ) || [];

    addToCart({
      ...item,
      addOns,
      dressing,
      specialInstructions: specialInstructions[item.name] || "",
    }, 1);
    
    alert(`${item.name} added to cart!`);
  };

  // Calculate total
  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity +
      (item.addOns?.reduce((a, o) => a + o.price, 0) ?? 0),
    0
  );

  return (
    <main className="px-4 py-8 text-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-900">Fresh Salads</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-green-200 text-green-900 hover:bg-dark azure-300 transition"
        >
          ← Go Back
        </button>
      </div>

      {/* Cart Summary Bar (sticky at the top if cart has items) */}
      {cart.length > 0 && (
        <div className="sticky top-0 z-10 bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Items in cart: {cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salads.map((item) => (
          <div key={item.name} className="rounded-2xl shadow-lg bg-white p-4 flex flex-col justify-between">
            <MenuItemCard {...item} />
            <p className="mt-2 text-sm text-gray-700">{item.description}</p>

            {item.addOns?.length > 0 && (
              <div className="mt-3 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                <h4 className="font-semibold text-green-900 mb-2">Add-ons</h4>
                {item.addOns.map((addOn: any) => (
                  <label key={addOn.name} className="flex items-center gap-2 mb-2 text-sm text-gray-700">
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

            <div className="mt-4">
              <h4 className="font-semibold text-green-900 mb-2">
                Salad Dressing <span className="text-red-500">*</span>
              </h4>
              <select
                value={selectedDressings[item.name] || ""}
                onChange={(e) => handleDressingChange(item.name, e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                required
              >
                <option value="">-- no dressing selected --</option>
                {dressings.map((d, i) => (
                  <option key={i} value={d.name}>
                    {d.name} (+R{d.price})
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Special instructions (optional)"
              className="mt-3 p-2 border border-gray-300 rounded-md w-full text-sm focus:ring-2 focus:ring-green-500"
              value={specialInstructions[item.name] || ""}
              onChange={(e) => handleInstructionsChange(item.name, e.target.value)}
            />

            {/* Add to Cart button */}
            <button
              onClick={() => handleAddToCart(item)}
              className="mt-4 w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}