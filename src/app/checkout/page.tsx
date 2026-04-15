'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useDeliveryCalculation } from "@/hooks/useDeliveryCalculation";
import { RESTAURANT_ADDRESS } from "@/lib/googleMaps";
import { calculateCustomerDeliveryFee, calculateDriverPayment, getDeliveryBreakdown } from "@/lib/deliveryCalculator";
import Link from "next/link";
import { MapPin, Truck, Store, AlertCircle, CreditCard, Loader2 } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { deliveryInfo, calculateFromAddress, calculateFromCoordinates, isLoading, error } = useDeliveryCalculation();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [addressValidated, setAddressValidated] = useState(false);
  const [validatedAddress, setValidatedAddress] = useState<any>(null);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/menu');
    }
  }, [cartItems, router]);

  const handleAddressSelect = async (selectedAddress: {
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
    
    setIsValidatingAddress(true);
    await calculateFromCoordinates(selectedAddress.coordinates.lat, selectedAddress.coordinates.lng, selectedAddress.formattedAddress);
    setIsValidatingAddress(false);
    setAddressValidated(true);
    setValidatedAddress(selectedAddress);
  };

  const handleVodaPayPayment = async () => {
    if (orderType === 'delivery') {
      if (!addressValidated || !deliveryInfo?.isAvailable) {
        setPaymentError('Please validate your delivery address first');
        return;
      }
      if (!deliveryInfo.isAvailable) {
        setPaymentError('Delivery not available to this address. Please try pickup.');
        return;
      }
    }

    setIsSubmitting(true);
    setPaymentError('');

    try {
      const subtotal = totalPrice || 0;
      
      // Customer pays delivery fee (may be R0 if free delivery)
      const customerDeliveryFee = calculateCustomerDeliveryFee(deliveryInfo?.distance || 0, subtotal);
      
      // Driver gets paid based on distance (always)
      const driverPayment = calculateDriverPayment(deliveryInfo?.distance || 0);
      
      const total = subtotal + customerDeliveryFee;

      const order = {
        orderId: `ORDER_${Date.now()}`,
        amount: total,
        subtotal: subtotal,
        customerDeliveryFee: customerDeliveryFee,
        driverPayment: driverPayment,
        distance: deliveryInfo?.distance,
        items: cartItems,
        orderType: orderType,
        deliveryAddress: orderType === 'delivery' && validatedAddress ? {
          street: address,
          city: city,
          postalCode: postalCode,
          coordinates: validatedAddress.coordinates,
          distance: deliveryInfo?.distance,
          customerFee: customerDeliveryFee,
          driverPayment: driverPayment,
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
  const customerDeliveryFee = calculateCustomerDeliveryFee(deliveryInfo?.distance || 0, subtotal);
  const driverPayment = calculateDriverPayment(deliveryInfo?.distance || 0);
  const total = subtotal + customerDeliveryFee;
  const isFreeDelivery = subtotal >= 850;

  if (!user || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    orderType === 'pickup' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Store className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Pickup</div>
                  <div className="text-sm text-gray-600">Free</div>
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
                    {isFreeDelivery ? 'FREE delivery!' : 'From R35'}
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
                    placeholder="Start typing your address..."
                    className="mb-3"
                  />
                  
                  {isValidatingAddress && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-blue-600">Validating address...</span>
                    </div>
                  )}
                  
                  {addressValidated && deliveryInfo?.isAvailable && (
                    <div className="mt-3 p-4 bg-green-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-green-800">
                          <p className="font-medium">Delivery Available!</p>
                          <p>{deliveryInfo.distance?.toFixed(1)} km away</p>
                          {deliveryInfo.duration && (
                            <p className="text-xs mt-1">Est. delivery: {Math.ceil(deliveryInfo.duration)} minutes</p>
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
              disabled={isSubmitting || (orderType === 'delivery' && (!addressValidated || !deliveryInfo?.isAvailable))}
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
          
          {/* Order Summary */}
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
                
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={isFreeDelivery ? 'text-green-600 font-medium' : ''}>
                      {isFreeDelivery ? 'FREE' : `R${customerDeliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                )}
                
                {orderType === 'delivery' && !isFreeDelivery && deliveryInfo?.distance && (
                  <div className="text-xs text-gray-500 text-right">
                    (R35 base + R{Math.ceil(Math.max(0, deliveryInfo.distance - 5))}km × R2.75)
                  </div>
                )}
                
                {orderType === 'delivery' && isFreeDelivery && deliveryInfo?.distance && (
                  <div className="text-xs text-gray-500 text-right">
                    🎉 Free delivery! (Driver still earns R{driverPayment.toFixed(2)})
                  </div>
                )}

                {!isFreeDelivery && subtotal > 0 && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-sm text-blue-800 mb-1">
                      <span>Add R{(850 - subtotal).toFixed(2)} more for FREE delivery</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / 850) * 100)}%` }}
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
