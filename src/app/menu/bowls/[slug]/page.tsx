"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { bowls, bowlDressings, bowlBases, commonAddOns, friesUpsell, juiceGroup } from "@/data/bowlsData";

interface SelectedOptions {
  base: string;
  dressing: string;
  addOns: string[];
  fries: string | null;
  juice: { size: string; option: string } | null;
  specialInstructions: string;
}

export default function BowlDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const slug = params.slug as string;
  const bowlItem = bowls.find(item => item.slug === slug);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    base: "",
    dressing: "",
    addOns: [],
    fries: null,
    juice: null,
    specialInstructions: ""
  });
  const [quantity, setQuantity] = useState(1);

  if (!bowlItem) {
    return (
      <div className="min-h-screen bg-[#1E4259] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Bowl Not Found</h1>
          <button 
            onClick={() => router.push("/menu/bowls")}
            className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition"
          >
            Back to Bowls Menu
          </button>
        </div>
      </div>
    );
  }

  // Calculate total price
  const basePrice = bowlItem.price;
  const addOnsTotal = selectedOptions.addOns.reduce((sum, addOnId) => {
    const addOn = commonAddOns.find(a => a.id === addOnId);
    return sum + (addOn?.price || 0);
  }, 0);
  const friesTotal = selectedOptions.fries ? friesUpsell.find(f => f.id === selectedOptions.fries)?.price || 0 : 0;
  const juiceTotal = selectedOptions.juice ? juiceGroup.flatMap(g => g.options).find(j => j.id === selectedOptions.juice?.option)?.price || 0 : 0;
  
  const itemTotal = (basePrice + addOnsTotal + friesTotal + juiceTotal) * quantity;

  const handleAddToCart = () => {
    if (!selectedOptions.base || !selectedOptions.dressing) {
      alert("Please select a base and dressing before adding to cart");
      return;
    }

    const selectedBase = bowlBases.find(b => b.id === selectedOptions.base);
    const selectedDressing = bowlDressings.find(d => d.id === selectedOptions.dressing);
    const selectedFries = friesUpsell.find(f => f.id === selectedOptions.fries);
    const selectedJuice = selectedOptions.juice ? {
      size: selectedOptions.juice.size,
      option: juiceGroup.flatMap(g => g.options).find(j => j.id === selectedOptions.juice?.option)
    } : null;

    const cartItem = {
      id: `${bowlItem.id}-${Date.now()}`,
      name: bowlItem.name,
      description: bowlItem.description, // ✅ Added missing description
      price: bowlItem.price,
      quantity: quantity,
      total: itemTotal,
      base: selectedBase?.name || "",
      dressing: selectedDressing?.name || "",
      addOns: selectedOptions.addOns.map(id => commonAddOns.find(a => a.id === id)).filter(Boolean),
      fries: selectedFries,
      juice: selectedJuice,
      specialInstructions: selectedOptions.specialInstructions,
      image: bowlItem.image,
      category: "bowls"
    };

    addToCart(cartItem);
    router.push("/cart");
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  };

  const toggleFries = (friesId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      fries: prev.fries === friesId ? null : friesId
    }));
  };

  const toggleJuice = (size: string, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      juice: prev.juice?.option === optionId ? null : { size, option: optionId }
    }));
  };

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      {/* Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/menu/bowls")}
            className="flex items-center text-white hover:text-[#F4A261] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Bowls
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden">
            <Image
              src={bowlItem.image}
              alt={bowlItem.name}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#6C7B58] to-[#8A9B6E] flex items-center justify-center">
              <span className="text-white/80 text-lg">Bowl Image</span>
            </div>
          </div>

          {/* Details & Customization */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-[#F4A261] mb-2">
                {bowlItem.name}
              </h1>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {bowlItem.description}
              </p>
              <div className="text-2xl font-bold text-green-300">
                R{bowlItem.price.toFixed(2)}
              </div>
            </div>

            {/* Quantity Selector */}
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

            {/* Base Selection - REQUIRED */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#F4A261]">
                Choose Your Base *
              </h3>
              <div className="space-y-2">
                {bowlBases.map((base) => (
                  <label key={base.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="base"
                      checked={selectedOptions.base === base.id}
                      onChange={() => setSelectedOptions(prev => ({ ...prev, base: base.id }))}
                      className="w-4 h-4 text-[#F4A261]"
                      required
                    />
                    <span className="flex-1 capitalize">{base.name}</span>
                    <span className="text-green-300 text-sm">Included</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dressing Selection - REQUIRED */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#F4A261]">
                Choose Your Dressing *
              </h3>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {bowlDressings.map((dressing) => (
                  <label key={dressing.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dressing"
                      checked={selectedOptions.dressing === dressing.id}
                      onChange={() => setSelectedOptions(prev => ({ ...prev, dressing: dressing.id }))}
                      className="w-4 h-4 text-[#F4A261]"
                      required
                    />
                    <span className="flex-1 capitalize text-sm">{dressing.name}</span>
                    <span className="text-green-300 text-sm">Included</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#F4A261]">Extra Add-ons</h3>
              <div className="space-y-2">
                {commonAddOns.map((addOn) => (
                  <label key={addOn.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOptions.addOns.includes(addOn.id)}
                      onChange={() => toggleAddOn(addOn.id)}
                      className="w-4 h-4 text-[#F4A261] rounded"
                    />
                    <span className="flex-1 capitalize">{addOn.name}</span>
                    <span className="text-green-300">+R{addOn.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fries Upsell */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#F4A261]">Add Some Fries</h3>
              <div className="space-y-2">
                {friesUpsell.map((fries) => (
                  <label key={fries.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="fries"
                      checked={selectedOptions.fries === fries.id}
                      onChange={() => toggleFries(fries.id)}
                      className="w-4 h-4 text-[#F4A261]"
                    />
                    <span className="flex-1 capitalize">{fries.name}</span>
                    <span className="text-green-300">+R{fries.price.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Juice Upsell */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#F4A261]">Fresh Juice</h3>
              <div className="space-y-3">
                {juiceGroup.map((group) => (
                  <div key={group.size} className="space-y-2">
                    <h4 className="font-medium text-gray-300 text-sm">{group.size}</h4>
                    {group.options.map((juice) => (
                      <label key={juice.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="juice"
                          checked={selectedOptions.juice?.option === juice.id}
                          onChange={() => toggleJuice(group.size, juice.id)}
                          className="w-4 h-4 text-[#F4A261]"
                        />
                        <span className="flex-1 capitalize text-sm">{juice.name}</span>
                        <span className="text-green-300 text-sm">+R{juice.price.toFixed(2)}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Special Instructions
              </label>
              <textarea
                value={selectedOptions.specialInstructions}
                onChange={(e) => setSelectedOptions(prev => ({ ...prev, specialInstructions: e.target.value }))}
                placeholder="Any special requests, allergies, or dietary requirements..."
                className="w-full h-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#F4A261] resize-none"
              />
            </div>

            {/* Total and Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold text-[#F4A261]">
                  R{itemTotal.toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!selectedOptions.base || !selectedOptions.dressing}
                className="w-full bg-[#F4A261] hover:bg-[#e68e42] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition text-lg"
              >
                {!selectedOptions.base || !selectedOptions.dressing 
                  ? "Select Base and Dressing" 
                  : `Add to Cart - R${itemTotal.toFixed(2)}`
                }
              </button>
              
              {(!selectedOptions.base || !selectedOptions.dressing) && (
                <p className="text-yellow-400 text-sm text-center">
                  * Please select a base and dressing to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
