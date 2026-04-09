"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { 
  FaArrowLeft, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaUser,
  FaStore,
  FaTruck
} from "react-icons/fa";

export default function OrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      router.push('/menu');
    }
  }, [cartItems, router, orderPlaced]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (orderType === 'delivery' && (!address || !city || !postalCode)) {
      alert('Please fill in all delivery address fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate order number
      const newOrderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setOrderNumber(newOrderNumber);

      // Here you would typically save the order to Firebase
      // For now, we'll simulate a successful order
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear the cart
      clearCart();
      setOrderPlaced(true);

    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">Thank you for your order</p>
            <p className="text-sm text-gray-500 mb-6">Order Number: <span className="font-mono font-bold">{orderNumber}</span></p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">📧 You'll receive a confirmation email shortly</li>
                <li className="flex items-center gap-2">📱 We'll notify you when your order is ready</li>
                <li className="flex items-center gap-2">🍽️ {orderType === 'pickup' ? 'Pick up your order at our farm' : 'Track your delivery in real-time'}</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Link
                href="/menu"
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Order More
              </Link>
              <Link
                href="/"
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = totalPrice || 0;
  const deliveryFee = orderType === 'delivery' ? 35 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back to Cart Link */}
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Cart</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Place Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
              {/* Delivery Method */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Method</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      orderType === 'pickup'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaStore className="text-xl text-gray-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">Pickup</h3>
                        <p className="text-sm text-gray-500">Free • Collect at our farm</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      orderType === 'delivery'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <FaTruck className="text-xl text-gray-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900">Delivery</h3>
                        <p className="text-sm text-gray-500">R35 • 30-45 min</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              {orderType === 'delivery' && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street Address *"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City *"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal Code *"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Pickup Info */}
              {orderType === 'pickup' && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl">
                  <h3 className="font-semibold text-green-800 mb-2">Pickup Location</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Uitsig Wine Farm</strong><br />
                    Spaanschemat River Rd, Fir Grove<br />
                    Cape Town, 7806
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Your order will be ready in approximately 15-20 minutes.
                  </p>
                </div>
              )}

              {/* Special Instructions */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Special Instructions</h2>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests or dietary requirements?"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    <span>{user.displayName || 'User'}</span>
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    <span>{user.email}</span>
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    <span>{user.phoneNumber || 'Not provided'}</span>
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Order...' : `Place Order • R${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-lg object-cover" />
                      ) : (
                        <span>🍽️</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `R${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                  <span>Total</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800">
                  <FaClock />
                  <span className="font-medium">Estimated {orderType === 'pickup' ? 'ready' : 'delivery'} time:</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  {orderType === 'pickup' ? '15-20 minutes' : '30-45 minutes'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
