'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaArrowLeft, FaCreditCard, FaMobile, FaUniversity, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import VodaPayCheckout from '@/components/VodaPayCheckout';

type PaymentMethod = 'card' | 'vodapay' | 'ozow';

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonMethod, setComingSoonMethod] = useState('');
  
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchOrder = async () => {
      if (!orderId) {
        toast.error('Invalid order ID');
        router.push('/menu');
        return;
      }
      
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);
        
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        } else {
          toast.error('Order not found');
          router.push('/menu');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, user, router]);

  const handleComingSoon = (methodName: string) => {
    setComingSoonMethod(methodName);
    setShowComingSoon(true);
  };

  const handleBackToCard = () => {
    setShowComingSoon(false);
    setSelectedMethod('card');
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: FaCreditCard, description: 'Visa, Mastercard', available: true },
    { id: 'vodapay', name: 'VodaPay Wallet', icon: FaMobile, description: 'Coming Soon', available: false },
    { id: 'ozow', name: 'Ozow', icon: FaUniversity, description: 'Coming Soon', available: false },
  ];

  const handlePaymentSuccess = async (transactionId: string) => {
    const orderRef = doc(db, 'orders', orderId!);
    await updateDoc(orderRef, {
      vodapayTransactionId: transactionId,
      paymentStatus: 'paid',
      status: 'pending'
    });
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link href="/menu" className="text-green-600 hover:text-green-700">Return to Menu</Link>
        </div>
      </div>
    );
  }

  // Coming Soon screen for VodaPay Wallet and Ozow
  if (showComingSoon) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <Toaster position="top-right" />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <FaInfoCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Coming Soon!</h1>
              <p className="text-white/90">{comingSoonMethod} is on its way</p>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-blue-600 text-xl mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-800 mb-1">Under Development</p>
                    <p className="text-sm text-blue-700">
                      {comingSoonMethod} integration is currently in progress.
                    </p>
                    <p className="text-sm text-blue-700 mt-2">
                      Please use Credit/Debit Card to complete your order now.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="text-gray-900">R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-900">Total</span>
                      <span className="text-green-600">R{order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleBackToCard}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  <FaCreditCard /> Use Credit/Debit Card Instead
                </button>
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Back to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/checkout" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6">
          <FaArrowLeft /> Back to Checkout
        </Link>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
            <p className="text-purple-100 text-sm">Select your payment method</p>
          </div>
          
          <div className="p-6">
            {/* Payment Methods Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                const isAvailable = method.available;
                
                return (
                  <button
                    key={method.id}
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedMethod(method.id as PaymentMethod);
                      } else {
                        handleComingSoon(method.name);
                      }
                    }}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      isSelected && isAvailable
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <Icon className={`text-3xl mx-auto mb-2 ${
                      isSelected && isAvailable ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div className={`text-sm font-medium ${
                      isSelected && isAvailable ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {method.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{method.description}</div>
                  </button>
                );
              })}
            </div>

            {/* Credit/Debit Card - Working Option */}
            {selectedMethod === 'card' && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCreditCard className="text-green-600" />
                    <h3 className="font-semibold text-green-900">Credit/Debit Card</h3>
                  </div>
                  
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono">#{order.id.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-bold text-green-600">R{order.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <VodaPayCheckout
                    amount={order.total}
                    orderId={order.id}
                    customerEmail={user?.email || order.customerEmail}
                    customerPhone={order.customerPhone}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
