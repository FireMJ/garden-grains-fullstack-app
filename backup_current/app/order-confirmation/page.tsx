import FixedHeader from '@/components/FixedHeader';
<FixedHeader />
<FixedHeader />

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#264653] to-[#2A9D8F] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-3xl">✓</span>
            </div>
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
              Order Number: <span className="font-mono font-bold text-[#264653]">ORD-{Date.now().toString().slice(-8)}</span>
            </p>
            <p className="text-gray-600 mt-2">
              Estimated Delivery: 30-45 minutes
            </p>
          </div>
          
          <div className="space-y-4">
            <a
              href="/tracking/ORD-123456"
              className="block w-full py-3 bg-[#E9C46A] text-white font-semibold rounded-lg hover:bg-[#F4A261] transition-colors"
            >
              Track Your Order
            </a>
            
            <a
              href="/menu"
              className="block w-full py-3 border-2 border-[#E9C46A] text-[#264653] font-semibold rounded-lg hover:bg-[#E9C46A] hover:text-white transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
