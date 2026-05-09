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
  Sparkles,
  Frown
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
          setAddressError(`Address is ${result.distance.toFixed(1)}km away. Maximum delivery distance is ${DELIVERY_CONFIG.MAX_DISTANCE_KM}km.`);
        }
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      setAddressError("Could not calculate distance. Please try another address.");
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={64} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/menu" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition inline-block">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex p-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image && !imageErrors[item.id] ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center">
                        <UtensilsCrossed size={32} className="text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.category || 'Item'}</p>
                      </div>
                      <button
                        onClick={() => cart.removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Price per item */}
                    <div className="mt-2">
                      <span className="text-lg font-bold text-green-600">R{item.price}</span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Expand/Collapse button for extras */}
                    {(item.addOns?.length > 0 || item.fries || item.juice || item.specialInstructions) && (
                      <button
                        onClick={() => toggleExpandItem(item.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 mt-3"
                      >
                        {expandedItems[item.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {expandedItems[item.id] ? 'Hide' : 'Show'} Extras
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded extras section */}
                {expandedItems[item.id] && (
                  <div className="bg-gray-50 px-4 py-3 border-t space-y-2">
                    {/* Add-ons */}
                    {item.addOns && item.addOns.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Add-ons:</p>
                        {item.addOns.map((addon, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm pl-2">
                            <div className="flex items-center gap-1">
                              {getAddOnIcon(addon.name)}
                              <span>{addon.name}</span>
                              {addon.quantity > 1 && <span className="text-xs text-gray-500">(x{addon.quantity})</span>}
                            </div>
                            <span className="text-green-600">+R{(addon.price * addon.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fries */}
                    {item.fries && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Fries:</p>
                        <div className="pl-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.fries.name}</span>
                            <span className="text-green-600">+R{item.fries.price.toFixed(2)}</span>
                          </div>
                          {item.fries.dip && (
                            <div className="flex items-center justify-between text-sm pl-4">
                              <span className="text-gray-600">└ {item.fries.dip}</span>
                              {item.fries.dipPrice > 0 && <span className="text-green-600">+R{item.fries.dipPrice.toFixed(2)}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Juice */}
                    {item.juice && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Juice:</p>
                        <div className="pl-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.juice.name} ({item.juice.size})</span>
                            <span className="text-green-600">+R{item.juice.price.toFixed(2)}</span>
                          </div>
                          {item.juice.addOns && item.juice.addOns.length > 0 && (
                            <div className="pl-4 mt-1">
                              {item.juice.addOns.map((booster, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">└ + {booster.name}</span>
                                  <span className="text-green-600">+R{booster.price.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Special Instructions */}
                    {item.specialInstructions && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Special Instructions:</p>
                        <p className="text-sm text-gray-600 pl-2">{item.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Items subtotal */}
              <div className="space-y-2 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R{cart.totalPrice.toFixed(2)}</span>
                </div>
                {cart.totalPrice >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD && deliveryMethod === 'delivery' && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Free Delivery Available!</span>
                    <span>✓</span>
                  </div>
                )}
              </div>

              {/* Delivery Method */}
              <div className="mt-4 space-y-3">
                <h3 className="font-semibold text-gray-900">Delivery Method</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`flex-1 p-3 rounded-lg border-2 transition ${
                      deliveryMethod === 'pickup'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Store className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Pickup</span>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`flex-1 p-3 rounded-lg border-2 transition ${
                      deliveryMethod === 'delivery'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Truck className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Delivery</span>
                  </button>
                </div>

                {deliveryMethod === 'delivery' && (
                  <div className="mt-3">
                    <AddressAutocomplete onAddressSelect={handleAddressSelect} />
                    {isCalculatingDistance && (
                      <p className="text-sm text-gray-500 mt-2">Checking delivery availability...</p>
                    )}
                    {addressError && (
                      <p className="text-sm text-red-500 mt-2">{addressError}</p>
                    )}
                    {distance !== null && deliveryMethod === 'delivery' && !addressError && (
                      <div className="mt-2 text-sm">
                        <p className="text-gray-600">Distance: {distance.toFixed(1)} km</p>
                        <p className="text-gray-600">Delivery Fee: R{deliveryFee.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600">
                    R{(cart.totalPrice + (deliveryMethod === 'delivery' ? deliveryFee : 0)).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">VAT included</p>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <button
                  disabled={deliveryMethod === 'delivery' && (!isAddressValid || !deliveryAddress)}
                  className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                    deliveryMethod === 'delivery' && (!isAddressValid || !deliveryAddress)
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  Proceed to Checkout
                </button>
              </Link>

              {deliveryMethod === 'delivery' && (!isAddressValid || !deliveryAddress) && (
                <p className="text-xs text-red-500 text-center mt-2">
                  Please enter a valid delivery address within {DELIVERY_CONFIG.MAX_DISTANCE_KM}km of our restaurant
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
