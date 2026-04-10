'use client';

import { useRouter } from 'next/navigation';

export default function PaymentTestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Payment Gateway Testing
        </h1>

        {/* VodaPay Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
              📱
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">VodaPay</h2>
              <p className="text-gray-600">South Africa's leading payment gateway</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Sandbox Environment:</strong> Test with virtual cards. Add header <code className="bg-yellow-100 px-1 rounded">"test": true</code>
            </p>
          </div>

          <button
            onClick={() => router.push('/payment/vodapay/test')}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Test VodaPay Integration →
          </button>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Test Cards:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 p-2 rounded">
                <code>4444 4444 4444 4400</code> - ✅ Approved
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <code>4444 4444 4444 4451</code> - ❌ Insufficient Funds
              </div>
            </div>
          </div>
        </div>

        {/* UAT Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-blue-600 text-xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Important UAT Notice</h3>
              <p className="text-sm text-blue-800">
                Complete UAT testing must be signed off by the Integration team before migrating to production. 
                Your production merchant API key is not enabled until testing is complete.
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Contact: miniprogramsupport@vodacom.co.za for UAT sign-off
              </p>
            </div>
          </div>
        </div>

        {/* Test API Keys Info */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Sandbox Test API Keys</h3>
          <div className="space-y-1 text-sm">
            <code className="block bg-white p-2 rounded">d605f89b-079c-11ed-b83a-06c42a9d493e</code>
            <code className="block bg-white p-2 rounded">d60d60ab-079c-11ed-b83a-06c42a9d493e</code>
            <code className="block bg-white p-2 rounded">d6135e0e-079c-11ed-b83a-06c42a9d493e</code>
          </div>
        </div>
      </div>
    </div>
  );
}
