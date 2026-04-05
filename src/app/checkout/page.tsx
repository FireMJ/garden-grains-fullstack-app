"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { usePayment } from "@/context/PaymentContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Truck, Store, AlertCircle } from "lucide-react";
import { useDeliveryCalculation } from "@/hooks/useDeliveryCalculation";
import { mapsLoader, RESTAURANT_COORDS, RESTAURANT_ADDRESS } from "@/lib/googleMaps";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const { user } = useAuth();
  const { processPayment, paymentLoading, testMode, environment } = usePayment();
  
  // Delivery/Pickup state
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [addressError, setAddressError] = useState('');
  
  // Use the delivery calculation hook
  const { deliveryInfo, calculateFromAddress, calculateFromCoordinates, resetDeliveryInfo } = useDeliveryCalculation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryInstructions: "",
    paymentMethod: "card",
    saveInfo: false
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cart.cartItems, router]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Get user's current location with Google Maps
  const getCurrentLocation = () => {
    setIsCalculatingDistance(true);
    setAddressError('');
    
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
        
        // Reverse geocode to get address
        try {
          await mapsLoader.load();
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setDeliveryAddress(results[0].formatted_address);
              // Auto-fill address fields
              const addressComponents = results[0].address_components;
              let city = '';
              let postalCode = '';
              
              addressComponents.forEach(component => {
                if (component.types.includes('locality')) {
                  city = component.long_name;
                }
                if (component.types.includes('postal_code')) {
                  postalCode = component.long_name;
                }
              });
              
              setFormData(prev => ({
                ...prev,
                address: results[0].formatted_address,
                city: city || prev.city,
                postalCode: postalCode || prev.postalCode
              }));
            }
            setIsCalculatingDistance(false);
          });
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setIsCalculatingDistance(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setAddressError('Unable to get your location. Please enter your address manually.');
        setIsCalculatingDistance(false);
      }
    );
  };

  // Manual address input
  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setDeliveryAddress(address);
    setUseCurrentLocation(false);
    resetDeliveryInfo();
    
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const calculateSubtotal = () => {
    return cart.totalPrice || 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const freeDeliveryThreshold = 850;
    const qualifiesForFreeDelivery = subtotal >= freeDeliveryThreshold;
    
    if (deliveryMethod === 'pickup') {
      return subtotal;
    } else {
      // Delivery fee
      const deliveryFee = qualifiesForFreeDelivery ? 0 : (deliveryInfo.deliveryFee || 35);
      return subtotal + deliveryFee;
    }
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone'];
    
    // Add address fields for delivery
    if (deliveryMethod === 'delivery') {
      required.push('address', 'city', 'postalCode');
      
      if (!deliveryInfo.addressValid) {
        alert('Please enter a valid delivery address and wait for distance calculation.');
        return false;
      }
    }
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const orderDetails = {
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        deliveryMethod,
        deliveryAddress: deliveryMethod === 'delivery' ? formData.address : undefined,
        deliveryCity: deliveryMethod === 'delivery' ? formData.city : undefined,
        deliveryPostalCode: deliveryMethod === 'delivery' ? formData.postalCode : undefined,
        deliveryInstructions: formData.deliveryInstructions,
        deliveryDistance: deliveryInfo.distanceKm,
        deliveryFee: deliveryMethod === 'delivery' ? deliveryInfo.deliveryFee : 0,
        items: cart.cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
      };

      const result = await processPayment(calculateTotal(), orderDetails);

      if (result.success && result.redirectUrl) {
        // Clear cart and redirect to payment gateway
        cart.clearCart();
        window.location.href = result.redirectUrl;
      } else {
        alert(result.error || "Payment processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <Link 
            href="/menu" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal();
  const freeDeliveryThreshold = 850;
  const qualifiesForFreeDelivery = subtotal >= freeDeliveryThreshold;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Test Mode Banner */}
        {testMode && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <div className="flex items-center">
              <span className="text-blue-600 mr-2">🧪</span>
              <div>
                <p className="text-blue-800 font-medium">Test Mode Active</p>
                <p className="text-sm text-blue-600">
                  Environment: {environment === 'sandbox' ? 'Sandbox (Virtual Cards)' : 'UAT (Real Test Cards)'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
              {/* Delivery/Pickup Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Store className={`w-6 h-6 ${deliveryMethod === 'pickup' ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">Pickup</h3>
                        <p className="text-sm text-gray-500">Free • Collect at our farm</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryMethod === 'delivery'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className={`w-6 h-6 ${deliveryMethod === 'delivery' ? 'text-green-600' : 'text-gray-400'}`} />
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
              </div>

              {/* Delivery Address Input */}
              {deliveryMethod === 'delivery' && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Delivery Address</h3>
                  </div>

                  {/* Current Location Button */}
                  {!useCurrentLocation && (
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={deliveryInfo.isLoading}
                      className="mb-4 flex items-center gap-2 text-green-600 hover:text-green-700 transition text-sm font-medium"
                    >
                      <span>📍</span>
                      <span>Use my current location</span>
                    </button>
                  )}

                  {/* Address Input */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={handleAddressChange}
                      placeholder="Enter your delivery address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={deliveryInfo.isLoading}
                    />
                    
                    {deliveryInfo.isLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                      </div>
                    )}
                  </div>

                  {/* Address Details */}
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal code"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Distance and Fee Info */}
                  {deliveryInfo.addressValid && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Driving distance</p>
                          <p className="text-xl font-bold text-green-600">
                            {deliveryInfo.distanceText || `${deliveryInfo.distanceKm?.toFixed(1)} km`}
                          </p>
                          {deliveryInfo.durationText && (
                            <p className="text-xs text-gray-500">Est. time: {deliveryInfo.durationText}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Delivery Fee</p>
                          <p className="text-xl font-bold text-green-600">
                            {qualifiesForFreeDelivery ? (
                              <span className="text-green-600">FREE</span>
                            ) : (
                              `R${deliveryInfo.deliveryFee}`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {addressError && (
                    <p className="mt-2 text-sm text-red-500">{addressError}</p>
                  )}
                </div>
              )}

              {/* Pickup Info */}
              {deliveryMethod === 'pickup' && (
                <div className="mb-8 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Pickup Location</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Uitsig Wine Farm</strong><br />
                    Spaanschemat River Rd, Fir Grove<br />
                    Cape Town, 7806
                  </p>
                </div>
              )}

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name *"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email *"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone *"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    placeholder="Delivery instructions (optional)"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-green-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Credit / Debit Card</span>
                      <p className="text-sm text-gray-500">Pay securely with your card</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-green-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="voda"
                      checked={formData.paymentMethod === 'voda'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900">VodaPay</span>
                      <p className="text-sm text-gray-500">Pay using VodaPay digital wallet</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-green-500">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Cash on Delivery</span>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save Info Checkbox */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    Save this information for next time
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={paymentLoading || isProcessing}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                {paymentLoading || isProcessing ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay R ${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                {cart.cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-lg object-cover" />
                      ) : (
                        <span>🍽️</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      R {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R {subtotal.toFixed(2)}</span>
                </div>
                
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

                {/* Free delivery progress */}
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

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>R {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Test Card Info (only in test mode) */}
              {testMode && environment === 'sandbox' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Test Card Information</h3>
                  <p className="text-xs text-gray-600 mb-1">Use these test cards in sandbox:</p>
                  <div className="space-y-1">
                    <p className="text-xs font-mono">💳 4444 4444 4444 4400 - Success</p>
                    <p className="text-xs font-mono">❌ 4444 4444 4444 4405 - Decline</p>
                    <p className="text-xs font-mono">⏰ 4444 4444 4444 4468 - Timeout</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
