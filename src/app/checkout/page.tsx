'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { RESTAURANT_ADDRESS, RESTAURANT_COORDS, getDrivingDistance } from "@/lib/googleMaps";
import { calculateCustomerDeliveryFee, calculateDriverPayment, DELIVERY_CONFIG } from "@/lib/deliveryCalculator";
import { discountService } from '@/services/discountService';
import Link from "next/link";
import { Truck, Store, AlertCircle, CreditCard, Loader2, CheckCircle, MapPin, Minus, Plus, Trash2 } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totalPrice, updateQuantity, removeFromCart, updateAddOnQuantity, removeAddOn, updateItemDetails, clearCart } = useCart();

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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Discount states
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
      setDeliveryFee(calculateCustomerDeliveryFee(distance, totalPrice));
    }
  }, [distance, totalPrice, orderType]);

  // Check for existing discount
  useEffect(() => {
    const savedDiscount = localStorage.getItem('discount_applied');
    if (savedDiscount === 'true' && !appliedDiscount && totalPrice > 0) {
      const discountAmount = (totalPrice * 20) / 100;
      setAppliedDiscount({ percentage: 20, amount: discountAmount });
    }
  }, [totalPrice, appliedDiscount]);

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleAddressSelect = useCallback(async (selectedAddress: {
    street: string; city: string; postalCode: string; formattedAddress: string; coordinates: { lat: number; lng: number };
  }) => {
    setIsCalculating(true);
    setError(null);
    setAddressValidated(false);

    setAddress(selectedAddress.formattedAddress);
    setCity(selectedAddress.city);
    setPostalCode(selectedAddress.postalCode);

    try {
      const result = await getDrivingDistance(selectedAddress.coordinates, RESTAURANT_COORDS);
      if (result) {
        setDistance(result.distance);
        setDuration(result.duration);
        setValidatedAddress(selectedAddress);
        setAddressValidated(true);
      } else {
        setError("Could not calculate distance to this address");
      }
    } catch (err) {
      setError("Error validating address");
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
        setDiscountError('');
      } else {
        setDiscountError(result.message || 'Invalid discount code');
        setAppliedDiscount(null);
      }
    } catch (error) {
      console.error('Error validating discount:', error);
      setDiscountError('Failed to validate discount code');
    }
  };

  const subtotal = totalPrice;
  const discountAmount = appliedDiscount?.amount || 0;
  const delivery = orderType === 'delivery' ? deliveryFee : 0;
  const total = subtotal - discountAmount + delivery;

  const handlePlaceOrder = async () => {
    if (orderType === 'delivery' && !addressValidated) {
      setPaymentError('Please enter a valid delivery address');
      return;
    }
    
    setIsSubmitting(true);
    setPaymentError('');
    
    try {
      // Create order object
      const orderData = {
        customerId: user?.uid,
        customerName: user?.displayName || 'Customer',
        customerEmail: user?.email,
        items: cartItems,
        subtotal,
        discountAmount,
        deliveryFee: delivery,
        total,
        status: 'pending',
        createdAt: new Date(),
        orderType,
        deliveryAddress: orderType === 'delivery' ? address : null,
        specialInstructions: '',
      };
      
      // Here you would save to Firestore
      console.log('Order placed:', orderData);
      
      // Clear cart
      clearCart();
      
      // Redirect to order confirmation
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      setPaymentError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-green-600">R{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Payment Summary */}
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
              
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
              
              {paymentError && (
                <p className="text-red-500 text-sm mt-3 text-center">{paymentError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
