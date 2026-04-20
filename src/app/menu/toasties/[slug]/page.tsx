'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toasties, friesUpsellOptions, juiceUpsellOptions, toastieAddOns } from '@/data/toasties';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, ShoppingCart, Star, Check, ArrowLeft, Coffee, Flame } from 'lucide-react';
import { FaFire } from 'react-icons/fa';
import { loadPopularItems, isItemPopular } from '@/services/popularItemsService';

export default function ToastieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [toastie, setToastie] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Map<string, { name: string; price: number; quantity: number }>>(new Map());
  const [selectedFries, setSelectedFries] = useState<any>(null);
  const [selectedJuice, setSelectedJuice] = useState<{ size: string; name: string; price: number } | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPopular, setIsPopular] = useState(false);

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

  const getItemTotal = () => {
    if (!toastie) return 0;
    let total = toastie.price * quantity;
    
    selectedAddOns.forEach(addon => {
      total += addon.price * addon.quantity;
    });
    
    if (selectedFries) {
      total += selectedFries.price * quantity;
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
      category: 'toasties',
      specialInstructions: specialInstructions || undefined,
      addOns: addOnsArray.length > 0 ? addOnsArray : undefined,
      fries: selectedFries,
      juice: selectedJuice,
    };

    addToCart(cartItem);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!toastie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Toastie not found</h1>
          <Link href="/menu/toasties" className="text-green-600 hover:underline">
            Back to Toasties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/menu/toasties" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition">
          <ArrowLeft size={18} />
          Back to Toasties
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Section */}
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-100">
              <Image 
                src={toastie.image} 
                alt={toastie.name} 
                fill 
                className="object-cover" 
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-food.jpg';
                }}
              />
              {isPopular && (
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <FaFire className="w-3 h-3" /> Popular
                </div>
              )}
            </div>

            {/* Details Section */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{toastie.name}</h1>
              <p className="text-gray-600 mb-4">{toastie.description}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-green-600">R{toastie.price}</span>
                <span className="text-gray-400 text-sm">+R25 for fries</span>
              </div>

              {/* Add-ons Section */}
              {toastieAddOns && toastieAddOns.length > 0 && (
                <div className="mb-6 border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Add-ons</h3>
                  <div className="space-y-2">
                    {toastieAddOns.map((addon) => {
                      const isSelected = selectedAddOns.has(addon.id);
                      const selectedAddon = selectedAddOns.get(addon.id);
                      return (
                        <div key={addon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleAddOnToggle(addon)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                isSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'
                              }`}
                            >
                              {isSelected && <Check size={12} className="text-white" />}
                            </button>
                            <span className="text-gray-700">{addon.name}</span>
                            <span className="text-sm text-green-600">+R{addon.price}</span>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAddOnQuantityChange(addon.id, (selectedAddon?.quantity || 1) - 1)}
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-600"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm w-6 text-center">{selectedAddon?.quantity || 1}</span>
                              <button
                                onClick={() => handleAddOnQuantityChange(addon.id, (selectedAddon?.quantity || 1) + 1)}
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-600"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fries Upsell */}
              {friesUpsellOptions && friesUpsellOptions.length > 0 && (
                <div className="mb-6 border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Add Fries (+R25)</h3>
                  <div className="flex gap-3">
                    {friesUpsellOptions.map((fries) => (
                      <button
                        key={fries.id}
                        onClick={() => setSelectedFries(selectedFries?.id === fries.id ? null : fries)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                          selectedFries?.id === fries.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{fries.name}</div>
                        <div className="text-sm text-green-600">+R{fries.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Juice Upsell */}
              {juiceUpsellOptions && juiceUpsellOptions.length > 0 && (
                <div className="mb-6 border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Add a Fresh Juice</h3>
                  <div className="space-y-3">
                    {juiceUpsellOptions.map((group) => (
                      <div key={group.size}>
                        <p className="text-sm font-medium text-gray-700 mb-2">{group.size}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {group.options.map((juice) => (
                            <button
                              key={juice.id}
                              onClick={() => setSelectedJuice(selectedJuice?.name === juice.name ? null : { size: group.size, name: juice.name, price: juice.price })}
                              className={`p-2 rounded-lg border text-sm transition-all ${
                                selectedJuice?.name === juice.name
                                  ? 'border-green-600 bg-green-50 text-green-600'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                            >
                              {juice.name}
                              <span className="text-xs text-green-600 block">+R{juice.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="mb-6 border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Special Instructions</h3>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests? (e.g., no onions, extra sauce, well toasted, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold text-lg w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-600 hover:text-green-600 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add to Cart - R{getItemTotal().toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
