"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUserData } from "@/context/UserDataContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const { userData } = useUserData();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("client");

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    if (userData?.role) {
      setUserRole(userData.role);
    }
  }, [user, userData, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.email}!</p>
            <div className="mt-2 text-sm text-green-600">
              Role: {userRole}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Orders</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Favorites</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-500 mt-2">Saved items</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account</h3>
              <p className="text-3xl font-bold text-green-600">Active</p>
              <p className="text-sm text-gray-500 mt-2">Status</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => router.push("/menu")}
                className="bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors text-left"
              >
                <div className="font-bold">Order Food</div>
                <div className="text-sm opacity-90">Browse our menu</div>
              </button>

              <button 
                onClick={() => router.push("/dashboard/orders")}
                className="bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-left"
              >
                <div className="font-bold">Order History</div>
                <div className="text-sm opacity-90">View past orders</div>
              </button>

              <button 
                onClick={() => router.push("/dashboard/profile")}
                className="bg-purple-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-600 transition-colors text-left"
              >
                <div className="font-bold">Profile</div>
                <div className="text-sm opacity-90">Manage account</div>
              </button>

              {userRole === "admin" && (
                <button 
                  onClick={() => router.push("/dashboard/admin")}
                  className="bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-left"
                >
                  <div className="font-bold">Admin Panel</div>
                  <div className="text-sm opacity-90">Manage restaurant</div>
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center text-gray-500 py-8">
              <p>No recent activity</p>
              <p className="text-sm mt-2">Your orders and activity will appear here</p>
              <button 
                onClick={() => router.push("/menu")}
                className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Place Your First Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
