'use client';

import { FaCheckCircle, FaReceipt, FaPrint, FaShare, FaWhatsapp, FaDownload, FaHome, FaShoppingBag, FaTimesCircle, FaRedo } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatAmount, VodaPayCallbackData, getPaymentStatus, getTestCardInfo } from '@/lib/vodapay/callbackParser';

interface PaymentReceiptProps {
  order: any;
  callbackData: VodaPayCallbackData | null;
  user: any;
  onPrint: () => void;
  onShare: () => void;
  onWhatsApp: () => void;
}

export default function PaymentReceipt({ order, callbackData, user, onPrint, onShare, onWhatsApp }: PaymentReceiptProps) {
  const router = useRouter();
  const paymentStatus = callbackData ? getPaymentStatus(callbackData.responseCode) : { isSuccess: false, status: 'Unknown', message: 'Unknown', color: 'gray' };
  const testCardInfo = callbackData ? getTestCardInfo(callbackData.responseCode) : null;
  
  // Only show the paid amount if payment was successful
  const displayAmount = paymentStatus.isSuccess && callbackData?.transactionAmount 
    ? formatAmount(callbackData.transactionAmount)
    : 'R0.00';
  
  const handleTryAgain = () => {
    router.push(`/payment?orderId=${order.id}`);
  };
  
  return (
    <div id="receipt-content" className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Status Header */}
      <div className={`px-6 py-8 text-center ${paymentStatus.isSuccess ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-orange-600'}`}>
        <div className={`inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4`}>
          {paymentStatus.isSuccess ? (
            <FaCheckCircle className="w-12 h-12 text-green-600" />
          ) : (
            <FaTimesCircle className="w-12 h-12 text-red-600" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {paymentStatus.isSuccess ? 'Payment Successful!' : 'Payment Declined'}
        </h1>
        <p className="text-white/90">
          {paymentStatus.isSuccess 
            ? `Thank you for your order, ${order.customerName || 'Valued Customer'}!`
            : `Your payment was not successful. No amount was deducted.`}
        </p>
      </div>
      
      <div className="p-6">
        {/* Response Code Banner */}
        {callbackData && (
          <div className={`mb-4 p-3 rounded-lg ${paymentStatus.isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Response Code: {callbackData.responseCode}</p>
                <p className="text-sm">{callbackData.responseMessage}</p>
                {testCardInfo && (
                  <p className="text-xs mt-1 text-gray-600">Test Card Used: {testCardInfo.cardNumber}</p>
                )}
              </div>
              <div className={`text-right ${paymentStatus.isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                <p className="text-2xl font-bold">{displayAmount}</p>
                {!paymentStatus.isSuccess && (
                  <p className="text-xs">No amount deducted</p>
                )}
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
              <p className="text-sm font-medium text-gray-900">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* VodaPay Payment Details */}
        {callbackData && (
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">VodaPay Payment Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Transaction ID</p>
                <p className="font-mono text-xs break-all">{callbackData.transactionId}</p>
              </div>
              <div>
                <p className="text-gray-500">Response Code</p>
                <p className={`font-medium ${paymentStatus.isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                  {callbackData.responseCode} - {callbackData.responseMessage}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Retrieval Reference</p>
                <p className="font-mono text-xs">{callbackData.retrievalReferenceNumber || callbackData.traceId}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium">{callbackData.paymentMethod === '06' ? 'Credit/Debit Card' : callbackData.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Merchant ID</p>
                <p className="font-mono text-xs">{callbackData.merchantId}</p>
              </div>
              <div>
                <p className="text-gray-500">Session ID</p>
                <p className="font-mono text-xs break-all">{callbackData.sessionId}</p>
              </div>
            </div>
          </div>
        )}
        
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
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount Applied</span>
              <span>-R{order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-900">Total Paid</span>
              <span className={`${paymentStatus.isSuccess ? 'text-green-600' : 'text-red-600'} text-xl`}>
                {displayAmount}
              </span>
            </div>
            {!paymentStatus.isSuccess && (
              <p className="text-xs text-gray-500 text-right mt-1">No charges were made to your card</p>
            )}
          </div>
        </div>
        
        {/* Delivery Info */}
        {order.orderType === 'delivery' && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">🚚 Delivery Information</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong>Address:</strong> {order.deliveryAddress}</p>
              <p><strong>Estimated Time:</strong> 30-45 minutes</p>
            </div>
          </div>
        )}
        
        {/* Next Steps */}
        <div className={`rounded-lg p-4 mb-6 ${paymentStatus.isSuccess ? 'bg-green-50' : 'bg-yellow-50'}`}>
          <h4 className={`font-semibold mb-2 ${paymentStatus.isSuccess ? 'text-green-900' : 'text-yellow-800'}`}>
            {paymentStatus.isSuccess ? "What's Next?" : "Payment Failed - What now?"}
          </h4>
          {paymentStatus.isSuccess ? (
            <div className="space-y-1 text-sm text-green-800">
              <p>✓ Our kitchen will start preparing your order</p>
              <p>✓ You'll receive SMS/Email confirmation</p>
              <p>✓ Track your order in real-time</p>
            </div>
          ) : (
            <div className="space-y-1 text-sm text-yellow-800">
              <p>⚠️ Your payment was declined with response code: {callbackData?.responseCode}</p>
              <p>⚠️ No amount was deducted from your card</p>
              <p>⚠️ Please check your card details and try again</p>
              <p className="mt-2 text-xs">Tip: Use card 4444 4444 4444 4400 for a successful payment</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-6 pt-0 space-y-3">
        {paymentStatus.isSuccess ? (
          <>
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
          </>
        ) : (
          <>
            <button
              onClick={handleTryAgain}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold"
            >
              <FaRedo /> Try Again with Same Order
            </button>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/checkout" className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 font-medium">
                New Checkout
              </Link>
              <Link href="/menu" className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium">
                Browse Menu
              </Link>
            </div>
          </>
        )}
        <Link href="/menu" className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium">
          <FaShoppingBag /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}
