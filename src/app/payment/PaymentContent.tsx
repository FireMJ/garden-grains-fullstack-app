'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaArrowLeft } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import VodaPayCheckout from '@/components/VodaPayCheckout';

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          <Link href="/menu" className="text-green-600 hover:text-green-700">
            Return to Menu
          </Link>
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
            <p className="text-purple-100 text-sm">VodaPay Secure Gateway</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
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
      </div>
    </div>
  );
}
