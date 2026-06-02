'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  FaCheckCircle, FaReceipt, FaShoppingBag, FaPrint, FaShare, 
  FaEnvelope, FaWhatsapp, FaDownload, FaHome, FaClock,
  FaCreditCard, FaUniversity, FaMobile, FaWallet
} from 'react-icons/fa';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchOrder = async () => {
      if (!orderId) {
        toast.error('Order ID not found');
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

  const getPaymentIcon = () => {
    const method = order?.paymentMethodCode;
    switch (method) {
      case 'CARD': return <FaCreditCard className="text-blue-600" />;
      case 'INSTANT_EFT': return <FaUniversity className="text-indigo-600" />;
      case 'DIGITAL_WALLET': return <FaWallet className="text-green-600" />;
      default: return <FaCreditCard className="text-gray-600" />;
    }
  };

  const formatDateTime = (dateField: any): string => {
    if (!dateField) return 'Pending';
    
    try {
      let date: Date;
      if (dateField.toDate) {
        date = dateField.toDate();
      } else if (dateField instanceof Date) {
        date = dateField;
      } else if (typeof dateField === 'string') {
        date = new Date(dateField);
      } else if (typeof dateField === 'number') {
        date = new Date(dateField);
      } else {
        return 'Pending';
      }
      
      if (isNaN(date.getTime())) {
        return 'Pending';
      }
      
      return date.toLocaleString();
    } catch (error) {
      return 'Pending';
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    const receiptContent = document.getElementById('receipt-content');
    if (receiptContent) {
      const htmlContent = receiptContent.innerHTML;
      const printWindow = window.open('', '_blank');
      printWindow?.document.write(`
        <html>
          <head>
            <title>Garden & Grains - Receipt #${order?.id?.slice(-8)}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              .receipt { max-width: 600px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #2F5D50; padding-bottom: 20px; margin-bottom: 20px; }
              .total { font-size: 24px; font-weight: bold; color: #2F5D50; }
              .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${htmlContent}
            </div>
            <script>window.print();<\/script>
          </body>
        </html>
      `);
      printWindow?.document.close();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Order Confirmation - Garden & Grains',
        text: `Your order #${orderId?.slice(-8)} has been confirmed! Total: R${order?.total?.toFixed(2)}`,
        url: window.location.href
      }).catch(() => {
        toast.success('Order details copied!');
      });
    } else {
      navigator.clipboard.writeText(`Order #${orderId?.slice(-8)} - Total: R${order?.total?.toFixed(2)}`);
      toast.success('Order details copied to clipboard!');
    }
  };

  const sendWhatsAppConfirmation = () => {
    const message = `🍽️ *Garden & Grains Order Confirmation* 🍽️%0A%0A` +
      `*Order #:* ${orderId?.slice(-8)}%0A` +
      `*Date:* ${formatDateTime(order?.paymentDate)}%0A` +
      `*Total Paid:* R${order?.total?.toFixed(2)}%0A` +
      `*Payment Method:* ${order?.paymentMethod}%0A` +
      `*Transaction ID:* ${order?.transactionId || transactionId}%0A%0A` +
      `Thank you for choosing Garden & Grains! 🌱`;
    const whatsappUrl = `https://wa.me/${user?.phoneNumber || '27761234567'}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
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
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Receipt Content */}
        <div id="receipt-content" className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <FaCheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100">Thank you for your order, {order.customerName || user?.displayName || 'Valued Customer'}!</p>
          </div>
          
          {/* Receipt Body */}
          <div className="p-6">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order Number</p>
                  <p className="text-lg font-mono font-bold text-gray-900">#{order.id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(order.paymentDate || order.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Payment Details */}
            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                {getPaymentIcon()} Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">{order.paymentMethod || 'Credit Card'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Transaction ID</p>
                  <p className="font-mono text-xs text-gray-900">{order.transactionId || transactionId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Status</p>
                  <p className="text-green-600 font-medium">✓ Completed</p>
                </div>
                {order.cardLastFour && (
                  <div>
                    <p className="text-gray-500">Card Used</p>
                    <p className="font-medium text-gray-900">•••• {order.cardLastFour}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Items */}
            <div className="border-b pb-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-2">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium text-gray-900">{item.quantity}x</span>
                      <span className="text-gray-600 ml-2">{item.name}</span>
                    </div>
                    <span className="text-gray-900 font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700">R{order.subtotal?.toFixed(2) || order.total?.toFixed(2)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-gray-700">R{order.deliveryFee?.toFixed(2)}</span>
                </div>
              )}
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount Applied</span>
                  <span>-R{order.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-green-600">R{order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Delivery Info */}
            {order.orderType === 'delivery' && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  🚚 Delivery Information
                </h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p><strong>Address:</strong> {order.deliveryAddress}</p>
                  <p><strong>Estimated Time:</strong> 30-45 minutes</p>
                  <p><strong>Order Status:</strong> Confirmed ✓</p>
                </div>
              </div>
            )}
            
            {/* Next Steps */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-900 mb-2">What's Next?</h4>
              <div className="space-y-1 text-sm text-green-800">
                <p>✓ Our kitchen will start preparing your order</p>
                <p>✓ You'll receive SMS/Email confirmation</p>
                <p>✓ Track your order in real-time</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Link
              href={`/order-tracking/${order.id}`}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              <FaHome /> Track Order
            </Link>
            <button
              onClick={handlePrintReceipt}
              className="flex items-center justify-center gap-2 border border-gray-300 bg-white py-3 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <FaPrint /> Print Receipt
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              <FaDownload /> Download
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              <FaShare /> Share
            </button>
            <button
              onClick={sendWhatsAppConfirmation}
              className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition text-sm"
            >
              <FaWhatsapp /> WhatsApp
            </button>
          </div>
          
          <Link
            href="/menu"
            className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            <FaShoppingBag /> Continue Shopping
          </Link>
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          A confirmation email has been sent to {user?.email || order.customerEmail}
        </p>
      </div>
    </div>
  );
}
