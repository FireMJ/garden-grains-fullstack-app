"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import { FiUsers, FiPackage, FiDollarSign, FiTrendingUp, FiLogOut } from "react-icons/fi";

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: string;
}

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.role !== "admin") {
              toast.error("Unauthorized access");
              router.push("/auth/signin");
              return;
            }
            
            setUserData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              role: data.role,
            });
            
            // Fetch admin stats
            fetchAdminStats();
          } else {
            toast.error("User not found in database");
            router.push("/auth/signin");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Error checking permissions");
          router.push("/auth/signin");
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth/signin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchAdminStats = async () => {
    // Mock stats for demonstration
    setStats({
      totalUsers: 1243,
      totalOrders: 567,
      totalRevenue: 125430,
      monthlyGrowth: 12.5,
    });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error logging out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userData?.displayName || userData?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiPackage className="text-green-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiDollarSign className="text-purple-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">R{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiTrendingUp className="text-yellow-600 text-2xl" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Monthly Growth</p>
                <p className="text-2xl font-bold">{stats.monthlyGrowth}%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <p className="font-medium">New user registration</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="font-medium">Order #12345 completed</p>
                <p className="text-sm text-gray-500">4 hours ago</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="font-medium">Product inventory updated</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <p className="font-medium text-blue-700">Manage Users</p>
                <p className="text-sm text-blue-600">View and manage user accounts</p>
              </button>
              <button className="w-full text-left p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
                <p className="font-medium text-green-700">View Orders</p>
                <p className="text-sm text-green-600">Process and manage orders</p>
              </button>
              <button className="w-full text-left p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                <p className="font-medium text-purple-700">Update Products</p>
                <p className="text-sm text-purple-600">Add or modify products</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
