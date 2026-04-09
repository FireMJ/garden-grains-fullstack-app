"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && isClient) {
      router.push("/login");
    }
  }, [user, loading, router, isClient]);

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Name:</span> {user.displayName || "Not set"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <Link 
                href="/profile" 
                className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Edit Profile →
              </Link>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <p className="text-gray-500">No orders yet</p>
            <Link 
              href="/menu" 
              className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Browse Menu →
              </Link>
          </div>

          {/* Driver Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Driver Portal</h2>
            <p className="text-gray-500">Deliver orders and earn money</p>
            <Link 
              href="/driver" 
              className="inline-block mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Go to Driver Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
