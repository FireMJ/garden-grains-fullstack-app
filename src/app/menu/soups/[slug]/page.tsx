"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaMinus, FaTruck, FaCocktail } from "react-icons/fa";
import { soups, soupAddOns, friesUpsellOptions, juiceUpsellOptions } from "@/data/soupsData";

interface SoupItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: string[];
  addOns?: any[];
  friesUpsell?: any[];
  juiceUpsell?: any[];
}

interface UpsellItem {
  id: string;
  name: string;
  price: number;
  size?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function SoupDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [soupItem, setSoupItem] = useState<SoupItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Upsell states
  const [selectedFries, setSelectedFries] = useState<UpsellItem | null>(null);
  const [selectedJuice, setSelectedJuice] = useState<UpsellItem | null>(null);
  const [selectedJuiceSize, setSelectedJuiceSize] = useState<string>("250ml");
  const [showUpsells, setShowUpsells] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Unwrap params
  useEffect(() => {
    const unwrapParams = async () => {
      const unwrapped = await params;
      setSlug(unwrapped.slug);
    };
    unwrapParams();
  }, [params]);

  // Load soup data
  useEffect(() => {
    if (!slug) return;

    const item = soups?.find((s: any) => s.slug === slug);
    if (item) {
      setSoupItem(item);
    }
  }, [slug]);

  const handleAddOnToggle = (addOn: { name: string; price: number }) => {
    setSelectedAddOns(prev => {
      const existing = prev.find(a => a.name === addOn.name);
      if (existing) {
        return prev.filter(a => a.name !== addOn.name);
      } else {
        return [...prev, { ...addOn, quantity: 1 }];
      }
    });
  };

  const updateAddOnQuantity = (addOnName: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedAddOns(prev => prev.filter(a => a.name !== addOnName));
    } else {
      setSelectedAddOns(prev =>
        prev.map(a =>
          a.name === addOnName ? { ...a, quantity: newQuantity } : a
        )
      );
    }
  };

  const calculateTotal = () => {
    let total = soupItem?.price || 0;
    
    // Add add-ons total
    selectedAddOns.forEach(addOn => {
      total += addOn.price * addOn.quantity;
    });
    
    // Add fries if selected
    if (selectedFries) {
      total += selectedFries.price;
    }
    
    // Add juice if selected
    if (selectedJuice) {
      total += selectedJuice.price;
    }
    
    // Multiply by quantity
    total *= quantity;
    
    return total;
  };

  const handleAddToCart = () => {
    if (!soupItem) return;
    
    addToCart({
      id: `${soupItem.id}-${Date.now()}`,
      name: soupItem.name,
      price: soupItem.price,
      quantity: quantity,
      image: soupItem.image,
      addOns: selectedAddOns,
      friesUpsell: selectedFries,
      juiceUpsell: selectedJuice,
      specialInstructions: specialInstructions || undefined,
    });
    
    alert(`Added ${quantity} x ${soupItem.name} to cart`);
    router.push('/cart');
  };

  if (!mounted || !soupItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/menu/soups" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition">
          <FaArrowLeft /> Back to Soups
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="relative h-64 md:h-full min-h-[300px] bg-gray-100">
              <Image
                src={soupItem.image}
                alt={soupItem.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Details Section */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{soupItem.name}</h1>
              <p className="text-gray-600 mb-4 leading-relaxed">{soupItem.description}</p>
              <p className="text-2xl font-bold text-green-600 mb-6">R{soupItem.price}</p>

              {/* Add-ons Section */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Add-ons</h3>
                <div className="space-y-2">
                  {soupAddOns.map((addOn) => {
                    const selected = selectedAddOns.find(a => a.name === addOn.name);
                    return (
                      <div key={addOn.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={() => handleAddOnToggle(addOn)}
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <span>{addOn.name}</span>
                          <span className="text-green-600 font-medium">+R{addOn.price}</span>
                        </label>
                        {selected && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateAddOnQuantity(addOn.name, selected.quantity - 1)}
                              className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="w-6 text-center">{selected.quantity}</span>
                            <button
                              onClick={() => updateAddOnQuantity(addOn.name, selected.quantity + 1)}
                              className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complete Your Meal - Toggle */}
              <div className="mb-4">
                <button
                  onClick={() => setShowUpsells(!showUpsells)}
                  className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <span className="font-semibold text-gray-800">Complete Your Meal</span>
                  <span className="text-green-600">{showUpsells ? '▲' : '▼'}</span>
                </button>
              </div>

              {/* Upsells Section */}
              {showUpsells && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  {/* Fries Options */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaTruck className="text-green-600" /> Add Fries
                    </h4>
                    <div className="space-y-2">
                      {friesUpsellOptions.map((fries) => (
                        <label key={fries.id} className="flex items-center justify-between p-2 bg-white rounded-lg cursor-pointer">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="fries"
                              checked={selectedFries?.id === fries.id}
                              onChange={() => setSelectedFries(fries)}
                              className="w-4 h-4 text-green-600"
                            />
                            <span>{fries.name}</span>
                          </div>
                          <span className="text-green-600 font-medium">+R{fries.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Juice/Drink Options */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaCocktail className="text-green-600" /> Add a Drink
                    </h4>
                    <div className="mb-2">
                      <select
                        value={selectedJuiceSize}
                        onChange={(e) => setSelectedJuiceSize(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        {juiceUpsellOptions.map((group) => (
                          <option key={group.size} value={group.size}>{group.size}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      {juiceUpsellOptions
                        .find(g => g.size === selectedJuiceSize)
                        ?.options.map((juice) => (
                          <label key={juice.id} className="flex items-center justify-between p-2 bg-white rounded-lg cursor-pointer">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="juice"
                                checked={selectedJuice?.id === juice.id}
                                onChange={() => setSelectedJuice(juice)}
                                className="w-4 h-4 text-green-600"
                              />
                              <span>{juice.name}</span>
                            </div>
                            <span className="text-green-600 font-medium">+R{juice.price}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., no cheese, extra bread, etc."
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-green-600">R{total.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
