"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, X, MapPin, Truck, Store, Navigation, AlertCircle } from "lucide-react";
import { useDeliveryCalculation } from "@/hooks/useDeliveryCalculation";
import { mapsLoader, RESTAURANT_COORDS, RESTAURANT_ADDRESS } from "@/lib/googleMaps";

export default function CartPage() {
  const router = useRouter();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // Delivery/Pickup state
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery' | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [deliveryError, setDeliveryError] = useState('');

  // Use the delivery calculation hook
  const { deliveryInfo, calculateFromAddress, calculateFromCoordinates, resetDeliveryInfo } = useDeliveryCalculation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const updateAddOnQuantity = (itemId: string, addOnIndex: number, newQuantity: number) => {
    const item = cart.cartItems?.find(i => i.id === itemId);
    if (!item || !item.addOns) return;

    const updatedAddOns = [...item.addOns];
    if (newQuantity <= 0) {
      updatedAddOns.splice(addOnIndex, 1);
    } else {
      updatedAddOns[addOnIndex] = {
        ...updatedAddOns[addOnIndex],
        quantity: newQuantity
      };
    }

    cart.updateItemDetails(itemId, { addOns: updatedAddOns });
  };

  const removeAddOn = (itemId: string, addOnIndex: number) => {
    const item = cart.cartItems?.find(i => i.id === itemId);
    if (!item || !item.addOns) return;

    const updatedAddOns = item.addOns.filter((_, idx) => idx !== addOnIndex);
    cart.updateItemDetails(itemId, { addOns: updatedAddOns });
  };

  const clearAddOns = (itemId: string) => {
    cart.updateItemDetails(itemId, { addOns: [] });
  };

  // Validate delivery selection before checkout
  const validateDeliverySelection = (): boolean => {
    setDeliveryError('');
    
    if (!deliveryMethod) {
      setDeliveryError('Please select a delivery method (Pickup or Delivery)');
      return false;
    }

    if (deliveryMethod === 'delivery') {
      if (!deliveryAddress || deliveryAddress.length < 10) {
        setDeliveryError('Please enter a valid delivery address');
        return false;
      }
      if (!deliveryInfo.addressValid) {
        setDeliveryError('Please wait for address validation or enter a valid address');
        return false;
      }
      if (deliveryInfo.isLoading) {
        setDeliveryError('Please wait while we calculate your delivery fee');
        return false;
      }
    }

    return true;
  };

  // Handle checkout with validation
  const handleCheckout = () => {
    if (!validateDeliverySelection()) {
      // Scroll to delivery section
      document.getElementById('delivery-selection')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Proceed to checkout with selected method
    router.push('/checkout');
  };

  // Get user's current location with Google Maps
  const getCurrentLocation = () => {
    setIsCalculatingDistance(true);
    setAddressError('');
    setDeliveryError('');
    
    if (!navigator.geolocation) {
      setAddressError('Geolocation is not supported by your browser');
      setIsCalculatingDistance(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUseCurrentLocation(true);
        
        // Calculate delivery using Google Maps
        await calculateFromCoordinates(coords, cart.totalPrice || 0);
        
        // Reverse geocode to get address using Google Maps
        try {
          await mapsLoader.load();
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setDeliveryAddress(results[0].formatted_address);
            }
            setIsCalculatingDistance(false);
          });
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setIsCalculatingDistance(false);
        }
        
        setLocationPermission('granted');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setAddressError('Unable to get your location. Please enter your address manually.');
        setLocationPermission('denied');
        setIsCalculatingDistance(false);
      }
    );
  };

  // Manual address input with Google Maps
  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setDeliveryAddress(address);
    setUseCurrentLocation(false);
    resetDeliveryInfo();
    setDeliveryError('');
    
    if (address.length > 10) {
      setIsCalculatingDistance(true);
      setAddressError('');
      
      try {
        await calculateFromAddress(address, cart.totalPrice || 0);
      } catch (error) {
        console.error('Error calculating delivery:', error);
        setAddressError('Error calculating delivery distance.');
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

  // Calculate final total based on delivery method and delivery info
  const finalDeliveryFee = (deliveryMethod === 'delivery' && !qualifiesForFreeDelivery && deliveryInfo.distanceKm) 
    ? deliveryInfo.deliveryFee 
    : 0;
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

        {/* Required Delivery/Pickup Selection */}
        <div id="delivery-selection" className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-transparent relative">
          {/* Required indicator */}
          <div className="absolute -top-3 left-6 bg-[#2F5D50] text-white px-3 py-1 rounded-full text-xs font-bold">
            Required
          </div>
          
          <h2 className="text-xl font-bold text-[#2F5D50] mb-6 mt-2">Choose Your Delivery Method</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => {
                setDeliveryMethod('pickup');
                setDeliveryError('');
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                deliveryMethod === 'pickup'
                  ? 'border-[#2F5D50] bg-[#2F5D50]/5 ring-2 ring-[#2F5D50]/20'
                  : 'border-gray-200 hover:border-[#2F5D50]/30 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  deliveryMethod === 'pickup' ? 'bg-[#2F5D50] text-white scale-110' : 'bg-gray-100 text-gray-600'
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
              onClick={() => {
                setDeliveryMethod('delivery');
                setDeliveryError('');
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                deliveryMethod === 'delivery'
                  ? 'border-[#2F5D50] bg-[#2F5D50]/5 ring-2 ring-[#2F5D50]/20'
                  : 'border-gray-200 hover:border-[#2F5D50]/30 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  deliveryMethod === 'delivery' ? 'bg-[#2F5D50] text-white scale-110' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Truck size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Delivery</h3>
                  <p className="text-sm text-gray-500">
                    {qualifiesForFreeDelivery 
                      ? 'FREE delivery'
                      : deliveryInfo.distanceKm 
                        ? `R${deliveryInfo.deliveryFee} • ${deliveryInfo.distanceText}`
                        : 'Enter address for quote'
                    }
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Error message for missing delivery method */}
          {deliveryError && deliveryError.includes('delivery method') && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{deliveryError}</p>
            </div>
          )}

          {/* Delivery Address Input - Only shown when delivery is selected */}
          {deliveryMethod === 'delivery' && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-[#2F5D50]" />
                <h3 className="font-semibold text-gray-900">Delivery Address</h3>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full ml-2">Required</span>
              </div>

              {/* Current Location Button */}
              {!useCurrentLocation && (
                <button
                  onClick={getCurrentLocation}
                  disabled={deliveryInfo.isLoading}
                  className="mb-4 flex items-center gap-2 text-[#2F5D50] hover:text-[#1a3a30] transition text-sm font-medium"
                >
                  <Navigation size={16} />
                  <span>Use my current location</span>
                </button>
              )}

              {/* Address Input */}
              <div className="relative">
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={handleAddressChange}
                  placeholder="Enter your delivery address in Cape Town"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#2F5D50] focus:border-transparent pr-24 ${
                    addressError || (deliveryError && deliveryError.includes('address')) 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  disabled={deliveryInfo.isLoading}
                />
                
                {deliveryInfo.isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2F5D50]"></div>
                  </div>
                )}
              </div>

              {/* Address validation error */}
              {addressError && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {addressError}
                </p>
              )}

              {/* Distance and Fee Info */}
              {deliveryInfo.addressValid && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Driving distance</p>
                      <p className="text-xl font-bold text-[#2F5D50]">
                        {deliveryInfo.distanceText || `${deliveryInfo.distanceKm?.toFixed(1)} km`}
                      </p>
                      {deliveryInfo.durationText && (
                        <p className="text-xs text-gray-500">Est. time: {deliveryInfo.durationText}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Delivery Fee</p>
                      <p className="text-xl font-bold text-[#2F5D50]">
                        {qualifiesForFreeDelivery ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `R${deliveryInfo.deliveryFee}`
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Fee Breakdown */}
                  {!qualifiesForFreeDelivery && deliveryInfo.distanceKm && (
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Base rate (first 5km): R35</p>
                      {deliveryInfo.distanceKm > 5 && (
                        <p>Extra {Math.ceil(deliveryInfo.distanceKm - 5)}km: R{deliveryInfo.deliveryFee - 35}</p>
                      )}
                    </div>
                  )}

                  {/* Free delivery message */}
                  {qualifiesForFreeDelivery && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      🎉 Your order qualifies for free delivery!
                    </p>
                  )}
                </div>
              )}

              {/* Error message for address validation */}
              {deliveryError && deliveryError.includes('address') && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {deliveryError}
                </p>
              )}
            </div>
          )}

          {/* Pickup Info - Only shown when pickup is selected */}
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
                  Your order will be ready for pickup at the restaurant. We'll notify you when it's ready.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => {
            // Calculate detailed pricing
            const addOnsTotal = item.addOns?.reduce((sum, addOn) => 
              sum + ((addOn.price || 0) * (addOn.quantity || 1)), 0) || 0;
            const friesPrice = item.fries?.price || item.friesUpsell?.price || 0;
            const juicePrice = item.juice?.price || item.juiceUpsell?.price || 0;
            const baseExtra = item.baseExtra || 0;
            
            const itemBasePrice = item.price * item.quantity;
            const itemExtrasTotal = (addOnsTotal + friesPrice + juicePrice + baseExtra) * item.quantity;
            const itemTotal = itemBasePrice + itemExtrasTotal;

            const hasAddOns = item.addOns && item.addOns.length > 0;
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
                        <p className="text-sm text-gray-500">R{item.price.toFixed(2)} each</p>
                      </div>
                      
                      {/* Item Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Base and Dressing */}
                    <div className="mt-2 space-y-1">
                      {item.base && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Base:</span> {item.base}
                        </p>
                      )}
                      {item.dressing && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Dressing:</span> {item.dressing}
                        </p>
                      )}
                    </div>

                    {/* Add-ons Summary (when collapsed) */}
                    {hasAddOns && !isExpanded && (
                      <div 
                        onClick={() => toggleExpandItem(item.id)}
                        className="mt-2 inline-flex items-center gap-1 text-sm text-green-600 cursor-pointer hover:underline"
                      >
                        <span>{item.addOns.length} add-on{item.addOns.length > 1 ? 's' : ''}</span>
                        <span>▼</span>
                      </div>
                    )}

                    {/* Fries & Juice */}
                    {item.fries && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Fries:</span> {item.fries.name} 
                        <span className="text-green-600 ml-1">(+R{item.fries.price?.toFixed(2)})</span>
                      </p>
                    )}
                    {item.juice && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Juice:</span> {item.juice.option?.name || item.juice.name} 
                        {item.juice.size && ` (${item.juice.size})`}
                        <span className="text-green-600 ml-1">(+R{item.juice.price?.toFixed(2) || item.juice.option?.price.toFixed(2)})</span>
                      </p>
                    )}

                    {/* Special Instructions */}
                    {item.specialInstructions && (
                      <p className="text-sm italic text-gray-500 mt-2">
                        📝 "{item.specialInstructions}"
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
                        onClick={() => clearAddOns(item.id)}
                        className="text-sm text-red-500 hover:underline flex items-center gap-1"
                      >
                        <X size={14} />
                        Clear all add-ons
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {item.addOns.map((addOn, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{addOn.name}</p>
                            <p className="text-sm text-green-600">+R{addOn.price?.toFixed(2) || '0.00'} each</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {/* Add-on Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateAddOnQuantity(item.id, idx, (addOn.quantity || 1) - 1)}
                                className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                                disabled={(addOn.quantity || 1) <= 1}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center font-medium">{addOn.quantity || 1}</span>
                              <button
                                onClick={() => updateAddOnQuantity(item.id, idx, (addOn.quantity || 1) + 1)}
                                className="w-7 h-7 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            
                            {/* Remove Add-on */}
                            <button
                              onClick={() => removeAddOn(item.id, idx)}
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
              
              {deliveryMethod && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Method</span>
                  <span className="font-medium capitalize">{deliveryMethod}</span>
                </div>
              )}

              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className={qualifiesForFreeDelivery ? 'text-green-600 font-medium' : ''}>
                    {qualifiesForFreeDelivery 
                      ? 'FREE' 
                      : deliveryInfo.distanceKm 
                        ? `R ${deliveryInfo.deliveryFee.toFixed(2)}` 
                        : 'To be calculated'
                    }
                  </span>
                </div>
              )}

              {/* Free delivery progress for delivery method */}
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

            {/* Checkout Button with Validation */}
            <button
              onClick={handleCheckout}
              className="w-full bg-[#2F5D50] hover:bg-[#244a3f] text-white py-3 px-4 rounded-lg font-medium transition text-center"
            >
              Proceed to Checkout →
            </button>

            {/* Validation Message */}
            {(!deliveryMethod || (deliveryMethod === 'delivery' && !deliveryInfo.addressValid)) && (
              <p className="text-sm text-center text-amber-600 mt-3 flex items-center justify-center gap-1">
                <AlertCircle size={14} />
                Please select a delivery method and complete required fields to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}