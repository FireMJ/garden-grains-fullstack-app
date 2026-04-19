"use client";

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
  const { cartItems, totalPrice, updateQuantity, removeFromCart, updateAddOnQuantity, removeAddOn, updateItemDetails } = useCart();

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
      setDiscountError("Please enter a discount code");
      return;
    }
    
    setDiscountError('');
    try {
      const result = await discountService.validateDiscount(discountCode, totalPrice);
      if (result.valid) {
        setAppliedDiscount({
          percentage: result.percentage || 0,
          amount: result.amount || 0
        });
        setDiscountError('');
      } else {
        setDiscountError(result.message || "Invalid discount code");
      }
    } catch (err) {
      setDiscountError("Error applying discount");
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    localStorage.removeItem('discount_applied');
  };

  const subtotal = totalPrice || 0;
  const discountAmount = appliedDiscount?.amount || 0;
  const deliveryFeeAmount = orderType === 'delivery' && distance !== null ? deliveryFee : 0;
  const total = subtotal - discountAmount + deliveryFeeAmount;

  const handleSubmit = async () => {
    if (orderType === 'delivery' && !addressValidated) {
      setPaymentError("Please validate your delivery address first");
      return;
    }
    
    setIsSubmitting(true);
    setPaymentError('');
    
    // Store order data in sessionStorage for payment
    const orderData = {
      items: cartItems,
      orderType,
      address: orderType === 'delivery' ? {
        street: address,
        city: city,
        postalCode: postalCode,
        coordinates: validatedAddress?.coordinates
      } : null,
      distance: distance,
      duration: duration,
      deliveryFee: deliveryFeeAmount,
      subtotal: subtotal,
      discount: appliedDiscount,
      total: total,
      customer: {
        id: user?.uid,
        name: user?.displayName,
        email: user?.email,
        phone: user?.phoneNumber
      },
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
    
    try {
      // Initiate VodaPay payment
      const response = await fetch('/api/vodapay/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'ZAR',
          orderId: `ORD-${Date.now()}`,
          customerEmail: user?.email,
          customerPhone: user?.phoneNumber,
          returnUrl: `${window.location.origin}/payment/vodapay/return`,
          cancelUrl: `${window.location.origin}/payment/vodapay/cancel`,
        }),
      });
      
      const result = await response.json();
      
      if (result.success && result.paymentUrl) {
        // Redirect to VodaPay payment page
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.message || 'Payment initiation failed');
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setPaymentError("Failed to initiate payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-500 mb-8">Complete your order details</p>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Type</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setOrderType('pickup')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                    orderType === 'pickup'
                      ? 'border-[#2F5D50] bg-[#2F5D50]/5 text-[#2F5D50] shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Store size={20} />
                  <span className="font-medium">Pickup</span>
                </button>
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                    orderType === 'delivery'
                      ? 'border-[#2F5D50] bg-[#2F5D50]/5 text-[#2F5D50] shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Truck size={20} />
                  <span className="font-medium">Delivery</span>
                </button>
              </div>
            </div>
            
            {/* Delivery Address (if delivery selected) */}
            {orderType === 'delivery' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-[#2F5D50]" />
                  Delivery Address
                </h2>
                
                <AddressAutocomplete 
                  onAddressSelect={handleAddressSelect}
                  placeholder="Enter your delivery address..."
                />
                
                {isCalculating && (
                  <div className="mt-4 flex items-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-sm">Validating address...</span>
                  </div>
                )}
                
                {addressValidated && distance && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-700">Address Validated</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Distance: {distance.toFixed(1)} km • Est. delivery: {Math.round(duration || 30)} min
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      📍 {address}
                    </p>
                  </div>
                )}
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">R {item.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50]"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-medium text-gray-700">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2F5D50]"
                            >
                              <Plus size={12} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-right">
                          <span className="font-bold text-gray-900">
                            R {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R {subtotal.toFixed(2)}</span>
                </div>
                
                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedDiscount.percentage}%)</span>
                    <span>-R {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                {orderType === 'delivery' && distance && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>R {deliveryFeeAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>R {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Discount Section */}
              <div className="mt-6 pt-4 border-t">
                {!appliedDiscount ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Discount code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={handleApplyDiscount}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                      >
                        Apply
                      </button>
                    </div>
                    {discountError && (
                      <p className="text-xs text-red-600">{discountError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-green-700">
                      Discount applied! ({appliedDiscount.percentage}% off)
                    </span>
                    <button
                      onClick={handleRemoveDiscount}
                      className="text-xs text-green-600 hover:text-green-800"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (orderType === 'delivery' && !addressValidated)}
                className={`w-full mt-6 py-3.5 rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${
                  isSubmitting || (orderType === 'delivery' && !addressValidated)
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2F5D50] text-white hover:bg-[#23483E] hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Proceed to Payment
                  </>
                )}
              </button>
              
              {paymentError && (
                <div className="mt-3 p-3 bg-red-50 rounded-xl flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-600 mt-0.5" />
                  <p className="text-sm text-red-600">{paymentError}</p>
                </div>
              )}
              
              <Link href="/cart" className="block text-center text-sm text-gray-500 hover:text-[#2F5D50] mt-4">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
