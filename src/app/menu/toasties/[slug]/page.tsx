'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toasties, friesUpsellOptions, juiceUpsellOptions, toastieAddOns } from '@/data/toastiesData';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, ShoppingCart, Star, Check, ArrowLeft, Coffee, Flame } from 'lucide-react';
import { FaFire, FaTruck, FaCocktail } from 'react-icons/fa';
import { loadPopularItems, isItemPopular } from '@/services/popularItemsService';

interface DipOption {
  id: string;
  name: string;
  price: number;
}

interface SelectedFriesWithDip {
  id: string;
  name: string;
  price: number;
  selectedDip?: DipOption;
}

export default function ToastieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [toastie, setToastie] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Map<string, { name: string; price: number; quantity: number }>>(new Map());
  const [selectedFries, setSelectedFries] = useState<SelectedFriesWithDip | null>(null);
  const [selectedJuice, setSelectedJuice] = useState<{ size: string; name: string; price: number } | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [showUpsells, setShowUpsells] = useState(false);
  const [selectedJuiceSize, setSelectedJuiceSize] = useState<string>("250ml");

  useEffect(() => {
    const slug = params.slug as string;
    const foundToastie = toasties.find(t => t.slug === slug);
    if (foundToastie) {
      setToastie(foundToastie);
      loadPopularItems();
      setIsPopular(isItemPopular(foundToastie.id, 'toasties'));
    }
    setLoading(false);
  }, [params.slug]);

  const handleAddOnToggle = (addon: { id: string; name: string; price: number }) => {
    setSelectedAddOns(prev => {
      const newMap = new Map(prev);
      if (newMap.has(addon.id)) {
        newMap.delete(addon.id);
      } else {
        newMap.set(addon.id, { ...addon, quantity: 1 });
      }
      return newMap;
    });
  };

  const handleAddOnQuantityChange = (addonId: string, quantity: number) => {
    setSelectedAddOns(prev => {
      const newMap = new Map(prev);
      const addon = newMap.get(addonId);
      if (addon) {
        if (quantity <= 0) {
          newMap.delete(addonId);
        } else {
          newMap.set(addonId, { ...addon, quantity });
        }
      }
      return newMap;
    });
  };

  // Handle fries selection with dip
  const handleFriesSelect = (fries: any) => {
    if (selectedFries?.id === fries.id) {
      setSelectedFries(null);
    } else {
      setSelectedFries({
        id: fries.id,
        name: fries.name,
        price: fries.price,
        selectedDip: undefined,
      });
    }
  };

  const handleDipSelect = (dip: DipOption) => {
    if (selectedFries) {
      setSelectedFries({
        ...selectedFries,
        selectedDip: selectedFries.selectedDip?.id === dip.id ? undefined : dip,
      });
    }
  };

  // Handle juice selection
  const handleJuiceSelect = (juice: any, size: string) => {
    if (selectedJuice?.name === juice.name && selectedJuice?.size === size) {
      setSelectedJuice(null);
    } else {
      setSelectedJuice({
        size: size,
        name: juice.name,
        price: juice.price
      });
    }
  };

  const getJuiceOptionsForSize = () => {
    const juiceSizeGroup = juiceUpsellOptions.find(g => g.size === selectedJuiceSize);
    return juiceSizeGroup?.options || [];
  };

  const getItemTotal = () => {
    if (!toastie) return 0;
    let total = toastie.price * quantity;

    selectedAddOns.forEach(addon => {
      total += addon.price * addon.quantity;
    });

    if (selectedFries) {
      total += selectedFries.price * quantity;
      if (selectedFries.selectedDip) {
        total += selectedFries.selectedDip.price * quantity;
      }
    }

    if (selectedJuice) {
      total += selectedJuice.price * quantity;
    }

    return total;
  };

  const handleAddToCart = () => {
    if (!toastie) return;

    const addOnsArray = Array.from(selectedAddOns.entries()).map(([id, addon]) => ({
      id,
      name: addon.name,
      price: addon.price,
      quantity: addon.quantity
    }));

    let itemName = toastie.name;
    if (selectedFries) {
      itemName += ` + ${selectedFries.name}`;
      if (selectedFries.selectedDip) {
        itemName += ` with ${selectedFries.selectedDip.name}`;
      }
    }
    if (selectedJuice) {
      itemName += ` + ${selectedJuice.name} (${selectedJuice.size})`;
    }

    const cartItem = {
      id: `${toastie.id}-${Date.now()}`,
      name: itemName,
      price: toastie.price,
      quantity: quantity,
      image: toastie.image,
      category: "toasties",
      description: toastie.description,
      addOns: addOnsArray,
      specialInstructions: specialInstructions,
      fries: selectedFries ? {
        name: selectedFries.name,
        price: selectedFries.price,
        dip: selectedFries.selectedDip?.name,
        dipPrice: selectedFries.selectedDip?.price || 0,
      } : null,
      juice: selectedJuice ? {
        name: selectedJuice.name,
        price: selectedJuice.price,
        size: selectedJuice.size,
      } : null,
    };
    
    addToCart(cartItem);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading toastie details...</p>
        </div>
      </div>
    );
  }

  if (!toastie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Toastie not found</p>
          <Link href="/menu/toasties" className="text-green-600 hover:underline mt-4 inline-block">
            Back to Toasties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Toasties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="relative h-96">
              <Image
                src={toastie.image}
                alt={toastie.name}
                fill
                className="object-cover"
              />
              {isPopular && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <FaFire className="text-sm" />
                  <span className="text-sm font-medium">Popular</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{toastie.name}</h1>
            <p className="text-gray-600 mb-4">{toastie.description}</p>
            <div className="text-2xl font-bold text-green-600 mb-6">R{toastie.price}</div>

            {/* Tags */}
            {toastie.tags && toastie.tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {toastie.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Add-ons */}
            {toastieAddOns && toastieAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Add-ons (Optional)</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {toastieAddOns.map((addon) => {
                    const selected = selectedAddOns.get(addon.id);
                    return (
                      <div key={addon.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{addon.name}</p>
                          <p className="text-sm text-green-600">+R{addon.price}</p>
                        </div>
                        {selected ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleAddOnQuantityChange(addon.id, selected.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{selected.quantity}</span>
                            <button
                              onClick={() => handleAddOnQuantityChange(addon.id, selected.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddOnToggle(addon)}
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
                  {/* Fries Selection with Dip Options */}
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
                    
                    {/* Dip Options - only show if fries are selected */}
                    {selectedFries && friesUpsellOptions.find(f => f.id === selectedFries.id)?.dips && (
                      <div className="mt-3 pl-4 border-l-2 border-amber-300">
                        <p className="text-sm font-medium text-gray-700 mb-2">Choose a dip (optional):</p>
                        <div className="flex flex-wrap gap-2">
                          {friesUpsellOptions
                            .find(f => f.id === selectedFries.id)
                            ?.dips?.map((dip: DipOption) => (
                              <button
                                key={dip.id}
                                onClick={() => handleDipSelect(dip)}
                                className={`px-3 py-1 rounded-full text-xs transition ${
                                  selectedFries.selectedDip?.id === dip.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:border-green-400'
                                }`}
                              >
                                {dip.name} {dip.price > 0 && `+R${dip.price}`}
                              </button>
                            ))}
                        </div>
                        {selectedFries.selectedDip && (
                          <p className="text-xs text-green-600 mt-2">
                            ✓ {selectedFries.selectedDip.name} added
                          </p>
                        )}
                      </div>
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
                    
                    {/* Juice Options for Selected Size */}
                    <div className="flex flex-wrap gap-2">
                      {getJuiceOptionsForSize().map((juice) => (
                        <button
                          key={juice.id}
                          onClick={() => handleJuiceSelect(juice, selectedJuiceSize)}
                          className={`px-3 py-2 rounded-lg border text-sm transition ${
                            selectedJuice?.name === juice.name && selectedJuice?.size === selectedJuiceSize
                              ? 'border-amber-500 bg-amber-100 text-amber-700'
                              : 'border-gray-300 hover:border-amber-300'
                          }`}
                        >
                          {juice.name} <span className="text-green-600">+R{juice.price}</span>
                        </button>
                      ))}
                    </div>
                    {selectedJuice && (
                      <p className="text-xs text-green-600 mt-2">
                        ✓ {selectedJuice.name} ({selectedJuice.size}) added
                      </p>
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
                placeholder="Any special requests? (e.g., no pickles, extra sauce, etc.)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
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
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Total and Add to Cart */}
            <div className="border-t pt-6">
              <div className="mb-4">
                <div className="flex justify-between items-center text-gray-600 mb-2">
                  <span>Base Price:</span>
                  <span>R{toastie.price}</span>
                </div>
                {selectedAddOns.size > 0 && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>Add-ons:</span>
                    <span>+R{Array.from(selectedAddOns.values()).reduce((sum, addon) => sum + (addon.price * addon.quantity), 0)}</span>
                  </div>
                )}
                {selectedFries && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>{selectedFries.name}:</span>
                    <span>+R{selectedFries.price}</span>
                  </div>
                )}
                {selectedFries?.selectedDip && (
                  <div className="flex justify-between items-center text-gray-600 mb-2 pl-4 text-sm">
                    <span>└ {selectedFries.selectedDip.name}:</span>
                    <span>+R{selectedFries.selectedDip.price}</span>
                  </div>
                )}
                {selectedJuice && (
                  <div className="flex justify-between items-center text-gray-600 mb-2">
                    <span>{selectedJuice.name} ({selectedJuice.size}):</span>
                    <span>+R{selectedJuice.price}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-600 pt-2 border-t">
                  <span className="font-semibold">Subtotal ({quantity} item{quantity > 1 ? 's' : ''}):</span>
                  <span className="font-semibold">R{getItemTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart - R{getItemTotal().toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
