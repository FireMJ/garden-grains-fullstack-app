"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function StaffDashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/auth/signin");
      return;
    }
  }, [loading, user, router]);

  const handleSignOut = async () => {
    try {
      const { logout } = useAuth(); await logout();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Sign Out
        </button>
      </header>
      <main>
        <p>Welcome to Staff Dashboard using Firebase Auth</p>
        <p>User: {user?.email}</p>
      </main>
    </div>
  );
}
