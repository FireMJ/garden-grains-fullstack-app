// src/app/driver/page.tsx
"use client";

import { useState } from "react";

export default function DriverPage() {
  const [driverId, setDriverId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      alert("Driver login would connect to driver portal API");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Driver Portal</h1>
          <p className="text-lg text-gray-600">Track deliveries and manage your schedule</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Driver Login</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Driver ID
                </label>
                <input
                  type="text"
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your driver ID"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Login as Driver"}
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Need driver access? Contact dispatch at{" "}
                <a href="tel:+27218878765" className="text-green-600 hover:underline">
                  +27 21 887 8765
                </a>
              </p>
            </div>
          </div>

          {/* Driver Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Current Deliveries</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-bold text-gray-900">Order #1234</p>
                    <p className="text-sm text-gray-600">15 Main Street</p>
                  </div>
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                    In Transit
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-bold text-gray-900">Order #1235</p>
                    <p className="text-sm text-gray-600">42 Oak Avenue</p>
                  </div>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    Ready
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Driver Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Flexible working hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Weekly payouts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Performance bonuses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Fuel allowance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">How do I get started as a driver?</h4>
              <p className="text-gray-600">
                Contact our driver coordinator at +27 21 887 8765 or visit us at Uitsig Wine Farm 
                with your valid driver's license and vehicle registration.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-2">What are the delivery hours?</h4>
              <p className="text-gray-600">
                Deliveries run from 10:00 AM to 8:30 PM daily. Drivers can choose shifts that 
                work best for their schedule.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-2">How are deliveries assigned?</h4>
              <p className="text-gray-600">
                Deliveries are assigned based on your location and availability through our 
                driver app. You'll receive notifications for nearby orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}