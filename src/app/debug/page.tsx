"use client";

import { useEffect, useState } from "react";
import { getFirebaseStatus, isFirebaseAvailable } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function DebugPage() {
  const { user, loading } = useAuth();
  const [firebaseStatus, setFirebaseStatus] = useState<any>(null);
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    setFirebaseStatus(getFirebaseStatus());
    
    // Check environment variables (only shows if they exist, not their values)
    setEnvVars({
      apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      googleMapsKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      vodapayKey: !!process.env.NEXT_PUBLIC_VODAPAY_TEST_API_KEY,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔧 Firebase Debug Page</h1>

        {/* Firebase Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Firebase Initialization</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Status:</span>{' '}
              {isFirebaseAvailable() ? (
                <span className="text-green-600 font-bold">✅ Connected</span>
              ) : (
                <span className="text-red-600 font-bold">❌ Not Connected</span>
              )}
            </p>
            <p>
              <span className="font-medium">Project ID:</span>{' '}
              <span className="font-mono text-sm">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set'}</span>
            </p>
            <p>
              <span className="font-medium">Auth Domain:</span>{' '}
              <span className="font-mono text-sm">{process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not set'}</span>
            </p>
          </div>

          {firebaseStatus && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Configuration Status:</h3>
              <ul className="space-y-1 text-sm grid grid-cols-2 gap-2">
                <li>API Key: {firebaseStatus.hasApiKey ? '✅' : '❌'}</li>
                <li>Auth Domain: {firebaseStatus.hasAuthDomain ? '✅' : '❌'}</li>
                <li>Project ID: {firebaseStatus.hasProjectId ? '✅' : '❌'}</li>
                <li>Storage Bucket: {firebaseStatus.hasStorageBucket ? '✅' : '❌'}</li>
                <li>Messaging Sender ID: {firebaseStatus.hasMessagingSenderId ? '✅' : '❌'}</li>
                <li>App ID: {firebaseStatus.hasAppId ? '✅' : '❌'}</li>
                <li>Measurement ID: {firebaseStatus.hasMeasurementId ? '✅' : '❌'}</li>
              </ul>
            </div>
          )}
        </div>

        {/* Auth Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Authentication Status</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : user ? (
            <div>
              <p className="text-green-600 font-bold mb-3">✅ User is logged in</p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><span className="font-medium">UID:</span> <code className="text-xs">{user.uid}</code></p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Name:</span> {user.displayName || 'Not set'}</p>
                <p><span className="font-medium">Email Verified:</span> {user.emailVerified ? '✅ Yes' : '❌ No'}</p>
                <p><span className="font-medium">Created:</span> {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : 'Unknown'}</p>
                <p><span className="font-medium">Last Sign In:</span> {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'Unknown'}</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-yellow-600 font-bold mb-3">⚠️ No user logged in</p>
              <div className="flex gap-3 mt-4">
                <a href="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  Go to Login
                </a>
                <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Sign Up
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Environment Variables</h2>
          <p className="text-sm text-gray-500 mb-3">(Shows only if variables are set, not their values)</p>
          <ul className="space-y-1 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
            <li>NEXT_PUBLIC_FIREBASE_API_KEY: {envVars.apiKey ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: {envVars.authDomain ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID: {envVars.projectId ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: {envVars.storageBucket ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: {envVars.messagingSenderId ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_FIREBASE_APP_ID: {envVars.appId ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: {envVars.measurementId ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: {envVars.googleMapsKey ? '✅ Set' : '❌ Missing'}</li>
            <li>NEXT_PUBLIC_VODAPAY_TEST_API_KEY: {envVars.vodapayKey ? '✅ Set' : '❌ Missing'}</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-800 mb-2">🚀 Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
              Create Test Account
            </a>
            <a href="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
              Login
            </a>
            <a href="/profile" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm">
              View Profile
            </a>
            <a href="/menu" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition text-sm">
              Browse Menu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
