"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useDeliveryCalculation } from "@/hooks/useDeliveryCalculation";
import { RESTAURANT_ADDRESS } from "@/lib/googleMaps";
import Link from "next/link";
import { MapPin, Truck, Store, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { deliveryInfo, calculateFromAddress, calculateFromCoordinates, isLoading, error } = useDeliveryCalculation();
  
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleAddressSubmit = async () => {
    if (address) {
      await calculateFromAddress(address);
    }
  };
  
  const subtotal = totalPrice || 0;
  const deliveryFee = orderType === 'delivery' && deliveryInfo?.isAvailable ? deliveryInfo.fee : 0;
  const total = subtotal + deliveryFee;
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
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
          {/* Checkout Form */}
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
                  <div className="text-sm text-gray-600">From R35</div>
                </button>
              </div>
              
              {orderType === 'delivery' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleAddressSubmit}
                      disabled={isLoading || !address}
                      className="px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Calculate
                    </button>
                  </div>
                  
                  {isLoading && (
                    <p className="text-sm text-gray-500 mt-2">Calculating delivery...</p>
                  )}
                  
                  {error && (
                    <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                  
                  {deliveryInfo && !error && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Distance:</strong> {deliveryInfo.distance?.toFixed(1)} km
                      </p>
                      <p className="text-sm mt-1">
                        <strong>Delivery Fee:</strong> R{deliveryInfo.fee.toFixed(2)}
                      </p>
                      {deliveryInfo.duration && (
                        <p className="text-sm mt-1">
                          <strong>Estimated Time:</strong> {Math.ceil(deliveryInfo.duration)} minutes
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {orderType === 'pickup' && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Pickup Location</h3>
                  <p className="text-sm text-gray-600">{RESTAURANT_ADDRESS}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Your order will be ready in 15-20 minutes
                  </p>
                </div>
              )}
            </div>
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
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `R${deliveryFee.toFixed(2)}` : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                  <span>Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                disabled={orderType === 'delivery' && (!deliveryInfo || !deliveryInfo.isAvailable)}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
