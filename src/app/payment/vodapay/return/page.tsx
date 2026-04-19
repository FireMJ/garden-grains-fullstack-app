'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

function ReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const paymentStatus = searchParams.get('status');
    const transactionId = searchParams.get('transactionId');
    
    console.log('Payment return status:', paymentStatus, 'Transaction:', transactionId);
    
    if (paymentStatus === 'SUCCESS') {
      setStatus('success');
      setMessage('Payment successful! Redirecting to order confirmation...');
      
      // Get pending order from sessionStorage
      const pendingOrder = sessionStorage.getItem('pendingOrder');
      console.log('Pending order:', pendingOrder);
      
      if (pendingOrder) {
        const order = JSON.parse(pendingOrder);
        
        // Save order to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const newOrder = {
          ...order,
          id: `ORD-${Date.now()}`,
          payment: {
            transactionId: transactionId,
            status: 'completed',
            timestamp: new Date().toISOString()
          }
        };
        existingOrders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(existingOrders));
        
        // Clear cart
        localStorage.removeItem('cart');
        sessionStorage.removeItem('pendingOrder');
        
        console.log('Order saved successfully:', newOrder.id);
      }
      
      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        router.push('/order-confirmation');
      }, 2000);
    } else {
      setStatus('error');
      const errorMessage = searchParams.get('message') || 'Payment failed';
      setMessage(`Payment ${paymentStatus || 'failed'}: ${errorMessage}`);
      
      // Redirect back to checkout after 3 seconds
      setTimeout(() => {
        router.push('/checkout');
      }, 3000);
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        {status === 'processing' && (
          <>
            <Loader2 size={64} className="text-[#2F5D50] animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="animate-pulse text-sm text-gray-500">Redirecting to order confirmation...</div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Redirecting back to checkout...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VodaPayReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50]"></div>
      </div>
    }>
      <ReturnContent />
    </Suspense>
  );
}
