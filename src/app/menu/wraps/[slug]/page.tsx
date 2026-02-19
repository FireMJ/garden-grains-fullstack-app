"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { wraps } from "@/app/menu/data";

export default function WrapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const slug = params.slug as string;
  const wrapItem = wraps.find(item => item.slug === slug);

  const [selectedAddOns, setSelectedAddOns] = useState<any[]>([]);
  const [selectedFries, setSelectedFries] = useState<any | null>(null);
  const [selectedJuice, setSelectedJuice] = useState<{ size: string; option: any } | null>(null);
  const [selectedDips, setSelectedDips] = useState<any[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!wrapItem) {
    return (
      <div className="min-h-screen bg-[#1E4259] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Wrap Not Found</h1>
          <button 
            onClick={() => router.push("/menu/wraps")}
            className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition"
          >
            Back to Wraps Menu
          </button>
        </div>
      </div>
    );
  }

  const friesOptions = wrapItem.friesUpsell.filter(item => item.price > 0);
  const dipOptions = wrapItem.friesUpsell.filter(item => item.price === 0 && item.optional);

  const addOnsTotal = selectedAddOns.reduce((sum: number, addon) => sum + addon.price, 0);
  const friesTotal = selectedFries ? selectedFries.price : 0;
  const juiceTotal = selectedJuice ? selectedJuice.option.price : 0;
  const itemTotal = (wrapItem.price + addOnsTotal + friesTotal + juiceTotal) * quantity;

  const handleAddToCart = () => {
    const cartItem = {
      id: `${wrapItem.id}-${Date.now()}`,
      name: wrapItem.name,
      description: wrapItem.description,
      price: wrapItem.price,
      quantity: quantity,
      total: itemTotal,
      addOns: selectedAddOns,
      fries: selectedFries || undefined,
      juice: selectedJuice,
      dips: selectedDips,
      specialInstructions: specialInstructions,
      image: wrapItem.image,
      category: "wraps"
    };

    addToCart(cartItem);
    router.push("/cart");
  };

  const toggleAddOn = (addOn: any) => {
    setSelectedAddOns((prev: any[]) => 
      prev.find(a => a.id === addOn.id) 
        ? prev.filter(a => a.id !== addOn.id)
        : [...prev, addOn]
    );
  };

  const toggleFries = (fries: any) => {
    setSelectedFries((prev: any | null) => 
      prev?.id === fries.id ? null : fries
    );
  };

  const toggleDip = (dip: any) => {
    setSelectedDips((prev: any[]) => 
      prev.find(d => d.id === dip.id) 
        ? prev.filter(d => d.id !== dip.id)
        : [...prev, dip]
    );
  };

  const toggleJuice = (juiceGroup: any, juiceOption: any) => {
    setSelectedJuice((prev: { size: string; option: any } | null) => 
      prev?.option.id === juiceOption.id ? null : {
        size: juiceGroup.size,
        option: juiceOption
      }
    );
  };

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/menu/wraps")}
            className="flex items-center text-white hover:text-[#F4A261] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Wraps
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
            <Image
              src={wrapItem.image}
              alt={wrapItem.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#F4A261] mb-2">
                {wrapItem.name}
              </h1>
              <p className="text-gray-300 mb-4">
                {wrapItem.description}
              </p>
              <div className="text-2xl font-bold text-green-300">
                R{wrapItem.price.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                >
                  -
                </button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                >
                  +
                </button>
              </div>
            </div>

            {wrapItem.addOns.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add-ons</h3>
                <div className="space-y-2">
                  {wrapItem.addOns.map((addOn) => (
                    <label key={addOn.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.some((a: any) => a.id === addOn.id)}
                        onChange={() => toggleAddOn(addOn)}
                        className="w-4 h-4 text-[#F4A261] rounded"
                      />
                      <span className="flex-1">{addOn.name}</span>
                      <span className="text-green-300">+R{addOn.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {friesOptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add Fries</h3>
                <div className="space-y-2">
                  {friesOptions.map((fries) => (
                    <label key={fries.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fries"
                        checked={selectedFries?.id === fries.id}
                        onChange={() => toggleFries(fries)}
                        className="w-4 h-4 text-[#F4A261]"
                      />
                      <span className="flex-1">{fries.name}</span>
                      <span className="text-green-300">+R{fries.price.toFixed(2)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {dipOptions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Dips</h3>
                <div className="space-y-2">
                  {dipOptions.map((dip) => (
                    <label key={dip.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDips.some((d: any) => d.id === dip.id)}
                        onChange={() => toggleDip(dip)}
                        className="w-4 h-4 text-[#F4A261] rounded"
                      />
                      <span className="flex-1">{dip.name}</span>
                      <span className="text-green-300">Free</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {wrapItem.juiceUpsell.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#F4A261]">Add a Fresh Juice</h3>
                <div className="space-y-2">
                  {wrapItem.juiceUpsell.map((juiceGroup) => (
                    <div key={juiceGroup.size} className="space-y-2">
                      <h4 className="font-medium text-gray-300">{juiceGroup.size}</h4>
                      {juiceGroup.options.map((juice) => (
                        <label key={juice.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="juice"
                            checked={selectedJuice?.option.id === juice.id}
                            onChange={() => toggleJuice(juiceGroup, juice)}
                            className="w-4 h-4 text-[#F4A261]"
                          />
                          <span className="flex-1">{juice.name}</span>
                          <span className="text-green-300">+R{juice.price.toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Special Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests or dietary requirements..."
                className="w-full h-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F4A261] resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold text-[#F4A261]">
                  R{itemTotal.toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#F4A261] hover:bg-[#e68e42] text-white font-bold py-4 px-6 rounded-lg transition text-lg"
              >
                Add to Cart - R{itemTotal.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}