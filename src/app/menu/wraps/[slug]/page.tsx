"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import Link from "next/link";
import { wraps, wrapAddOns, friesUpsellOptions, juiceUpsellOptions } from "@/data/wrapsData";
import { FaArrowLeft, FaPlus, FaMinus, FaTruck, FaCocktail } from "react-icons/fa";

// Helper function to generate add-on ID
const generateAddOnId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '-');

interface AddOnWithId {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function WrapDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [wrap, setWrap] = useState<any>(null);
  const [selectedProtein, setSelectedProtein] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnWithId[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const [selectedFries, setSelectedFries] = useState<any>(null);
  const [selectedJuice, setSelectedJuice] = useState<any>(null);
  const [selectedJuiceSize, setSelectedJuiceSize] = useState<string>("250ml");
  const [showUpsells, setShowUpsells] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrapped = await params;
      setSlug(unwrapped.slug);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    const item = wraps?.find((w: any) => w.slug === slug);
    if (item) {
      setWrap(item);
      if (item.proteinOptions && item.proteinOptions.length > 0) {
        setSelectedProtein(item.proteinOptions[0]);
      }
    }
  }, [slug]);

  const handleAddOnToggle = (addOn: { name: string; price: number }) => {
    const addOnId = generateAddOnId(addOn.name);
    setSelectedAddOns(prev => {
      const existing = prev.find(a => a.id === addOnId);
      if (existing) {
        return prev.filter(a => a.id !== addOnId);
      } else {
        return [...prev, { id: addOnId, ...addOn, quantity: 1 }];
      }
    });
  };

  const updateAddOnQuantity = (addOnId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedAddOns(prev => prev.filter(a => a.id !== addOnId));
    } else {
      setSelectedAddOns(prev =>
        prev.map(a =>
          a.id === addOnId ? { ...a, quantity: newQuantity } : a
        )
      );
    }
  };

  const handleFriesSelect = (fries: any) => {
    if (selectedFries?.id === fries.id) {
      setSelectedFries(null);
    } else {
      setSelectedFries(fries);
    }
  };

  const handleJuiceSelect = (juice: any, size: string) => {
    if (selectedJuice?.name === juice.name && selectedJuice?.size === size) {
      setSelectedJuice(null);
    } else {
      setSelectedJuice({ ...juice, size });
    }
  };

  const getJuiceOptionsForSize = () => {
    const juiceSizeGroup = juiceUpsellOptions.find(g => g.size === selectedJuiceSize);
    return juiceSizeGroup?.options || [];
  };

  const calculateTotal = () => {
    let total = wrap?.price || 0;
    
    if (selectedProtein && selectedProtein.price > 0) {
      total += selectedProtein.price;
    }
    
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

  const handleAddToCart = () => {
    if (!wrap) return;
    
    let itemName = wrap.name;
    if (selectedProtein && selectedProtein.name !== "Default") {
      itemName += ` (${selectedProtein.name})`;
    }
    if (selectedFries) {
      itemName += ` + ${selectedFries.name}`;
    }
    if (selectedJuice) {
      itemName += ` + ${selectedJuice.name} (${selectedJuice.size})`;
    }
    
    const cartItem = {
      id: `${wrap.id}-${Date.now()}`,
      name: itemName,
      price: wrap.price,
      quantity: quantity,
      image: wrap.image,
      category: "wraps",
      description: wrap.description,
      protein: selectedProtein?.name,
      proteinExtra: selectedProtein?.price || 0,
      addOns: selectedAddOns.map(a => ({ 
        id: a.id, 
        name: a.name, 
        price: a.price, 
        quantity: a.quantity 
      })),
      specialInstructions: specialInstructions,
      fries: selectedFries ? {
        name: selectedFries.name,
        price: selectedFries.price,
      } : null,
      juice: selectedJuice ? {
        name: selectedJuice.name,
        price: selectedJuice.price,
        size: selectedJuice.size,
      } : null,
    };
    
    console.log("Adding wrap to cart:", cartItem);
    addToCart(cartItem);
    router.push("/cart");
  };

  if (!mounted || !wrap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wrap details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/menu/wraps" className="inline-flex items-center text-gray-600 hover:text-green-600 transition">
            <FaArrowLeft className="mr-2" />
            Back to Wraps
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <BackButton fallbackHref="/menu" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={wrap.image}
                alt={wrap.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{wrap.name}</h1>
            <p className="text-gray-600 mb-4">{wrap.description}</p>
            <div className="text-2xl font-bold text-green-600 mb-6">R{wrap.price}</div>

            {wrap.tags && wrap.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {wrap.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {wrap.proteinOptions && wrap.proteinOptions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Choose Your Protein</h3>
                <div className="flex flex-wrap gap-2">
                  {wrap.proteinOptions.map((protein: any) => (
                    <button
                      key={protein.id}
                      onClick={() => setSelectedProtein(protein)}
                      className={`px-3 py-2 rounded-lg border text-sm transition ${
                        selectedProtein?.id === protein.id
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      {protein.name} {protein.price > 0 && `(+R${protein.price})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {wrapAddOns && wrapAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Add-ons (Optional)</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {wrapAddOns.map((addOn) => {
                    const addOnId = generateAddOnId(addOn.name);
                    const selected = selectedAddOns.find(a => a.id === addOnId);
                    return (
                      <div key={addOnId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{addOn.name}</p>
                          <p className="text-sm text-green-600">+R{addOn.price}</p>
                        </div>
                        {selected ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateAddOnQuantity(addOnId, selected.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full"
                            >
                              <FaMinus />
                            </button>
                            <span className="w-8 text-center">{selected.quantity}</span>
                            <button
                              onClick={() => updateAddOnQuantity(addOnId, selected.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full"
                            >
                              <FaPlus />
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

            <div className="mb-6">
              <button
                onClick={() => setShowUpsells(!showUpsells)}
                className="flex items-center gap-2 text-green-600 font-medium mb-3 hover:text-green-700 w-full text-left"
              >
                <span>{showUpsells ? '▼' : '▶'}</span> 
                <span>Add Fries & Drink to Complete Your Meal</span>
              </button>
              
              {showUpsells && (
                <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaTruck className="text-amber-600" />
                      Add Fries
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {friesUpsellOptions.map((fries) => (
                        <button
                          key={fries.id}
                          onClick={() => handleFriesSelect(fries)}
                          className={`px-4 py-2 rounded-lg border text-sm transition ${
                            selectedFries?.id === fries.id
                              ? 'border-amber-500 bg-amber-100 text-amber-700'
                              : 'border-gray-300 bg-white hover:border-amber-300'
                          }`}
                        >
                          {fries.name} <span className="text-green-600 font-medium">+R{fries.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <FaCocktail className="text-amber-600" />
                      Add Juice
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {juiceUpsellOptions.map((sizeGroup) => (
                        <button
                          key={sizeGroup.size}
                          onClick={() => setSelectedJuiceSize(sizeGroup.size)}
                          className={`px-3 py-1 rounded-lg text-sm transition ${
                            selectedJuiceSize === sizeGroup.size
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {sizeGroup.size}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {getJuiceOptionsForSize().map((juice) => (
                        <button
                          key={juice.id}
                          onClick={() => handleJuiceSelect(juice, selectedJuiceSize)}
                          className={`px-3 py-2 rounded-lg border text-sm transition ${
                            selectedJuice?.name === juice.name && selectedJuice?.size === selectedJuiceSize
                              ? 'border-amber-500 bg-amber-100 text-amber-700'
                              : 'border-gray-300 bg-white hover:border-amber-300'
                          }`}
                        >
                          {juice.name} <span className="text-green-600">+R{juice.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests?"
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={2}
              />
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-gray-200 rounded-full">
                  <FaMinus />
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-gray-200 rounded-full">
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <button onClick={handleAddToCart} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium">
                Add to Cart - R{calculateTotal().toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
