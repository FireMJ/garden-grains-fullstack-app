"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/FirebaseAuthProvider";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  promoCode?: {
    code: string;
    discount: number;
    type: 'fixed' | 'percentage';
    used: boolean;
    appliedAt: string;
  };
  createdAt: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back{userData?.firstName ? `, ${userData.firstName}` : ''}!</p>
            </div>
            <Link
              href="/"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome to Garden & Grains!</h2>
          <p className="opacity-90">
            {userData?.promoCode && !userData.promoCode.used 
              ? `You have ${userData.promoCode.type === 'fixed' ? 'R' + userData.promoCode.discount : userData.promoCode.discount + '%'} off your next order!`
              : 'Discover fresh, wholesome meals made just for you.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/menu"
                  className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition group"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-lg p-2 group-hover:bg-green-200 transition">
                      <span className="text-green-600 text-lg">🍽️</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Order Food</h4>
                      <p className="text-sm text-gray-600">Browse our menu</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/cart"
                  className="bg-orange-50 border border-orange-200 rounded-lg p-4 hover:bg-orange-100 transition group"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-orange-100 rounded-lg p-2 group-hover:bg-orange-200 transition">
                      <span className="text-orange-600 text-lg">🛒</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">View Cart</h4>
                      <p className="text-sm text-gray-600">Check your items</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {userData?.promoCode && !userData.promoCode.used && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-600 text-2xl">🎁</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-yellow-800">Active Promotion</h3>
                    <p className="text-yellow-700 mt-1">
                      You have {userData.promoCode.type === 'fixed' ? 'R' + userData.promoCode.discount : userData.promoCode.discount + '%'} off your next order!
                    </p>
                    <p className="text-yellow-600 text-sm mt-2">
                      Code: <strong>{userData.promoCode.code}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">
                    {userData?.firstName} {userData?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{userData?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member since</p>
                  <p className="font-medium text-gray-900">
                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
