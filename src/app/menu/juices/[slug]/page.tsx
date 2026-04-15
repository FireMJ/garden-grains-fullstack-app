'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { juicesData, juiceAddOns, friesUpsellOptions, juiceUpsellOptions } from '@/data/juicesData';
import { useCart } from '@/context/CartContext';
import { FaArrowLeft, FaPlus, FaMinus, FaShoppingCart, FaTruck, FaCocktail } from 'react-icons/fa';

// Fallback data if imports are missing
const fallbackJuices = [
  {
    id: "juice-1",
    slug: "orange-juice",
    name: "Fresh Orange Juice",
    description: "Freshly squeezed oranges, no added sugar.",
    price: 55,
    image: "/images/juices/orange-juice.jpg",
    popular: true,
  },
];

const fallbackAddOns = [
  { id: "addon1", name: "Ginger Shot", price: 15 },
  { id: "addon2", name: "Extra Ice", price: 0 },
];

const fallbackFriesUpsell = [
  { id: "fries1", name: "Skinny French Fries", price: 45 },
];

const fallbackJuiceUpsell = [
  { size: "250ml", options: [{ id: "juice1", name: "Orange Juice", price: 55 }] },
  { size: "350ml", options: [{ id: "juice2", name: "Orange Juice", price: 75 }] },
];

export default function JuiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const slug = params?.slug as string;
  
  const [juiceItem, setJuiceItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedFries, setSelectedFries] = useState<any>(null);
  const [selectedJuice, setSelectedJuice] = useState<any>(null);
  const [selectedJuiceSize, setSelectedJuiceSize] = useState<string>("250ml");
  const [showUpsells, setShowUpsells] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mounted, setMounted] = useState(false);

  const friesUpsellOptionsList = juicesData?.friesUpsellOptions || fallbackFriesUpsell;
  const juiceUpsellOptionsList = juicesData?.juiceUpsellOptions || fallbackJuiceUpsell;
  const addOnsList = juicesData?.juiceAddOns || fallbackAddOns;
  const juicesList = juicesData?.juicesData || fallbackJuices;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!slug) return;
    const item = juicesList.find((j: any) => j.slug === slug);
    if (item) setJuiceItem(item);
  }, [slug, juicesList]);

  const handleAddOnToggle = (addOn: { name: string; price: number }) => {
    setSelectedAddOns(prev => {
      const existing = prev.find(a => a.name === addOn.name);
      if (existing) return prev.filter(a => a.name !== addOn.name);
      else return [...prev, { ...addOn, quantity: 1 }];
    });
  };

  const updateAddOnQuantity = (addOnName: string, newQuantity: number) => {
    if (newQuantity <= 0) setSelectedAddOns(prev => prev.filter(a => a.name !== addOnName));
    else setSelectedAddOns(prev => prev.map(a => a.name === addOnName ? { ...a, quantity: newQuantity } : a));
  };

  const calculateTotal = () => {
    let total = juiceItem?.price || 0;
    selectedAddOns.forEach(addOn => { total += addOn.price * addOn.quantity; });
    if (selectedFries) total += selectedFries.price;
    if (selectedJuice) total += selectedJuice.price;
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!juiceItem) return;
    addToCart({
      id: `${juiceItem.id}-${Date.now()}`,
      name: juiceItem.name,
      price: juiceItem.price,
      quantity: quantity,
      image: juiceItem.image,
      addOns: selectedAddOns,
      friesUpsell: selectedFries,
      juiceUpsell: selectedJuice,
      specialInstructions: specialInstructions || undefined,
    });
    alert(`Added ${quantity} x ${juiceItem.name} to cart`);
    router.push('/cart');
  };

  if (!mounted || !juiceItem) {
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
        <Link href="/menu/juices" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition">
          <FaArrowLeft /> Back to Juices
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-64 md:h-full min-h-[300px] bg-gray-100">
              {!imageError ? (
                <Image
                  src={juiceItem.image}
                  alt={juiceItem.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">🥤</div>
              )}
            </div>

            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{juiceItem.name}</h1>
              <p className="text-gray-600 mb-4 leading-relaxed">{juiceItem.description}</p>
              <p className="text-2xl font-bold text-green-600 mb-6">R{juiceItem.price}</p>

              {addOnsList && addOnsList.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Add-ons</h3>
                  <div className="space-y-2">
                    {addOnsList.map((addOn: any) => {
                      const selected = selectedAddOns.find(a => a.name === addOn.name);
                      return (
                        <div key={addOn.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <input type="checkbox" checked={!!selected} onChange={() => handleAddOnToggle(addOn)} className="w-4 h-4 text-green-600 rounded" />
                            <span>{addOn.name}</span><span className="text-green-600 font-medium">+R{addOn.price}</span>
                          </label>
                          {selected && (<div className="flex items-center gap-2"><button onClick={() => updateAddOnQuantity(addOn.name, selected.quantity - 1)} className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300"><FaMinus size={12} /></button><span className="w-6 text-center">{selected.quantity}</span><button onClick={() => updateAddOnQuantity(addOn.name, selected.quantity + 1)} className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300"><FaPlus size={12} /></button></div>)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-4"><button onClick={() => setShowUpsells(!showUpsells)} className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"><span className="font-semibold text-gray-800">Complete Your Meal</span><span className="text-green-600">{showUpsells ? '▲' : '▼'}</span></button></div>

              {showUpsells && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
                  <div><h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2"><FaTruck className="text-green-600" /> Add Fries</h4>
                    <div className="space-y-2">{friesUpsellOptionsList.map((fries: any) => (<label key={fries.id} className="flex items-center justify-between p-2 bg-white rounded-lg cursor-pointer"><div className="flex items-center gap-3"><input type="radio" name="fries" checked={selectedFries?.id === fries.id} onChange={() => setSelectedFries(fries)} className="w-4 h-4 text-green-600" /><span>{fries.name}</span></div><span className="text-green-600 font-medium">+R{fries.price}</span></label>))}</div>
                  </div>
                  <div><h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2"><FaCocktail className="text-green-600" /> Add a Drink</h4>
                    <div className="mb-2"><select value={selectedJuiceSize} onChange={(e) => setSelectedJuiceSize(e.target.value)} className="p-2 border border-gray-300 rounded-lg text-sm">{juiceUpsellOptionsList.map((g: any) => (<option key={g.size} value={g.size}>{g.size}</option>))}</select></div>
                    <div className="space-y-2">{juiceUpsellOptionsList.find((g: any) => g.size === selectedJuiceSize)?.options.map((juice: any) => (<label key={juice.id} className="flex items-center justify-between p-2 bg-white rounded-lg cursor-pointer"><div className="flex items-center gap-3"><input type="radio" name="juice" checked={selectedJuice?.id === juice.id} onChange={() => setSelectedJuice(juice)} className="w-4 h-4 text-green-600" /><span>{juice.name}</span></div><span className="text-green-600 font-medium">+R{juice.price}</span></label>))}</div>
                  </div>
                </div>
              )}

              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label><textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} placeholder="e.g., no ice, extra lemon, etc." rows={2} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4"><span className="font-semibold text-gray-700">Quantity:</span><div className="flex items-center gap-3"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"><FaMinus size={12} /></button><span className="text-lg font-semibold w-8 text-center">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"><FaPlus size={12} /></button></div></div>
                <div className="flex justify-between items-center mb-4"><span className="font-semibold text-gray-700">Total:</span><span className="text-2xl font-bold text-green-600">R{total.toFixed(2)}</span></div>
                <button onClick={handleAddToCart} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"><FaShoppingCart /> Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
