import FixedHeader from '@/components/FixedHeader';
<FixedHeader />
<FixedHeader />

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const CheckoutSuccessPage = () => {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Generate order number on client only
    setOrderNumber(`ORD-${Date.now().toString().slice(-8)}`);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#264653] to-[#2A9D8F] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Confirmed! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your order. We're preparing your delicious meal now.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Order Details
            </h2>
            <p className="text-gray-600">
              Order Number:{" "}
              <span className="font-mono font-bold text-[#264653]">
                {orderNumber || "Loading..."}
              </span>
            </p>
            <p className="text-gray-600 mt-2">
              Estimated Delivery: 30-45 minutes
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              href="/tracking/ORD-123456"
              className="block w-full py-3 bg-[#E9C46A] text-white font-semibold rounded-lg hover:bg-[#F4A261] transition-colors"
            >
              Track Your Order
            </Link>
            
            <Link
              href="/menu"
              className="block w-full py-3 border-2 border-[#E9C46A] text-[#264653] font-semibold rounded-lg hover:bg-[#E9C46A] hover:text-white transition-colors"
            >
              Continue Shopping
            </Link>
            
            <p className="text-sm text-gray-500 mt-6">
              A confirmation email has been sent to your inbox.
              For any questions, contact us at support@gardengrains.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
