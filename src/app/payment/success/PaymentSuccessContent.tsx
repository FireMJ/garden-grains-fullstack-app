'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { parseVodaPayCallback, VodaPayCallbackData } from '@/lib/vodapay/callbackParser';
import PaymentReceipt from '@/components/PaymentReceipt';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';

// Helper function to remove undefined values
function sanitizeData(data: any): any {
  const sanitized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [callbackData, setCallbackData] = useState<VodaPayCallbackData | null>(null);

  // Get parameters - handle both formats
  let orderId = searchParams.get('orderId');
  let encodedData = searchParams.get('data');
  
  // If orderId contains a ? that means the URL is malformed, try to extract properly
  if (orderId && orderId.includes('?data=')) {
    console.log('Malformed URL detected, fixing...');
    const parts = orderId.split('?data=');
    orderId = parts[0];
    if (!encodedData && parts[1]) {
      encodedData = parts[1];
    }
  }

  useEffect(() => {
    console.log('=== PAYMENT SUCCESS PAGE ===');
    console.log('orderId:', orderId);
    console.log('encodedData exists:', !!encodedData);
  }, [orderId, encodedData]);

  useEffect(() => {
    const processPayment = async () => {
      if (!orderId) {
        toast.error('Order ID not found');
        setLoading(false);
        return;
      }
      
      try {
        let paymentInfo = null;
        if (encodedData) {
          const parsed = parseVodaPayCallback(encodedData);
          if (parsed) {
            setCallbackData(parsed);
            paymentInfo = parsed;
            console.log('VodaPay callback received. Response code:', parsed.responseCode);
          }
        }
        
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);
        
        if (orderDoc.exists()) {
          const orderData = { id: orderDoc.id, ...orderDoc.data() };
          
          if (paymentInfo && paymentInfo.responseCode === '00') {
            // Build update data without undefined values
            const updateData: any = {
              paymentStatus: 'paid',
              vodapayTransactionId: paymentInfo.transactionId,
              vodapaySessionId: paymentInfo.sessionId,
              vodapayResponseCode: paymentInfo.responseCode,
              vodapayResponseMessage: paymentInfo.responseMessage,
              vodapayRetrievalReference: paymentInfo.retrievalReferenceNumber || paymentInfo.traceId,
              vodapayAmountPaid: orderData.total,
              vodapayTraceId: paymentInfo.traceId,
              paymentDate: new Date(),
              status: 'pending'
            };
            
            // Only add paymentToken if it exists and is not null
            if (paymentInfo.paymentToken) {
              updateData.vodapayPaymentToken = paymentInfo.paymentToken;
            }
            
            // Only add retrievalReferenceNumber if it exists
            if (paymentInfo.retrievalReferenceNumber) {
              updateData.vodapayRetrievalReference = paymentInfo.retrievalReferenceNumber;
            }
            
            // Sanitize to remove any undefined values
            const sanitizedData = sanitizeData(updateData);
            
            await updateDoc(orderRef, sanitizedData);
            toast.success(`Payment confirmed!`);
          } else if (paymentInfo) {
            const updateData: any = {
              paymentStatus: 'failed',
              vodapayResponseCode: paymentInfo.responseCode,
              vodapayResponseMessage: paymentInfo.responseMessage,
              vodapayTransactionId: paymentInfo.transactionId
            };
            
            if (paymentInfo.paymentToken) {
              updateData.vodapayPaymentToken = paymentInfo.paymentToken;
            }
            
            const sanitizedData = sanitizeData(updateData);
            await updateDoc(orderRef, sanitizedData);
            toast.error(`Payment failed: ${paymentInfo.responseMessage}`);
          }
          
          setOrder(orderData);
        } else {
          console.error('Order not found:', orderId);
          toast.error('Order not found');
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('Failed to process payment');
      } finally {
        setLoading(false);
      }
    };
    
    processPayment();
  }, [orderId, encodedData]);

  const handlePrint = () => window.print();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Order Confirmation - Garden & Grains',
        text: `Your order has been confirmed!`,
        url: window.location.href
      }).catch(() => toast.success('Order details copied!'));
    } else {
      navigator.clipboard.writeText(`Order #${orderId?.slice(-8)}`);
      toast.success('Order details copied to clipboard!');
    }
  };

  const handleWhatsApp = () => {
    const message = `Garden & Grains Order Confirmation%0A%0AOrder #: ${orderId?.slice(-8)}%0ATotal Paid: R${order?.total?.toFixed(2)}%0AThank you!`;
    window.open(`https://wa.me/27761234567?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-4">Order ID: {orderId}</p>
          <Link href="/menu" className="text-green-600 hover:text-green-700">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <PaymentReceipt
          order={order}
          callbackData={callbackData}
          user={null}
          onPrint={handlePrint}
          onShare={handleShare}
          onWhatsApp={handleWhatsApp}
        />
        <p className="text-center text-xs text-gray-500 mt-6">
          A confirmation has been sent to your email address
        </p>
      </div>
    </div>
  );
}
