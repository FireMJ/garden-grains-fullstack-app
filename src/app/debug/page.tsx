"use client";

import { useEffect, useState } from "react";
import { getFirebaseStatus, isFirebaseReady } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function DebugPage() {
  const { user } = useAuth();
  const [firebaseStatus, setFirebaseStatus] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFirebaseStatus(getFirebaseStatus());
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>

        {/* Firebase Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Firebase Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Initialized:</span>
              <span className={firebaseStatus?.initialized ? "text-green-600" : "text-red-600"}>
                {firebaseStatus?.initialized ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">API Key:</span>
              <span className={firebaseStatus?.hasApiKey ? "text-green-600" : "text-red-600"}>
                {firebaseStatus?.hasApiKey ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Auth Domain:</span>
              <span className={firebaseStatus?.hasAuthDomain ? "text-green-600" : "text-red-600"}>
                {firebaseStatus?.hasAuthDomain ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Project ID:</span>
              <span className={firebaseStatus?.hasProjectId ? "text-green-600" : "text-red-600"}>
                {firebaseStatus?.hasProjectId ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Storage Bucket:</span>
              <span className={firebaseStatus?.hasStorageBucket ? "text-green-600" : "text-red-600"}>
                {firebaseStatus?.hasStorageBucket ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Messaging Sender ID:</span>
              <span className={firebaseStatus?.hasMessagingSenderId ? "text-green-600" : "text-red-600"}>
                {firebaseStatus?.hasMessagingSenderId ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">App ID:</span>
              <span className={firebaseStatus?.hasAppId ? "text-green-600" : "text-red-600"}>
                {firebaseStatus?.hasAppId ? "✅ Set" : "❌ Missing"}
              </span>
            </div>
          </div>
        </div>

        {/* Auth Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">User Logged In:</span>
              <span className={user ? "text-green-600" : "text-gray-500"}>
                {user ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            {user && (
              <>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">User ID:</span>
                  <span className="text-gray-600">{user.uid}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Display Name:</span>
                  <span className="text-gray-600">{user.displayName || "Not set"}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Node Environment:</span>
              <span className="text-gray-600">{process.env.NODE_ENV}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Next.js Version:</span>
              <span className="text-gray-600">16.2.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
