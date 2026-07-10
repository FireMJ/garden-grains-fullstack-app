'use client';

import { FaCheckCircle, FaPrint, FaShare, FaWhatsapp, FaDownload, FaHome, FaShoppingBag, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';
import { VodaPayCallbackData } from '@/lib/vodapay/callbackParser';

interface PaymentReceiptProps {
  order: any;
  callbackData: VodaPayCallbackData | null;
  user: any;
  onPrint: () => void;
  onShare: () => void;
  onWhatsApp: () => void;
}

export default function PaymentReceipt({ order, callbackData, user, onPrint, onShare, onWhatsApp }: PaymentReceiptProps) {
  // Check if this was a non-card payment attempt (VodaPay Wallet or Ozow)
  const isNonCardPayment = callbackData?.paymentMethod === 'VODAPAY_WALLET' || callbackData?.paymentMethod === 'OZOW';
  const isSuccess = callbackData?.responseCode === '00' && !isNonCardPayment;
  const isComingSoon = isNonCardPayment || (!callbackData && order?.paymentMethod === 'non-card');
  
  // Use the order total from the database
  const displayAmount = order?.total ? `R${order.total.toFixed(2)}` : 'R0.00';
  
  // Coming Soon screen for non-card payment attempts
  if (isComingSoon) {
    return (
      <div id="receipt-content" className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <FaInfoCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Coming Soon!</h1>
          <p className="text-white/90">This payment method is not yet available</p>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-600 text-xl mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800 mb-1">Under Development</p>
                <p className="text-sm text-blue-700">
                  {callbackData?.paymentMethod === 'VODAPAY_WALLET' ? 'VodaPay Wallet' : 'Ozow'} integration is currently in progress.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Please use Credit/Debit Card to complete your order.
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
                  <span className="text-green-600">{displayAmount}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link
              href={`/payment?orderId=${order.id}`}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              Try Credit/Debit Card Instead
            </Link>
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Back to Checkout
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div id="receipt-content" className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className={`px-6 py-8 text-center ${isSuccess ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600'}`}>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
          <FaCheckCircle className={`w-12 h-12 ${isSuccess ? 'text-green-600' : 'text-red-600'}`} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {isSuccess ? 'Payment Successful!' : 'Payment Declined'}
        </h1>
        <p className="text-white/90">
          {isSuccess 
            ? `Thank you for your order, ${order.customerName || 'Valued Customer'}!`
            : `Your payment was not successful. No amount was deducted.`}
        </p>
      </div>
      
      <div className="p-6">
        {/* Response Code Banner */}
        {callbackData && (
          <div className={`mb-4 p-3 rounded-lg ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Response Code: {callbackData.responseCode}</p>
                <p className="text-sm">{callbackData.responseMessage}</p>
              </div>
              <div className={`text-right ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                <p className="text-2xl font-bold">{displayAmount}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Order Number</p>
              <p className="text-lg font-mono font-bold text-gray-900">#{order.id?.slice(-8)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Date & Time</p>
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Payment Details */}
        {callbackData && (
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">VodaPay Payment Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-500">Transaction ID</p><p className="font-mono text-xs break-all">{callbackData.transactionId}</p></div>
              <div><p className="text-gray-500">Response Code</p><p className={`font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>{callbackData.responseCode} - {callbackData.responseMessage}</p></div>
              <div><p className="text-gray-500">Retrieval Reference</p><p className="font-mono text-xs">{callbackData.retrievalReferenceNumber || callbackData.traceId}</p></div>
              <div><p className="text-gray-500">Payment Method</p><p className="font-medium">Credit/Debit Card</p></div>
            </div>
          </div>
        )}
        
        {/* Order Items */}
        <div className="border-b pb-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-2">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm">
                <div><span className="font-medium text-gray-900">{item.quantity}x</span><span className="text-gray-600 ml-2">{item.name}</span></div>
                <span className="text-gray-900">R{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Breakdown */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-700">R{order.subtotal?.toFixed(2) || (order.total - (order.deliveryFee || 0)).toFixed(2)}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="text-gray-700">R{order.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-900">Total Paid</span>
              <span className="text-green-600 text-xl">{displayAmount}</span>
            </div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-900 mb-2">What's Next?</h4>
          <div className="space-y-1 text-sm text-green-800">
            <p>✓ Our kitchen will start preparing your order</p>
            <p>✓ Track your order in real-time</p>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-6 pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/order-tracking/${order.id}`} className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
            <FaHome /> Track Order
          </Link>
          <button onClick={onPrint} className="flex items-center justify-center gap-2 border border-gray-300 bg-white py-3 rounded-lg hover:bg-gray-50 font-medium">
            <FaPrint /> Print Receipt
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm">
            <FaDownload /> Download
          </button>
          <button onClick={onShare} className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm">
            <FaShare /> Share
          </button>
          <button onClick={onWhatsApp} className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 text-sm">
            <FaWhatsapp /> WhatsApp
          </button>
        </div>
        <Link href="/menu" className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium">
          <FaShoppingBag /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
