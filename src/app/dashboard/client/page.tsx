"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for demonstration
  const mockOrders = [
    {
      id: "ORD-001",
      total: 125.50,
      status: "completed",
      createdAt: "2024-01-15T10:30:00Z",
      items: [
        { name: "Chicken Avo Wrap", price: 115, quantity: 1 },
        { name: "Orange Juice", price: 10.50, quantity: 1 }
      ]
    },
    {
      id: "ORD-002", 
      total: 89.00,
      status: "preparing",
      createdAt: "2024-01-14T14:20:00Z",
      items: [
        { name: "Garden Salad", price: 89, quantity: 1 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">Manage your orders and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/menu"
                className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition font-semibold"
              >
                Order Food
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/menu"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition group text-center"
          >
            <div className="bg-green-100 p-3 rounded-lg inline-block mb-3">
              <span className="text-2xl">🍽️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#F4A261] mb-2">
              Order Food
            </h3>
            <p className="text-gray-600 text-sm">Browse our delicious menu</p>
          </Link>

          <Link
            href="/cart"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition group text-center"
          >
            <div className="bg-blue-100 p-3 rounded-lg inline-block mb-3">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#F4A261] mb-2">
              View Cart
            </h3>
            <p className="text-gray-600 text-sm">Review your order items</p>
          </Link>

          <Link
            href="/reviews"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition group text-center"
          >
            <div className="bg-purple-100 p-3 rounded-lg inline-block mb-3">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#F4A261] mb-2">
              Leave Review
            </h3>
            <p className="text-gray-600 text-sm">Share your experience</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {mockOrders.length > 0 ? (
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">Order {order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.items.length} item(s) • R {order.total}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <button className="text-[#F4A261] hover:text-[#e68e42] text-sm font-medium mt-1">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link
                href="/menu"
                className="bg-[#F4A261] text-white px-6 py-2 rounded-lg hover:bg-[#e68e42] transition font-semibold inline-block"
              >
                Place Your First Order
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
