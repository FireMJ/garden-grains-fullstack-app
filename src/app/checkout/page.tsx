'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { RESTAURANT_COORDS, getDrivingDistance } from "@/lib/googleMaps";
import { calculateCustomerDeliveryFee } from "@/lib/deliveryCalculator";
import { discountService } from '@/services/discountService';
import { Truck, Store, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [addressValidated, setAddressValidated] = useState(false);
  const [validatedAddress, setValidatedAddress] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ percentage: number; amount: number } | null>(null);
  const [discountError, setDiscountError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user && mounted) router.push('/login');
  }, [user, router, mounted]);

  useEffect(() => {
    if (cartItems.length === 0 && mounted) router.push('/menu');
  }, [cartItems, router, mounted]);

  useEffect(() => {
    if (distance !== null && orderType === 'delivery') {
      const fee = calculateCustomerDeliveryFee(distance, totalPrice);
      setDeliveryFee(fee);
    }
  }, [distance, totalPrice, orderType]);

  const handleAddressSelect = useCallback(async (selectedAddress: {
    street: string; city: string; postalCode: string; formattedAddress: string; coordinates: { lat: number; lng: number };
  }) => {
    setIsCalculating(true);
    setError(null);
    setAddressValidated(false);

    setAddress(selectedAddress.formattedAddress || '');
    setCity(selectedAddress.city || '');
    setPostalCode(selectedAddress.postalCode || '');

    try {
      const result = await getDrivingDistance(selectedAddress.coordinates, RESTAURANT_COORDS);
      if (result) {
        setDistance(result.distance);
        setDuration(result.duration);
        setValidatedAddress(selectedAddress);
        setAddressValidated(true);
        setPaymentError('');
        toast.success(`Address validated! ${result.distance.toFixed(1)}km from restaurant`);
      } else {
        setError("Could not calculate distance to this address");
        toast.error("Could not calculate distance to this address");
      }
    } catch (err) {
      setError("Error validating address");
      toast.error("Error validating address");
      console.error(err);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    setDiscountError('');
    try {
      const result = await discountService.validateDiscount(discountCode, totalPrice);
      if (result.valid) {
        setAppliedDiscount({
          percentage: result.percentage || 0,
          amount: result.amount
        });
        toast.success(`Discount applied! ${result.percentage}% off`);
      } else {
        setDiscountError(result.message || 'Invalid discount code');
        setAppliedDiscount(null);
        toast.error(result.message || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error validating discount:', error);
      setDiscountError('Failed to validate discount code');
      toast.error('Failed to validate discount code');
    }
  };

  const subtotal = totalPrice || 0;
  const discountAmount = appliedDiscount?.amount || 0;
  const delivery = orderType === 'delivery' ? deliveryFee : 0;
  const total = subtotal - discountAmount + delivery;

  const handlePlaceOrder = async () => {
    if (orderType === 'delivery' && !addressValidated) {
      toast.error('Please enter a valid delivery address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use serverTimestamp for Firestore
      const orderData = {
        customerId: user?.uid || null,
        customerName: user?.displayName || 'Customer',
        customerEmail: user?.email || 'no-email@provided.com',
        customerPhone: localStorage.getItem(`user_phone_${user?.uid}`) || '',
        items: cartItems || [],
        subtotal: subtotal,
        discountAmount: discountAmount,
        discountPercentage: appliedDiscount?.percentage || 0,
        discountCode: discountCode || null,
        deliveryFee: orderType === 'delivery' ? delivery : 0,
        total: total,
        status: 'pending_payment',
        paymentStatus: 'pending',
        orderType: orderType,
        deliveryAddress: (orderType === 'delivery' && address) ? address : null,
        deliveryCoordinates: (orderType === 'delivery' && validatedAddress?.coordinates) ? validatedAddress.coordinates : null,
        distance: distance || null,
        duration: duration || null,
        createdAt: new Date(), // Use JavaScript Date for client-side timestamp
        updatedAt: new Date()
      };

      console.log('Creating order with data:', orderData);
      
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, orderData);
      
      console.log('Order created with ID:', docRef.id);
      
      clearCart();
      localStorage.removeItem('discount_applied');
      
      toast.success('Order created! Redirecting to payment...');
      
      setTimeout(() => {
        router.push(`/payment?orderId=${docRef.id}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Method</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    orderType === 'delivery'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Truck className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <span className="font-medium">Delivery</span>
                  <span className="text-sm text-gray-500 block">R{deliveryFee.toFixed(2)} fee</span>
                </button>
                <button
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 border-2 rounded-lg text-center transition ${
                    orderType === 'pickup'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Store className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <span className="font-medium">Pickup</span>
                  <span className="text-sm text-gray-500 block">Free</span>
                </button>
              </div>
            </div>

            {orderType === 'delivery' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <AddressAutocomplete
                    onAddressSelect={handleAddressSelect}
                    placeholder="Start typing your Cape Town address..."
                    className="w-full"
                  />
                  
                  {isCalculating && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Validating address...</span>
                    </div>
                  )}
                  
                  {addressValidated && validatedAddress && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Address Validated!</p>
                          <p className="text-sm text-green-700">{address}</p>
                          {distance && (
                            <p className="text-xs text-green-600 mt-1">
                              📍 {distance.toFixed(1)} km from restaurant • 🚗 ~{Math.round(duration || 0)} min delivery time
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-green-600">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Total</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedDiscount.percentage}%)</span>
                    <span>-R{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>R{delivery.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">R{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleApplyDiscount}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Apply
                  </button>
                </div>
                {discountError && <p className="text-red-500 text-sm mt-1">{discountError}</p>}
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting || (orderType === 'delivery' && !addressValidated)}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Order...
                  </span>
                ) : (
                  `Proceed to Payment • R${total.toFixed(2)}`
                )}
              </button>

              {orderType === 'delivery' && !addressValidated && (
                <p className="text-red-500 text-sm mt-3 text-center">
                  Please enter and validate a delivery address
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
