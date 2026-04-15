"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Minus, Plus, Trash2, X, MapPin, Truck, Store, Navigation, CheckCircle } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { getDrivingDistance, RESTAURANT_COORDS, DELIVERY_CONFIG } from "@/lib/googleMaps";

export default function CartPage() {
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (distance !== null && deliveryMethod === 'delivery') {
      const fee = calculateDeliveryFee(distance, cart.totalPrice);
      setDeliveryFee(fee);
      setIsAddressValid(distance <= DELIVERY_CONFIG.MAX_DISTANCE_KM);
    } else if (deliveryMethod === 'pickup') {
      setIsAddressValid(true);
    }
  }, [distance, deliveryMethod, cart.totalPrice]);

  const calculateDeliveryFee = (distanceKm: number, subtotal: number = 0): number => {
    if (subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD) return 0;
    if (distanceKm <= DELIVERY_CONFIG.BASE_DISTANCE_KM) return DELIVERY_CONFIG.BASE_DELIVERY_FEE;
    const extraKm = Math.ceil(distanceKm - DELIVERY_CONFIG.BASE_DISTANCE_KM);
    return DELIVERY_CONFIG.BASE_DELIVERY_FEE + (extraKm * DELIVERY_CONFIG.EXTRA_KM_RATE);
  };

  const handleAddressSelect = async (selectedAddress: {
    street: string;
    city: string;
    postalCode: string;
    formattedAddress: string;
    coordinates: { lat: number; lng: number };
  }) => {
    setDeliveryAddress(selectedAddress.formattedAddress);
    setDeliveryCoordinates(selectedAddress.coordinates);
    setIsCalculatingDistance(true);
    setAddressError('');
    setIsAddressValid(false);
    setIsCalculating(true);
    
    try {
      const result = await getDrivingDistance(selectedAddress.coordinates, RESTAURANT_COORDS);
      
      if (result && result.distance) {
        setDistance(result.distance);
        if (result.distance <= DELIVERY_CONFIG.MAX_DISTANCE_KM) {
          setIsAddressValid(true);
          setAddressError('');
        } else {
          setAddressError(`Location is ${result.distance.toFixed(1)} km away. Maximum delivery distance is ${DELIVERY_CONFIG.MAX_DISTANCE_KM} km.`);
        }
      } else {
        setAddressError('Could not calculate distance to this address');
      }
    } catch (error) {
      console.error('Distance calculation error:', error);
      setAddressError('Error calculating distance. Please try again.');
    } finally {
      setIsCalculatingDistance(false);
      setIsCalculating(false);
    }
  };

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const subtotal = cart.totalPrice || 0;
  const freeDeliveryThreshold = DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD;
  const qualifiesForFreeDelivery = subtotal >= freeDeliveryThreshold;
  const finalDeliveryFee = (deliveryMethod === 'delivery' && !qualifiesForFreeDelivery && distance !== null) ? deliveryFee : 0;
  const finalTotal = subtotal + finalDeliveryFee;

  const isCheckoutEnabled = () => {
    if (cart.cartItems?.length === 0) return false;
    if (deliveryMethod === 'pickup') return true;
    return isAddressValid && distance !== null && !isCalculatingDistance;
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#F3F5F0] p-6 sm:p-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading cart...</p>
        </div>
      </main>
    );
  }

  const cartItems = cart.cartItems || [];

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F3F5F0] p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2F5D50] mb-6">Your Cart</h1>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600 mb-4">Your cart is empty 🛒</p>
          <Link href="/menu" className="inline-block bg-[#2F5D50] text-white px-4 py-2 rounded-lg font-semibold transition">
            Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F5F0] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2F5D50] mb-6">
          Your Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
        </h1>

        {/* Delivery/Pickup Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#2F5D50] mb-4">Choose Delivery Method</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => {
                setDeliveryMethod('pickup');
                setIsAddressValid(true);
                setAddressError('');
              }}
              className={`p-4 rounded-xl border-2 transition-all ${deliveryMethod === 'pickup' ? 'border-[#2F5D50] bg-[#2F5D50]/5' : 'border-gray-200 hover:border-[#2F5D50]/30'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${deliveryMethod === 'pickup' ? 'bg-[#2F5D50] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Store size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Pickup</h3>
                  <p className="text-sm text-gray-500">Free • Collect at our farm</p>
                  <p className="text-xs text-gray-400 mt-1">Uitsig Wine Farm, Cape Town</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setDeliveryMethod('delivery')}
              className={`p-4 rounded-xl border-2 transition-all ${deliveryMethod === 'delivery' ? 'border-[#2F5D50] bg-[#2F5D50]/5' : 'border-gray-200 hover:border-[#2F5D50]/30'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${deliveryMethod === 'delivery' ? 'bg-[#2F5D50] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  <Truck size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Delivery</h3>
                  <p className="text-sm text-gray-500">{qualifiesForFreeDelivery ? 'FREE delivery' : distance ? `R${deliveryFee} • ${distance.toFixed(1)}km` : 'Enter address for quote'}</p>
                </div>
              </div>
            </button>
          </div>

          {deliveryMethod === 'delivery' && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-[#2F5D50]" />
                <h3 className="font-semibold text-gray-900">Delivery Address</h3>
              </div>

              <AddressAutocomplete onAddressSelect={handleAddressSelect} placeholder="Start typing your address in Cape Town..." initialValue={deliveryAddress} />

              {isCalculating && (
                <div className="mt-4 flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2F5D50]"></div>
                  <span className="text-sm">Calculating distance...</span>
                </div>
              )}

              {isAddressValid && distance !== null && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-green-800">Address Verified!</p>
                      <div className="flex flex-wrap justify-between items-center mt-2 gap-4">
                        <div><p className="text-sm text-gray-600">Distance from restaurant</p><p className="text-xl font-bold text-[#2F5D50]">{distance.toFixed(1)} km</p></div>
                        <div className="text-right"><p className="text-sm text-gray-600">Delivery Fee</p><p className="text-xl font-bold text-[#2F5D50]">{qualifiesForFreeDelivery ? 'FREE' : `R${deliveryFee}`}</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {addressError && (<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"><p className="text-sm text-red-600">{addressError}</p></div>)}
            </div>
          )}

          {deliveryMethod === 'pickup' && (
            <div className="border-t pt-6">
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-bold text-[#2F5D50] mb-2">Pickup Location</h4>
                <p className="text-sm text-gray-600"><strong>Uitsig Wine Farm</strong><br />Spaanschemat River Rd, Fir Grove<br />Cape Town, 7806</p>
                <p className="text-xs text-gray-500 mt-2">Your order will be ready for pickup at the restaurant.</p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item: any) => {
            const addOnsList = item.addOns || [];
            const addOnsTotal = addOnsList.reduce((sum: number, addOn: any) => sum + ((addOn.price || 0) * (addOn.quantity || 1)), 0);
            const friesPrice = item.friesUpsell?.price || item.fries?.price || 0;
            const juicePrice = item.juiceUpsell?.price || item.juice?.price || 0;
            const itemBasePrice = (item.price || 0) * (item.quantity || 1);
            const itemExtrasTotal = (addOnsTotal + friesPrice + juicePrice) * (item.quantity || 1);
            const itemTotal = itemBasePrice + itemExtrasTotal;
            const hasExtras = addOnsList.length > 0 || item.friesUpsell || item.juiceUpsell;
            const isExpanded = expandedItems[item.id];

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-4 flex flex-col sm:flex-row gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 mx-auto sm:mx-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image && !imageErrors[item.id] ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" onError={() => handleImageError(item.id)} unoptimized />
                    ) : (<div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">🍽️</div>)}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div><h2 className="text-lg font-bold text-[#2F5D50]">{item.name}</h2><p className="text-sm text-gray-500">R{(item.price || 0).toFixed(2)} each</p></div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button onClick={() => cart.updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))} className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center" disabled={item.quantity <= 1}><Minus size={14} /></button>
                        <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                        <button onClick={() => cart.updateQuantity(item.id, (item.quantity || 1) + 1)} className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"><Plus size={14} /></button>
                      </div>
                    </div>

                    {hasExtras && !isExpanded && (
                      <div onClick={() => toggleExpandItem(item.id)} className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 cursor-pointer hover:underline">
                        <span>Show extras ({addOnsList.length + (item.friesUpsell ? 1 : 0) + (item.juiceUpsell ? 1 : 0)})</span><span>▼</span>
                      </div>
                    )}

                    {item.specialInstructions && (<p className="text-sm italic text-gray-500 mt-2">📝 "{item.specialInstructions}"</p>)}

                    <div className="flex items-center gap-3 mt-3">
                      {hasExtras && (<button onClick={() => toggleExpandItem(item.id)} className="text-sm text-green-600 hover:underline flex items-center gap-1">{isExpanded ? 'Hide Extras' : 'Customize'}</button>)}
                      <button onClick={() => cart.removeFromCart(item.id)} className="text-sm text-red-500 hover:underline flex items-center gap-1"><Trash2 size={14} /> Remove Item</button>
                    </div>
                  </div>

                  <div className="text-right sm:w-32 flex-shrink-0">
                    <p className="text-lg font-bold text-[#2F5D50]">R{itemTotal.toFixed(2)}</p>
                    {itemExtrasTotal > 0 && (<p className="text-xs text-gray-500">Base: R{itemBasePrice.toFixed(2)}<br />Extras: +R{itemExtrasTotal.toFixed(2)}</p>)}
                  </div>
                </div>

                {isExpanded && hasExtras && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-700">Customize Your Order</h3>
                      <button onClick={() => cart.clearAddOns(item.id)} className="text-sm text-red-500 hover:underline flex items-center gap-1"><X size={14} /> Clear all extras</button>
                    </div>
                    
                    {/* Add-ons */}
                    {addOnsList.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Add-ons</h4>
                        <div className="space-y-2">
                          {addOnsList.map((addOn: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg">
                              <div><p className="font-medium text-gray-800">{addOn.name}</p><p className="text-xs text-green-600">+R{addOn.price?.toFixed(2) || '0.00'} each</p></div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => cart.updateAddOnQuantity(item.id, idx, (addOn.quantity || 1) - 1)} className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center" disabled={(addOn.quantity || 1) <= 1}><Minus size={12} /></button>
                                <span className="w-6 text-center font-medium">{addOn.quantity || 1}</span>
                                <button onClick={() => cart.updateAddOnQuantity(item.id, idx, (addOn.quantity || 1) + 1)} className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center"><Plus size={12} /></button>
                                <button onClick={() => cart.removeAddOn(item.id, idx)} className="text-red-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fries */}
                    {item.friesUpsell && (
                      <div className="mb-3 p-2 bg-white rounded-lg">
                        <div className="flex items-center justify-between">
                          <div><p className="font-medium text-gray-800">🍟 {item.friesUpsell.name}</p><p className="text-xs text-green-600">+R{item.friesUpsell.price?.toFixed(2)}</p></div>
                          <button onClick={() => cart.updateItemDetails(item.id, { friesUpsell: null })} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    )}

                    {/* Juice */}
                    {item.juiceUpsell && (
                      <div className="p-2 bg-white rounded-lg">
                        <div className="flex items-center justify-between">
                          <div><p className="font-medium text-gray-800">🥤 {item.juiceUpsell.name} {item.juiceUpsell.size && `(${item.juiceUpsell.size})`}</p><p className="text-xs text-green-600">+R{item.juiceUpsell.price?.toFixed(2)}</p></div>
                          <button onClick={() => cart.updateItemDetails(item.id, { juiceUpsell: null })} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-[#2F5D50] mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-medium">R {subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery Method</span><span className="font-medium capitalize">{deliveryMethod}</span></div>
              {deliveryMethod === 'delivery' && distance !== null && (<div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span className={qualifiesForFreeDelivery ? 'text-green-600 font-medium' : ''}>{qualifiesForFreeDelivery ? 'FREE' : `R ${deliveryFee.toFixed(2)}`}</span></div>)}
              {deliveryMethod === 'delivery' && !qualifiesForFreeDelivery && subtotal > 0 && (<div className="mt-2 p-3 bg-blue-50 rounded-lg"><div className="flex justify-between text-sm text-blue-800 mb-1"><span>Free delivery over R850</span><span className="font-bold">R{(850 - subtotal).toFixed(2)} more</span></div><div className="w-full bg-blue-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, (subtotal / 850) * 100)}%` }} /></div></div>)}
              <div className="flex justify-between items-center text-xl font-bold text-[#2F5D50] border-t pt-3"><span>Total</span><span>R {finalTotal.toFixed(2)}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cart.clearCart} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition">Clear Cart</button>
              <Link href={isCheckoutEnabled() ? "/checkout" : "#"} onClick={(e) => { if (!isCheckoutEnabled()) { e.preventDefault(); if (deliveryMethod === 'delivery' && !isAddressValid) { setAddressError('Please enter a valid delivery address within 50km'); } } }} className={`flex-1 text-white py-3 px-4 rounded-lg font-medium transition text-center ${isCheckoutEnabled() ? 'bg-[#2F5D50] hover:bg-[#244a3f] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}>Proceed to Checkout →</Link>
            </div>
            {deliveryMethod === 'pickup' && (<p className="text-sm text-center text-gray-500 mt-4">🏪 Your order will be ready for pickup at Uitsig Wine Farm. We'll notify you when it's ready.</p>)}
            {deliveryMethod === 'delivery' && !isAddressValid && !isCalculatingDistance && (<p className="text-sm text-center text-amber-600 mt-4">📍 Please enter a valid delivery address to proceed</p>)}
          </div>
        </div>
      </div>
    </main>
  );
}
