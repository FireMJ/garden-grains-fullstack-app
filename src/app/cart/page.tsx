"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart, CartItem } from "@/context/CartContext";
import Link from "next/link";
import { Minus, Plus, Trash2, X, MapPin, Truck, Store, Navigation } from "lucide-react";

// Delivery calculation function
const calculateDeliveryFee = (distance: number): number => {
  const BASE_RATE = 35;
  const BASE_DISTANCE = 5;
  const EXTRA_RATE_PER_KM = 5;
  
  if (distance <= BASE_DISTANCE) {
    return BASE_RATE;
  } else {
    const extraDistance = distance - BASE_DISTANCE;
    return BASE_RATE + (extraDistance * EXTRA_RATE_PER_KM);
  }
};

const RESTAURANT_COORDS = {
  lat: -34.0,
  lng: 18.4167
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

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
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (distance !== null && deliveryMethod === 'delivery') {
      const fee = calculateDeliveryFee(distance);
      setDeliveryFee(fee);
    } else {
      setDeliveryFee(0);
    }
  }, [distance, deliveryMethod]);

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const getCurrentLocation = () => {
    setIsCalculatingDistance(true);
    setAddressError('');
    
    if (!navigator.geolocation) {
      setAddressError('Geolocation is not supported by your browser');
      setIsCalculatingDistance(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setDeliveryCoordinates(coords);
        setUseCurrentLocation(true);
        
        const dist = calculateDistance(
          RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng,
          coords.lat, coords.lng
        );
        setDistance(dist);
        
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`)
          .then(res => res.json())
          .then(data => {
            if (data.display_name) {
              setDeliveryAddress(data.display_name);
            }
          })
          .catch(err => console.error('Reverse geocoding error:', err))
          .finally(() => setIsCalculatingDistance(false));
      },
      (error) => {
        console.error('Geolocation error:', error);
        setAddressError('Unable to get your location. Please enter your address manually.');
        setIsCalculatingDistance(false);
      }
    );
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setDeliveryAddress(address);
    setUseCurrentLocation(false);
    
    if (address.length > 10) {
      setIsCalculatingDistance(true);
      setAddressError('');
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Cape Town, South Africa')}`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          const coords = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
          setDeliveryCoordinates(coords);
          
          const dist = calculateDistance(
            RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng,
            coords.lat, coords.lng
          );
          setDistance(dist);
        } else {
          setAddressError('Address not found. Please check and try again.');
          setDistance(null);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setAddressError('Error finding address. Please try again.');
        setDistance(null);
      } finally {
        setIsCalculatingDistance(false);
      }
    }
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
  const subtotal = cart.totalPrice || 0;
  const freeDeliveryThreshold = 850;
  const qualifiesForFreeDelivery = subtotal >= freeDeliveryThreshold;
  const finalDeliveryFee = (deliveryMethod === 'delivery' && !qualifiesForFreeDelivery) ? deliveryFee : 0;
  const finalTotal = subtotal + finalDeliveryFee;

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F3F5F0] p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2F5D50] mb-6">
          Your Cart
        </h1>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <p className="text-gray-600 mb-4">Your cart is empty 🛒</p>
          <Link
            href="/menu"
            className="inline-block bg-[#2F5D50] hover:bg-[#244a3f] text-white px-4 py-2 rounded-lg font-semibold transition"
          >
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
              onClick={() => setDeliveryMethod('pickup')}
              className={`p-4 rounded-xl border-2 transition-all ${
                deliveryMethod === 'pickup'
                  ? 'border-[#2F5D50] bg-[#2F5D50]/5'
                  : 'border-gray-200 hover:border-[#2F5D50]/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  deliveryMethod === 'pickup' ? 'bg-[#2F5D50] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
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
              className={`p-4 rounded-xl border-2 transition-all ${
                deliveryMethod === 'delivery'
                  ? 'border-[#2F5D50] bg-[#2F5D50]/5'
                  : 'border-gray-200 hover:border-[#2F5D50]/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  deliveryMethod === 'delivery' ? 'bg-[#2F5D50] text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Truck size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Delivery</h3>
                  <p className="text-sm text-gray-500">
                    {qualifiesForFreeDelivery 
                      ? 'FREE delivery'
                      : distance 
                        ? `R${deliveryFee} • ${distance.toFixed(1)}km`
                        : 'Enter address for quote'
                    }
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Delivery Address Input */}
          {deliveryMethod === 'delivery' && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-[#2F5D50]" />
                <h3 className="font-semibold text-gray-900">Delivery Address</h3>
              </div>

              {!useCurrentLocation && (
                <button
                  onClick={getCurrentLocation}
                  disabled={isCalculatingDistance}
                  className="mb-4 flex items-center gap-2 text-[#2F5D50] hover:text-[#1a3a30] transition text-sm font-medium"
                >
                  <Navigation size={16} />
                  <span>Use my current location</span>
                </button>
              )}

              <div className="relative">
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={handleAddressChange}
                  placeholder="Enter your delivery address in Cape Town"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent pr-24"
                  disabled={isCalculatingDistance}
                />
                
                {isCalculatingDistance && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2F5D50]"></div>
                  </div>
                )}
              </div>

              {distance !== null && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Distance from restaurant</p>
                      <p className="text-xl font-bold text-[#2F5D50]">{distance.toFixed(1)} km</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Delivery Fee</p>
                      <p className="text-xl font-bold text-[#2F5D50]">
                        {qualifiesForFreeDelivery ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `R${deliveryFee}`
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {!qualifiesForFreeDelivery && (
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Base rate (first 5km): R35</p>
                      {distance > 5 && (
                        <p>Extra {Math.ceil(distance - 5)}km: R{deliveryFee - 35}</p>
                      )}
                    </div>
                  )}

                  {qualifiesForFreeDelivery && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      🎉 Your order qualifies for free delivery!
                    </p>
                  )}
                </div>
              )}

              {addressError && (
                <p className="mt-2 text-sm text-red-500">{addressError}</p>
              )}
            </div>
          )}

          {/* Pickup Info */}
          {deliveryMethod === 'pickup' && (
            <div className="border-t pt-6">
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-bold text-[#2F5D50] mb-2">Pickup Location</h4>
                <p className="text-sm text-gray-600">
                  <strong>Uitsig Wine Farm</strong><br />
                  Spaanschemat River Rd, Fir Grove<br />
                  Cape Town, 7806
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Your order will be ready for pickup at the restaurant.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Items with Add-on Management */}
        <div className="space-y-4">
          {cartItems.map((item: CartItem) => {
            // Safely get add-ons (handles both old and new structure)
            const addOnsList = (item as any).addOns || (item as any).addOnsOld || [];
            
            // Calculate item total including add-ons
            const addOnsTotal = addOnsList.reduce((sum: number, addOn: any) => 
              sum + ((addOn.price || 0) * (addOn.quantity || 1)), 0);
            const friesPrice = (item as any).fries?.price || (item as any).friesOld?.price || 0;
            const juicePrice = (item as any).juice?.price || (item as any).juiceOld?.price || 0;
            const baseExtra = (item as any).baseExtra || 0;
            
            const itemBasePrice = (item.price || 0) * (item.quantity || 1);
            const itemExtrasTotal = (addOnsTotal + friesPrice + juicePrice + baseExtra) * (item.quantity || 1);
            const itemTotal = itemBasePrice + itemExtrasTotal;

            const hasAddOns = addOnsList.length > 0;
            const isExpanded = expandedItems[item.id];

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Main Item Row */}
                <div className="p-4 flex flex-col sm:flex-row gap-4">
                  {/* Item Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 mx-auto sm:mx-0 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image && !imageErrors[item.id] ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(item.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-[#2F5D50]">{item.name}</h2>
                        <p className="text-sm text-gray-500">R{(item.price || 0).toFixed(2)} each</p>
                      </div>
                      
                      {/* Item Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => cart.updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                        <button
                          onClick={() => cart.updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Base and Dressing */}
                    {(item as any).base && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Base:</span> {(item as any).base}
                      </p>
                    )}
                    {(item as any).dressing && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Dressing:</span> {(item as any).dressing}
                      </p>
                    )}

                    {/* Add-ons Summary (when collapsed) */}
                    {hasAddOns && !isExpanded && (
                      <div 
                        onClick={() => toggleExpandItem(item.id)}
                        className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 cursor-pointer hover:underline"
                      >
                        <span>{addOnsList.length} add-on{addOnsList.length > 1 ? 's' : ''}</span>
                        <span>▼</span>
                      </div>
                    )}

                    {/* Fries & Juice */}
                    {(item as any).fries && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Fries:</span> {(item as any).fries.name} 
                        <span className="text-green-600 ml-1">(+R{(item as any).fries.price?.toFixed(2)})</span>
                      </p>
                    )}
                    {(item as any).juice && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Juice:</span> {(item as any).juice.name} 
                        {(item as any).juice.size && ` (${(item as any).juice.size})`}
                        <span className="text-green-600 ml-1">(+R{(item as any).juice.price?.toFixed(2)})</span>
                      </p>
                    )}

                    {/* Special Instructions */}
                    {(item as any).specialInstructions && (
                      <p className="text-sm italic text-gray-500 mt-2">
                        📝 "{(item as any).specialInstructions}"
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-3">
                      {hasAddOns && (
                        <button
                          onClick={() => toggleExpandItem(item.id)}
                          className="text-sm text-green-600 hover:underline flex items-center gap-1"
                        >
                          {isExpanded ? 'Hide Add-ons' : 'Manage Add-ons'}
                        </button>
                      )}
                      <button
                        onClick={() => cart.removeFromCart(item.id)}
                        className="text-sm text-red-500 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Remove Item
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right sm:w-32 flex-shrink-0">
                    <p className="text-lg font-bold text-[#2F5D50]">
                      R{itemTotal.toFixed(2)}
                    </p>
                    {itemExtrasTotal > 0 && (
                      <p className="text-xs text-gray-500">
                        Base: R{itemBasePrice.toFixed(2)}<br />
                        Extras: +R{itemExtrasTotal.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Expanded Add-ons Section */}
                {isExpanded && hasAddOns && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-700">Customize Your Add-ons</h3>
                      <button
                        onClick={() => cart.clearAddOns(item.id)}
                        className="text-sm text-red-500 hover:underline flex items-center gap-1"
                      >
                        <X size={14} />
                        Clear all add-ons
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {addOnsList.map((addOn: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{addOn.name}</p>
                            <p className="text-sm text-green-600">+R{addOn.price?.toFixed(2) || '0.00'} each</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {/* Add-on Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => cart.updateAddOnQuantity(item.id, idx, (addOn.quantity || 1) - 1)}
                                className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                                disabled={(addOn.quantity || 1) <= 1}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center font-medium">{addOn.quantity || 1}</span>
                              <button
                                onClick={() => cart.updateAddOnQuantity(item.id, idx, (addOn.quantity || 1) + 1)}
                                className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            
                            {/* Remove Add-on */}
                            <button
                              onClick={() => cart.removeAddOn(item.id, idx)}
                              className="text-red-400 hover:text-red-600 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-[#2F5D50] mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">R {subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Delivery Method</span>
                <span className="font-medium capitalize">{deliveryMethod}</span>
              </div>

              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={qualifiesForFreeDelivery ? 'text-green-600 font-medium' : ''}>
                    {qualifiesForFreeDelivery 
                      ? 'FREE' 
                      : distance 
                        ? `R ${deliveryFee.toFixed(2)}` 
                        : 'To be calculated'
                    }
                  </span>
                </div>
              )}

              {deliveryMethod === 'delivery' && !qualifiesForFreeDelivery && subtotal > 0 && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between text-sm text-blue-800 mb-1">
                    <span>Free delivery over R850</span>
                    <span className="font-bold">R{(850 - subtotal).toFixed(2)} more</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / 850) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-xl font-bold text-[#2F5D50] border-t pt-3">
                <span>Total</span>
                <span>R {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cart.clearCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition"
              >
                Clear Cart
              </button>
              <Link
                href="/checkout"
                className="flex-1 bg-[#2F5D50] hover:bg-[#244a3f] text-white py-3 px-4 rounded-lg font-medium transition text-center"
              >
                Proceed to Checkout →
              </Link>
            </div>

            {deliveryMethod === 'pickup' && (
              <p className="text-sm text-center text-gray-500 mt-4">
                🏪 Your order will be ready for pickup at Uitsig Wine Farm. We'll notify you when it's ready.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
