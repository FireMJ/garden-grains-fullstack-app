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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Firebase Status</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(firebaseStatus, null, 2)}
          </pre>
          <h2 className="text-xl font-semibold mt-6 mb-4">Auth Status</h2>
          <p>User: {user ? user.email : 'Not logged in'}</p>
        </div>
      </div>
    </div>
  );
}
