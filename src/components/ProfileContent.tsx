"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHistory, FaCreditCard, FaSignOutAlt, FaEdit } from "react-icons/fa";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user && mounted) {
      router.push('/login');
    }
  }, [user, router, mounted]);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Orders", value: "12", icon: FaHistory },
    { label: "Loyalty Points", value: "450", icon: FaCreditCard },
    { label: "Reviews Written", value: "8", icon: FaUser },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <FaUser className="w-12 h-12 text-green-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.displayName || 'User'}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString()}</p>
            </div>
            <Link
              href="/profile/edit"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <FaEdit /> Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6 text-center">
              <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaHistory className="text-green-600" />
            Recent Orders
          </h2>
          <div className="space-y-3">
            {[1, 2, 3].map((order) => (
              <div key={order} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">Order #{2024001 + order}</p>
                    <p className="text-sm text-gray-500">March {15 + order}, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">R{(150 + order * 50).toFixed(2)}</p>
                    <span className="text-sm text-green-600">Delivered</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/orders" className="block text-center mt-4 text-green-600 hover:underline">
            View All Orders →
          </Link>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
          <div className="space-y-3">
            <Link href="/profile/addresses" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-green-600" />
                <span>Manage Addresses</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
            <Link href="/profile/notifications" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-green-600" />
                <span>Notification Preferences</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition text-red-600"
            >
              <div className="flex items-center gap-3">
                <FaSignOutAlt />
                <span>Sign Out</span>
              </div>
              <span className="text-red-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
