"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/auth";

export default function StaffDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (!user) {
        router.push("/auth");
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E4259] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E4259] text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4A261]">Staff Dashboard</h1>
            <p className="text-gray-300 mt-2">Welcome, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Sign Out
            </button>
            <button 
              onClick={() => router.push("/")}
              className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition"
            >
              Back to Site
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Order Management</h3>
            <p className="text-gray-300">View and manage customer orders</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Menu Management</h3>
            <p className="text-gray-300">Update menu items and pricing</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Analytics</h3>
            <p className="text-gray-300">View sales and customer analytics</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400">Staff dashboard features coming soon...</p>
        </div>
      </div>
    </div>
  );
}
