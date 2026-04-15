"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { RESTAURANT_ADDRESS, RESTAURANT_COORDS, getDrivingDistance, geocodeAddress } from "@/lib/googleMaps";
import { calculateCustomerDeliveryFee, calculateDriverPayment, DELIVERY_CONFIG } from "@/lib/deliveryCalculator";
import Link from "next/link";
import { Truck, Store, AlertCircle, CreditCard, Loader2, CheckCircle, MapPin } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totalPrice } = useCart();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [addressValidated, setAddressValidated] = useState(false);
  const [validatedAddress, setValidatedAddress] = useState<any>(null);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user && mounted) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  useEffect(() => {
    if (cartItems.length === 0 && mounted) {
      router.push('/menu');
    }
  }, [cartItems, router, mounted]);

  // Calculate delivery fee when distance or subtotal changes
  useEffect(() => {
    if (distance !== null && orderType === 'delivery') {
      const fee = calculateCustomerDeliveryFee(distance, totalPrice);
      setDeliveryFee(fee);
    }
  }, [distance, totalPrice, orderType]);

  const handleAddressSelect = useCallback(async (selectedAddress: {
    street: string;
    city: string;
    postalCode: string;
    formattedAddress: string;
    coordinates: { lat: number; lng: number };
  }) => {
    setAddress(selectedAddress.street);
    setCity(selectedAddress.city);
    setPostalCode(selectedAddress.postalCode);
    setAddressValidated(false);
    setError(null);
    
    setIsValidatingAddress(true);
    setIsCalculating(true);
    
    try {
      console.log('Calculating distance from:', selectedAddress.coordinates);
      console.log('To restaurant:', RESTAURANT_COORDS);
      
      // Calculate driving distance from selected address to restaurant
      const result = await getDrivingDistance(
        selectedAddress.coordinates,
        RESTAURANT_COORDS
      );
      
      if (result && result.distance) {
        setDistance(result.distance);
        setDuration(result.duration);
        setAddressValidated(true);
        setValidatedAddress(selectedAddress);
        
        console.log(`✅ Distance calculated: ${result.distance.toFixed(2)} km`);
        console.log(`✅ Duration: ${result.duration.toFixed(0)} minutes`);
        
        // Check if within delivery radius
        if (result.distance > DELIVERY_CONFIG.MAX_DISTANCE_KM) {
          setError(`Location is ${result.distance.toFixed(1)} km away. Maximum delivery distance is ${DELIVERY_CONFIG.MAX_DISTANCE_KM} km. Please consider pickup.`);
          setAddressValidated(false);
        }
      } else {
        setError('Could not calculate distance to this address. Please try a different address.');
        setDistance(null);
      }
    } catch (err) {
      console.error('Distance calculation error:', err);
      setError('Failed to calculate delivery distance. Please try again.');
      setDistance(null);
    } finally {
      setIsValidatingAddress(false);
      setIsCalculating(false);
    }
  }, []);

  const handleVodaPayPayment = async () => {
    if (orderType === 'delivery') {
      if (!addressValidated || !distance) {
        setPaymentError('Please validate your delivery address first');
        return;
      }
      if (distance > DELIVERY_CONFIG.MAX_DISTANCE_KM) {
        setPaymentError(`Location is ${distance.toFixed(1)} km away. Maximum delivery distance is ${DELIVERY_CONFIG.MAX_DISTANCE_KM} km. Please try pickup.`);
        return;
      }
    }

    setIsSubmitting(true);
    setPaymentError('');

    try {
      const subtotal = totalPrice || 0;
      const customerDeliveryFee = orderType === 'delivery' ? calculateCustomerDeliveryFee(distance || 0, subtotal) : 0;
      const total = subtotal + customerDeliveryFee;

      const order = {
        orderId: `ORDER_${Date.now()}`,
        amount: total,
        subtotal: subtotal,
        customerDeliveryFee: customerDeliveryFee,
        driverPayment: orderType === 'delivery' ? calculateDriverPayment(distance || 0) : 0,
        distance: distance,
        items: cartItems,
        orderType: orderType,
        deliveryAddress: orderType === 'delivery' && validatedAddress ? {
          street: address,
          city: city,
          postalCode: postalCode,
          coordinates: validatedAddress.coordinates,
          distance: distance,
          customerFee: customerDeliveryFee,
        } : null,
        pickupLocation: orderType === 'pickup' ? RESTAURANT_ADDRESS : null,
        customerEmail: user?.email,
        customerName: user?.displayName,
        timestamp: new Date().toISOString(),
      };

      sessionStorage.setItem('pendingOrder', JSON.stringify(order));

      const response = await fetch('/api/vodapay/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'ZAR',
          orderId: order.orderId,
          customerEmail: user?.email,
          customerName: user?.displayName,
          customerPhone: user?.phoneNumber || '27721234567',
          returnUrl: `${window.location.origin}/payment/vodapay/return`,
          cancelUrl: `${window.location.origin}/payment/vodapay/cancel`,
        }),
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        sessionStorage.setItem('currentTransactionId', data.transactionId);
        window.location.href = data.paymentUrl;
      } else {
        setPaymentError(data.message || 'Payment initiation failed');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentError('Failed to connect to payment service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = totalPrice || 0;
  const total = subtotal + (orderType === 'delivery' ? deliveryFee : 0);
  const isFreeDelivery = subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/menu" className="bg-green-600 text-white px-6 py-2 rounded-lg">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Method</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => {
                    setOrderType('pickup');
                    setError(null);
                  }}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    orderType === 'pickup' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Store className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Pickup</div>
                  <div className="text-sm text-gray-600">Free • 15-20 min</div>
                </button>
                
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    orderType === 'delivery' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Truck className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Delivery</div>
                  <div className="text-sm text-gray-600">
                    {isFreeDelivery ? 'FREE delivery!' : `From R${DELIVERY_CONFIG.BASE_DELIVERY_FEE}`}
                  </div>
                </button>
              </div>
              
              {orderType === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  
                  <AddressAutocomplete
                    onAddressSelect={handleAddressSelect}
                    placeholder="Start typing your Cape Town address..."
                    className="mb-3"
                  />
                  
                  {(isValidatingAddress || isCalculating) && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-blue-600">Calculating distance...</span>
                    </div>
                  )}
                  
                  {addressValidated && distance !== null && (
                    <div className="mt-3 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-green-800">Delivery Available!</p>
                          <div className="flex flex-wrap justify-between items-center mt-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Distance from restaurant</p>
                              <p className="text-xl font-bold text-[#2F5D50]">{distance.toFixed(1)} km</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Delivery Fee</p>
                              <p className="text-xl font-bold text-[#2F5D50]">
                                {isFreeDelivery ? 'FREE' : `R${deliveryFee.toFixed(2)}`}
                              </p>
                            </div>
                          </div>
                          {duration && (
                            <p className="text-xs text-gray-500 mt-2">
                              ⏱️ Estimated delivery time: {Math.ceil(duration)} minutes
                            </p>
                          )}
                          {!isFreeDelivery && distance > DELIVERY_CONFIG.BASE_DISTANCE_KM && (
                            <p className="text-xs text-gray-500 mt-1">
                              * R{DELIVERY_CONFIG.BASE_DELIVERY_FEE} for first {DELIVERY_CONFIG.BASE_DISTANCE_KM}km + 
                              R{Math.ceil(distance - DELIVERY_CONFIG.BASE_DISTANCE_KM)}km × R{DELIVERY_CONFIG.EXTRA_KM_RATE}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>
              )}
              
              {orderType === 'pickup' && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Store className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900 mb-1">Pickup Location</h3>
                      <p className="text-sm text-green-800 whitespace-pre-line">{RESTAURANT_ADDRESS}</p>
                      <p className="text-xs text-green-700 mt-2">⏱️ Your order will be ready in 15-20 minutes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {paymentError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {paymentError}
              </div>
            )}

            <button
              onClick={handleVodaPayPayment}
              disabled={isSubmitting || (orderType === 'delivery' && (!addressValidated || !distance))}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <><CreditCard className="w-5 h-5" /> Pay R{total.toFixed(2)} with VodaPay</>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">Secure payment powered by VodaPay</p>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>
                
                {orderType === 'delivery' && distance !== null && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={isFreeDelivery ? 'text-green-600 font-medium' : ''}>
                      {isFreeDelivery ? 'FREE' : `R${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                )}

                {!isFreeDelivery && subtotal > 0 && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-sm text-blue-800 mb-1">
                      <span>Add R{(DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more for FREE delivery</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                  <span>Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
