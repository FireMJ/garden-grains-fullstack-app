'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

function ReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    const processOrder = async () => {
      if (status === 'SUCCESS') {
        const pendingOrderStr = sessionStorage.getItem('pendingOrder');
        
        if (pendingOrderStr) {
          try {
            const pendingOrder = JSON.parse(pendingOrderStr);
            
            // Use the orderId from pending order
            const orderId = pendingOrder.orderId;
            
            // Create order object
            const newOrder = {
              orderId: orderId,
              orderNumber: `GN-${Date.now().toString().slice(-8)}`,
              transactionId: transactionId,
              amount: pendingOrder.amount,
              items: pendingOrder.items,
              orderType: pendingOrder.orderType,
              deliveryAddress: pendingOrder.deliveryAddress,
              pickupLocation: pendingOrder.pickupLocation,
              paymentStatus: 'paid',
              status: 'paid',
              paymentDate: new Date().toISOString(),
              timestamp: pendingOrder.timestamp || new Date().toISOString(),
              customerEmail: pendingOrder.customerEmail,
              customerName: pendingOrder.customerName,
            };
            
            console.log('Saving order:', newOrder);
            
            // Save to localStorage
            const existingOrdersStr = localStorage.getItem('orders');
            const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
            existingOrders.unshift(newOrder);
            localStorage.setItem('orders', JSON.stringify(existingOrders));
            
            // Also save user-specific orders
            if (pendingOrder.customerEmail) {
              const userOrdersStr = localStorage.getItem(`orders_${pendingOrder.customerEmail}`);
              const userOrders = userOrdersStr ? JSON.parse(userOrdersStr) : [];
              userOrders.unshift(newOrder);
              localStorage.setItem(`orders_${pendingOrder.customerEmail}`, JSON.stringify(userOrders));
            }
            
            // Clear session storage
            sessionStorage.removeItem('pendingOrder');
            sessionStorage.removeItem('currentTransactionId');
            
            console.log('Order saved successfully, redirecting to:', `/order-tracking/${orderId}`);
            
            // Redirect to order tracking
            setTimeout(() => {
              router.push(`/order-tracking/${orderId}`);
            }, 2000);
            
          } catch (error) {
            console.error('Error saving order:', error);
          }
        } else {
          console.error('No pending order found in sessionStorage');
        }
      }
    };
    
    processOrder();
  }, [status, router, transactionId]);

  if (status === 'SUCCESS') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            {transactionId && (
              <p className="text-sm text-gray-500 mb-6">Transaction ID: {transactionId}</p>
            )}
            <div className="animate-pulse text-gray-500 mb-4">
              Redirecting to order tracking in {countdown} seconds...
            </div>
            <button
              onClick={() => router.push('/orders')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">Your payment could not be processed.</p>
          <button
            onClick={() => router.push('/checkout')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VodaPayReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ReturnContent />
    </Suspense>
  );
}
