"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaEnvelope, FaBell, FaSms, FaSave, FaCheck } from "react-icons/fa";

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState({
    emailOrders: true,
    emailPromotions: false,
    emailNewsletter: false,
    pushOrders: true,
    pushPromotions: true,
    smsUpdates: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Load saved preferences from localStorage
    const savedPrefs = localStorage.getItem(`notifications_${user.uid}`);
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, [user, router]);

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Save to localStorage
    if (user) {
      localStorage.setItem(`notifications_${user.uid}`, JSON.stringify(preferences));
    }
    
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/profile" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition">
          <FaArrowLeft /> Back to Profile
        </Link>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
            {showSaved && (
              <div className="flex items-center gap-2 text-green-600 text-sm animate-fade-in">
                <FaCheck /> Saved!
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaEnvelope className="text-green-600" />
                Email Notifications
              </h2>
              <div className="space-y-3 ml-6">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-gray-700">Order updates</span>
                    <p className="text-xs text-gray-500">Receive order confirmations and delivery updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailOrders}
                    onChange={() => togglePreference('emailOrders')}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-gray-700">Promotions & offers</span>
                    <p className="text-xs text-gray-500">Exclusive deals and seasonal specials</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailPromotions}
                    onChange={() => togglePreference('emailPromotions')}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-gray-700">Newsletter</span>
                    <p className="text-xs text-gray-500">Weekly farm updates and recipes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailNewsletter}
                    onChange={() => togglePreference('emailNewsletter')}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </label>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="border-b pb-4">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaBell className="text-green-600" />
                Push Notifications
              </h2>
              <div className="space-y-3 ml-6">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-gray-700">Order status updates</span>
                    <p className="text-xs text-gray-500">Real-time updates on your order</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.pushOrders}
                    onChange={() => togglePreference('pushOrders')}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-gray-700">Promotions & offers</span>
                    <p className="text-xs text-gray-500">Flash sales and special events</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.pushPromotions}
                    onChange={() => togglePreference('pushPromotions')}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </label>
              </div>
            </div>

            {/* SMS Notifications */}
            <div className="pb-4">
              <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaSms className="text-green-600" />
                SMS Notifications
              </h2>
              <div className="space-y-3 ml-6">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-gray-700">Delivery updates</span>
                    <p className="text-xs text-gray-500">SMS alerts when your driver is nearby</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.smsUpdates}
                    onChange={() => togglePreference('smsUpdates')}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaSave /> {isSaving ? "Saving..." : "Save Preferences"}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              You can change these preferences at any time. We'll never share your contact info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
