"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { juices, juiceAddOns } from '@/data/juices';
import { useCart } from '@/context/CartContext';
import BackButton from "@/components/BackButton";
interface AddOnWithId {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const generateAddOnId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "-");
import { Minus, Plus, ShoppingCart, Star, Check, ArrowLeft } from 'lucide-react';

export default function JuiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [juice, setJuice] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<Map<string, { name: string; price: number; quantity: number }>>(new Map());
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug as string;
    const foundJuice = juices.find(j => j.slug === slug);
    if (foundJuice) {
      setJuice(foundJuice);
      if (foundJuice.sizes && foundJuice.sizes.length > 0) {
        setSelectedSize(foundJuice.sizes[0]);
      }
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
    if (!selectedSize) return 0;
    let total = selectedSize.price * quantity;
    selectedAddOns.forEach(addon => {
      total += addon.price * addon.quantity;
    });
    return total;
  };

  const handleAddToCart = () => {
    if (!juice || !selectedSize) return;

    const addOnsArray = Array.from(selectedAddOns.entries()).map(([id, addon]) => ({
      id,
      name: addon.name,
      price: addon.price,
      quantity: addon.quantity
    }));

    const cartItem = {
      id: `${juice.id}-${selectedSize.id}-${Date.now()}`,
      name: `${juice.name} (${selectedSize.label})`,
      price: selectedSize.price,
      quantity: quantity,
      image: juice.image,
      category: 'juices',
      specialInstructions: specialInstructions || undefined,
      addOns: addOnsArray.length > 0 ? addOnsArray : undefined
    };

    addToCart(cartItem);
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50]"></div>
      </div>
    );
  }

  if (!juice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Juice not found</h1>
          <Link href="/menu/juices" className="text-[#2F5D50] hover:underline">
            Back to Juices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back button */}
        <Link href="/menu/juices" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2F5D50] transition-colors mb-6">
          <ArrowLeft size={20} />
          <span>Back to Juices</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100">
            {juice.image ? (
              <Image src={juice.image} alt={juice.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{juice.name}</h1>
                <p className="text-gray-600">{juice.description}</p>
              </div>
              {juice.popular && (
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-yellow-700">Popular</span>
                </div>
              )}
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Select Size</h3>
              <div className="flex gap-3">
                {juice.sizes.map((size: any) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      selectedSize?.id === size.id
                        ? 'border-[#2F5D50] bg-[#2F5D50]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{size.label}</div>
                    <div className="text-sm text-gray-500">{size.ml}ml</div>
                    <div className="text-lg font-bold text-[#2F5D50]">R{size.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            {juiceAddOns && juiceAddOns.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Add-ons</h3>
                <div className="space-y-2">
                  {juiceAddOns.map((addon) => {
                    const isSelected = selectedAddOns.has(addon.id);
                    const selectedAddon = selectedAddOns.get(addon.id);
                    return (
                      <div key={addon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAddOnToggle(addon)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-[#2F5D50] border-[#2F5D50]' : 'border-gray-300'
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
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm w-6 text-center">{selectedAddon?.quantity || 1}</span>
                            <button
                              onClick={() => handleAddOnQuantityChange(addon.id, (selectedAddon?.quantity || 1) + 1)}
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center"
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

            {/* Special Instructions */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Special Instructions</h3>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (e.g., no ice, extra sweet, etc.)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50]"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold text-lg w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50]"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#2F5D50] text-white py-3 rounded-xl font-semibold hover:bg-[#23483E] transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart - R{getItemTotal().toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
