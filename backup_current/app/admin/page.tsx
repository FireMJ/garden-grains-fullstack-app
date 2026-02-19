"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import FixedHeader from "@/components/FixedHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <FixedHeader />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Portal</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Welcome to the admin portal. Use the navigation to manage your restaurant.</p>
          </div>
        </div>
      </div>
    </>
  );
}
