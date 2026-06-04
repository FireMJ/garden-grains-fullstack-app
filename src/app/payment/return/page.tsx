'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [verifying, setVerifying] = useState(true);

  const transactionId = searchParams.get('transactionId');
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || !transactionId) {
        toast.error('Invalid payment response');
        router.push('/menu');
        return;
      }

      try {
        // Get order from Firestore
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);

        if (!orderDoc.exists()) {
          toast.error('Order not found');
          router.push('/menu');
          return;
        }

        const orderData = orderDoc.data();

        if (status === 'SUCCESS' || orderData.paymentStatus === 'paid') {
          toast.success('Payment successful!');
          router.push(`/payment/success?orderId=${orderId}`);
        } else if (status === 'CANCELLED') {
          toast.error('Payment was cancelled');
          router.push(`/payment/cancel?orderId=${orderId}`);
        } else {
          toast.error('Payment verification failed');
          router.push(`/payment/cancel?orderId=${orderId}`);
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Failed to verify payment');
        router.push('/menu');
      } finally {
        setVerifying(false);
      }
    };

    if (user) {
      verifyPayment();
    } else {
      router.push('/login');
    }
  }, [orderId, transactionId, status, user, router]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying payment...</p>
      </div>
    </div>
  );
}
