"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FixedHeader from "@/components/FixedHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/");
      } else {
        router.push("/auth/signin");
      }
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
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
          <p>Redirecting...</p>
        </div>
      </div>
    </>
  );
}
