// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    memberSince: "2024-01-15",
    points: 1250,
    tier: "Gold"
  };

  useEffect(() => {
    // Simulate loading orders
    setTimeout(() => {
      setOrders([
        { id: 1, date: "2024-01-15", total: 185.50, status: "Delivered" },
        { id: 2, date: "2024-01-10", total: 92.75, status: "Delivered" },
        { id: 3, date: "2024-01-05", total: 210.25, status: "Delivered" },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    // Clear user data and redirect to home
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <div className="mt-2">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {user.tier} Member
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "overview" 
                      ? "bg-green-50 text-green-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "orders" 
                      ? "bg-green-50 text-green-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  🛒 My Orders
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "favorites" 
                      ? "bg-green-50 text-green-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ❤️ Favorites
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "addresses" 
                      ? "bg-green-50 text-green-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  📍 Addresses
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "settings" 
                      ? "bg-green-50 text-green-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ⚙️ Account Settings
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-6 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-2xl">🛒</span>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-2xl">⭐</span>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Reward Points</p>
                        <p className="text-2xl font-bold text-gray-900">{user.points}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-2xl">👑</span>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Member Tier</p>
                        <p className="text-2xl font-bold text-gray-900">{user.tier}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h3>
                  {isLoading ? (
                    <p>Loading orders...</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-bold text-gray-900">Order #{order.id}</p>
                            <p className="text-gray-600 text-sm">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">R {order.total.toFixed(2)}</p>
                            <span className="text-sm text-green-600">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>
                {isLoading ? (
                  <p>Loading order history...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-gray-700">Order #</th>
                          <th className="text-left py-3 px-4 text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 text-gray-700">Total</th>
                          <th className="text-left py-3 px-4 text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">{order.id}</td>
                            <td className="py-3 px-4">{order.date}</td>
                            <td className="py-3 px-4">R {order.total.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button className="text-green-600 hover:text-green-800 text-sm">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">My Favorite Items</h3>
                <p className="text-gray-600">No favorites yet. Start adding your favorite dishes from the menu!</p>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Saved Addresses</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900">Home</p>
                        <p className="text-gray-600">123 Main Street, Stellenbosch</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        Default
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Edit
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                <button className="mt-6 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                  + Add New Address
                </button>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+27 12 345 6789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}