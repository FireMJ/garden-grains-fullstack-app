"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { 
  Minus, 
  Plus, 
  Trash2, 
  MapPin, 
  Truck, 
  Store, 
  CheckCircle, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp,
  Coffee,
  Milk,
  EggFried,
  UtensilsCrossed,
  Salad,
  Apple,
  Sparkles
} from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { getDrivingDistance, RESTAURANT_COORDS, DELIVERY_CONFIG, isValidCapeTownAddress } from "@/lib/googleMaps";

// Helper to get add-on icon
const getAddOnIcon = (name: string) => {
  const lowerName = name?.toLowerCase() || '';
  if (lowerName.includes('cheese')) return <Sparkles size={14} className="text-yellow-600" />;
  if (lowerName.includes('egg')) return <EggFried size={14} className="text-orange-500" />;
  if (lowerName.includes('bacon')) return <UtensilsCrossed size={14} className="text-red-600" />;
  if (lowerName.includes('milk') || lowerName.includes('cream')) return <Milk size={14} className="text-blue-500" />;
  if (lowerName.includes('salad') || lowerName.includes('lettuce')) return <Salad size={14} className="text-green-600" />;
  if (lowerName.includes('fruit') || lowerName.includes('berry')) return <Apple size={14} className="text-red-500" />;
  return <Coffee size={14} className="text-gray-500" />;
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
  const [isAddressValid, setIsAddressValid] = useState(false);

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
    if (!isValidCapeTownAddress(selectedAddress.coordinates.lat, selectedAddress.coordinates.lng)) {
      setAddressError("Please select an address in Cape Town, South Africa");
      return;
    }
    
    setDeliveryAddress(selectedAddress.formattedAddress);
    setDeliveryCoordinates(selectedAddress.coordinates);
    setIsCalculatingDistance(true);
    setAddressError('');
    setIsAddressValid(false);

    try {
      const result = await getDrivingDistance(selectedAddress.coordinates, RESTAURANT_COORDS);
      if (result?.distance) {
        setDistance(result.distance);
        if (result.distance <= DELIVERY_CONFIG.MAX_DISTANCE_KM) {
          setIsAddressValid(true);
        } else {
          setAddressError(`Location is ${result.distance.toFixed(1)} km away. Maximum is ${DELIVERY_CONFIG.MAX_DISTANCE_KM} km.`);
        }
      } else {
        setAddressError('Could not calculate distance');
      }
    } catch (error) {
      setAddressError('Error calculating distance');
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Calculate item total including add-ons with safe fallbacks
  const getItemTotal = (item: any) => {
    const price = item?.price || 0;
    const quantity = item?.quantity || 1;
    let total = price * quantity;
    
    if (item?.addOns && item.addOns.length > 0) {
      const addOnsTotal = item.addOns.reduce((sum: number, addon: any) => {
        const addonPrice = addon?.price || 0;
        const addonQty = addon?.quantity || 1;
        return sum + (addonPrice * addonQty);
      }, 0);
      total += addOnsTotal;
    }
    return total;
  };

  // Safe price formatter
  const formatPrice = (price: number | undefined | null) => {
    if (typeof price !== 'number' || isNaN(price)) return '0.00';
    return price.toFixed(2);
  };

  const subtotal = cart.totalPrice || 0;
  const qualifiesForFreeDelivery = subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD;
  const finalDeliveryFee = (deliveryMethod === 'delivery' && !qualifiesForFreeDelivery && distance !== null) ? deliveryFee : 0;
  const finalTotal = subtotal + finalDeliveryFee;

  const isCheckoutEnabled = () => {
    if (cart.cartItems?.length === 0) return false;
    if (deliveryMethod === 'delivery') return isAddressValid && deliveryCoordinates !== null;
    return true;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-gray-500 mb-8">Review your order and proceed to checkout</p>
        
        {!cart.cartItems || cart.cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/menu" className="inline-flex items-center gap-2 bg-[#2F5D50] text-white px-6 py-3 rounded-lg hover:bg-[#23483E] transition-all shadow-md">
              Browse Our Menu
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.cartItems.map((item) => {
                const itemPrice = item?.price || 0;
                const itemName = item?.name || 'Unknown Item';
                const itemId = item?.id || `item-${Math.random()}`;
                
                return (
                  <div key={itemId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-5">
                      <div className="flex gap-4">
                        {/* Item Image */}
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                          {!imageErrors[itemId] && item?.image ? (
                            <Image src={item.image} alt={itemName} fill className="object-cover" onError={() => handleImageError(itemId)} unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                              <span className="text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{itemName}</h3>
                              <p className="text-gray-500 text-sm">R {formatPrice(itemPrice)} each</p>
                            </div>
                            <button onClick={() => cart.removeFromCart(itemId)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          {/* ADD-ONS SECTION */}
                          {item?.addOns && item.addOns.length > 0 && (
                            <div className="mt-3">
                              <button
                                onClick={() => toggleExpandItem(itemId)}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2F5D50] transition-colors"
                              >
                                {expandedItems[itemId] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                <span>Extras & Add-ons ({item.addOns.length})</span>
                              </button>
                              
                              {expandedItems[itemId] && (
                                <div className="mt-2 pl-2 border-l-2 border-[#2F5D50] space-y-2">
                                  {item.addOns.map((addon: any) => {
                                    const addonPrice = addon?.price || 0;
                                    const addonName = addon?.name || 'Unknown';
                                    const addonQty = addon?.quantity || 1;
                                    return (
                                      <div key={addon?.id || Math.random()} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                          {getAddOnIcon(addonName)}
                                          <span className="text-gray-700">{addonName}</span>
                                          {addonQty > 1 && (
                                            <span className="text-xs text-gray-400">x{addonQty}</span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="text-green-600 font-medium">
                                            +R {formatPrice(addonPrice * addonQty)}
                                          </span>
                                          <div className="flex items-center gap-1">
                                            <button
                                              onClick={() => cart.updateAddOnQuantity?.(itemId, addon.id, addonQty - 1)}
                                              className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50] hover:text-[#2F5D50]"
                                            >
                                              <Minus size={10} />
                                            </button>
                                            <span className="text-xs w-4 text-center">{addonQty}</span>
                                            <button
                                              onClick={() => cart.updateAddOnQuantity?.(itemId, addon.id, addonQty + 1)}
                                              className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50] hover:text-[#2F5D50]"
                                            >
                                              <Plus size={10} />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Special Instructions */}
                          {item?.specialInstructions && (
                            <div className="mt-3 pt-2">
                              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                <span className="font-medium text-gray-700">📝 Special Instructions:</span>
                                <p className="text-gray-600 mt-0.5">{item.specialInstructions}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3 pt-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => cart.updateQuantity(itemId, (item?.quantity || 1) - 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50] hover:text-[#2F5D50] transition-all"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-medium text-gray-700 min-w-[20px] text-center">{item?.quantity || 1}</span>
                              <button
                                onClick={() => cart.updateQuantity(itemId, (item?.quantity || 1) + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50] hover:text-[#2F5D50] transition-all"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="font-bold text-gray-900">
                              R {formatPrice(getItemTotal(item))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">R {formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex gap-4 mb-4">
                      <button onClick={() => setDeliveryMethod('pickup')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all ${deliveryMethod === 'pickup' ? 'border-[#2F5D50] bg-[#2F5D50]/5 text-[#2F5D50] shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        <Store size={18} /><span className="text-sm font-medium">Pickup</span>
                      </button>
                      <button onClick={() => setDeliveryMethod('delivery')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all ${deliveryMethod === 'delivery' ? 'border-[#2F5D50] bg-[#2F5D50]/5 text-[#2F5D50] shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        <Truck size={18} /><span className="text-sm font-medium">Delivery</span>
                      </button>
                    </div>
                    
                    {deliveryMethod === 'delivery' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={18} className="text-[#2F5D50]" />
                          <h3 className="font-semibold text-gray-900">Delivery Address</h3>
                        </div>
                        
                        <AddressAutocomplete onAddressSelect={handleAddressSelect} placeholder="Start typing your Cape Town address..." initialValue={deliveryAddress} />
                        
                        {isCalculatingDistance && (
                          <div className="mt-3 flex items-center gap-2 text-gray-500 bg-gray-50 p-3 rounded-xl">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2F5D50]"></div>
                            <span className="text-sm">Calculating distance...</span>
                          </div>
                        )}
                        
                        {addressError && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm text-red-600">{addressError}</p>
                          </div>
                        )}
                        
                        {isAddressValid && distance !== null && (
                          <div className="mt-3 p-4 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle size={16} className="text-green-600" />
                              <span className="text-sm font-medium text-green-700">Delivery Available</span>
                            </div>
                            <p className="text-xs text-green-600">Distance: {distance.toFixed(1)} km • Est. delivery: 30-45 min</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {deliveryMethod === 'delivery' && !qualifiesForFreeDelivery && distance !== null && (
                    <div className="flex justify-between text-gray-600 pt-2">
                      <span>Delivery Fee</span>
                      <span className="font-medium">R {formatPrice(finalDeliveryFee)}</span>
                    </div>
                  )}
                  
                  {qualifiesForFreeDelivery && deliveryMethod === 'delivery' && (
                    <div className="flex justify-between text-green-600 pt-2">
                      <span>Free Delivery</span>
                      <span className="font-medium">✓</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>R {formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <button disabled={!isCheckoutEnabled()} className={`w-full py-3.5 rounded-xl font-semibold transition-all shadow-md ${isCheckoutEnabled() ? 'bg-[#2F5D50] text-white hover:bg-[#23483E] hover:shadow-lg cursor-pointer' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>
                    Proceed to Checkout
                  </button>
                </Link>
                
                <Link href="/menu" className="block text-center text-sm text-[#2F5D50] hover:underline mt-4 transition-all">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
