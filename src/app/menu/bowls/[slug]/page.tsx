"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaMinus, FaTruck, FaCocktail } from "react-icons/fa";
import { bowls, commonAddOns, friesUpsell, juiceGroup } from "@/data/bowlsData";

interface BowlItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  tags?: string[];
  dressings: string[];
  addOns?: any[];
  baseOptions: string[];
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

export default function BowlDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [bowlItem, setBowlItem] = useState<BowlItem | null>(null);
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedDressing, setSelectedDressing] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [baseError, setBaseError] = useState<string>("");
  
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

  // Load bowl data
  useEffect(() => {
    if (!slug) return;
    
    const item = bowls?.find((b: any) => b.slug === slug);
    if (item) {
      setBowlItem(item);
      if (item.dressings && item.dressings.length > 0) {
        setSelectedDressing(item.dressings[0]);
      }
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
    let total = bowlItem?.basePrice || 0;
    
    if (selectedAddOns.length > 0) {
      total += selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0);
    }
    
    if (selectedFries) {
      total += selectedFries.price;
    }
    
    if (selectedJuice) {
      total += selectedJuice.price;
    }
    
    return total * quantity;
  };

  const validateSelection = () => {
    if (!selectedBase) {
      setBaseError("Please select a base for your bowl");
      return false;
    }
    setBaseError("");
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) {
      document.getElementById('base-selection')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const cartItem = {
      id: `${bowlItem?.id}-${Date.now()}`,
      name: bowlItem?.name || "",
      price: bowlItem?.basePrice || 0,
      quantity: quantity,
      image: bowlItem?.image || "",
      category: "bowls",
      description: bowlItem?.description || "",
      base: selectedBase,
      dressing: selectedDressing,
      addOns: selectedAddOns,
      specialInstructions: specialInstructions,
      friesUpsell: selectedFries,
      juiceUpsell: selectedJuice,
      juiceSize: selectedJuiceSize
    };
    
    console.log("Adding bowl to cart:", cartItem);
    addToCart(cartItem);
    router.push("/cart");
  };

  // Get available juice options for selected size
  const getJuiceOptionsForSize = () => {
    const juiceSizeGroup = juiceGroup.find(g => g.size === selectedJuiceSize);
    return juiceSizeGroup?.options || [];
  };

  if (!mounted || !bowlItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bowl details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/menu/bowls" className="inline-flex items-center text-gray-600 hover:text-green-600 transition">
            <FaArrowLeft className="mr-2" />
            Back to Bowls
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={bowlItem.image}
                alt={bowlItem.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{bowlItem.name}</h1>
            <p className="text-gray-600 mb-4">{bowlItem.description}</p>
            <div className="text-2xl font-bold text-green-600 mb-6">R{bowlItem.basePrice}</div>

            {/* Tags */}
            {bowlItem.tags && bowlItem.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {bowlItem.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Base Selection - REQUIRED */}
            <div id="base-selection" className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Choose Your Base <span className="text-red-500 text-sm">*Required</span>
              </h3>
              {baseError && (
                <p className="text-red-500 text-sm mb-2">{baseError}</p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {bowlItem.baseOptions.map((base, index) => (
                  <button
                    key={`base-${index}-${base}`}
                    onClick={() => {
                      setSelectedBase(base);
                      setBaseError("");
                    }}
                    className={`p-3 rounded-lg border text-left transition ${
                      selectedBase === base
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                        : 'border-gray-300 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{base}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dressing Selection */}
            {bowlItem.dressings && bowlItem.dressings.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Choose Dressing</h3>
                <div className="flex flex-wrap gap-2">
                  {bowlItem.dressings.map((dressing, index) => (
                    <button
                      key={`dressing-${index}-${dressing}`}
                      onClick={() => setSelectedDressing(dressing)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        selectedDressing === dressing
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      {dressing}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add-ons */}
            {commonAddOns && commonAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Add-ons (Optional)</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {commonAddOns.map((addOn, index) => {
                    const selected = selectedAddOns.find(a => a.name === addOn.name);
                    return (
                      <div key={`addon-${index}-${addOn.name}`} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{addOn.name}</p>
                          <p className="text-sm text-green-600">+R{addOn.price}</p>
                        </div>
                        {selected ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateAddOnQuantity(addOn.name, selected.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaMinus className="text-sm" />
                            </button>
                            <span className="w-8 text-center">{selected.quantity}</span>
                            <button
                              onClick={() => updateAddOnQuantity(addOn.name, selected.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaPlus className="text-sm" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddOnToggle(addOn)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upsells Section - Fries & Juice */}
            <div className="mb-6">
              <button
                onClick={() => setShowUpsells(!showUpsells)}
                className="flex items-center gap-2 text-green-600 font-medium mb-3 hover:text-green-700"
              >
                {showUpsells ? '▼' : '▶'} Add Fries & Drink to Complete Your Meal
              </button>
              
              {showUpsells && (
                <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  {/* Fries Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaTruck className="text-amber-600" />
                      Add Fries
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {friesUpsell.map((fries) => (
                        <button
                          key={fries.id}
                          onClick={() => setSelectedFries(selectedFries?.id === fries.id ? null : fries)}
                          className={`px-3 py-2 rounded-lg border text-sm transition ${
                            selectedFries?.id === fries.id
                              ? 'border-amber-500 bg-amber-100 text-amber-700'
                              : 'border-gray-300 hover:border-amber-300'
                          }`}
                        >
                          {fries.name} <span className="text-green-600">+R{fries.price}</span>
                        </button>
                      ))}
                    </div>
                    {selectedFries && (
                      <p className="text-xs text-green-600 mt-2">✓ {selectedFries.name} added</p>
                    )}
                  </div>

                  {/* Juice Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaCocktail className="text-amber-600" />
                      Add Juice
                    </h3>
                    
                    {/* Juice Size Selector */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {juiceGroup.map((size) => (
                        <button
                          key={size.size}
                          onClick={() => setSelectedJuiceSize(size.size)}
                          className={`px-3 py-1 rounded-lg text-sm transition ${
                            selectedJuiceSize === size.size
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {size.size}
                        </button>
                      ))}
                    </div>
                    
                    {/* Juice Options for Selected Size */}
                    <div className="flex flex-wrap gap-2">
                      {getJuiceOptionsForSize().map((juice) => (
                        <button
                          key={juice.id}
                          onClick={() => setSelectedJuice(selectedJuice?.id === juice.id ? null : juice)}
                          className={`px-3 py-2 rounded-lg border text-sm transition ${
                            selectedJuice?.id === juice.id
                              ? 'border-amber-500 bg-amber-100 text-amber-700'
                              : 'border-gray-300 hover:border-amber-300'
                          }`}
                        >
                          {juice.name} <span className="text-green-600">+R{juice.price}</span>
                        </button>
                      ))}
                    </div>
                    {selectedJuice && (
                      <p className="text-xs text-green-600 mt-2">✓ {selectedJuice.name} ({selectedJuiceSize}) added</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests or dietary requirements?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={2}
              />
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  <FaMinus />
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Total and Add to Cart */}
            <div className="border-t pt-6">
              <div className="mb-4">
                <div className="flex justify-between items-center text-gray-600 mb-2">
                  <span>Base Price:</span>
                  <span>R{bowlItem.basePrice}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Add-ons:</span>
                    <span>+R{selectedAddOns.reduce((sum, addOn) => sum + (addOn.price * addOn.quantity), 0)}</span>
                  </div>
                )}
                {selectedFries && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Fries:</span>
                    <span>+R{selectedFries.price}</span>
                  </div>
                )}
                {selectedJuice && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Juice:</span>
                    <span>+R{selectedJuice.price}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-600 pt-2 border-t">
                  <span className="font-semibold">Subtotal ({quantity} item{quantity > 1 ? 's' : ''}):</span>
                  <span className="font-semibold">R{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Add to Cart - R{calculateTotal().toFixed(2)}
              </button>
              {!selectedBase && (
                <p className="text-xs text-center text-red-500 mt-2">
                  * Please select a base before adding to cart
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
