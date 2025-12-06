"use client";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Confirmation</h1>
        <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. You'll receive a confirmation email shortly.
            </p>
            <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
