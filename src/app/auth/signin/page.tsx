"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isClient) return;
    
    setError("");
    setLoading(true);

    try {
      const { email, password } = formData;

      // ✅ Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Ensure Firestore user document exists with firstOrderDiscountApplied
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          email,
          createdAt: new Date().toISOString(),
          firstOrderDiscountApplied: false,
        });
      } else if (!docSnap.data()?.firstOrderDiscountApplied) {
        await setDoc(userRef, { firstOrderDiscountApplied: false }, { merge: true });
      }

      // ✅ Redirect to homepage or returnUrl
      const returnUrl = searchParams.get("returnUrl") || "/";
      router.push(returnUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state on server
  if (!isClient) {
    return (
      <main className="min-h-screen bg-[#1E4259] flex items-center justify-center px-4 py-10 text-white">
        <div className="bg-[#FAF7F2] text-[#1E4259] rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-bold mb-1">Loading...</h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1E4259] flex items-center justify-center px-4 py-10 text-white">
      <div className="bg-[#FAF7F2] text-[#1E4259] rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold mb-1">Sign In</h1>
          <p className="text-sm text-gray-600 text-center">
            Welcome back! Log in to access your account 🌿
          </p>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F4A261]"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !isClient}
            className="bg-[#F4A261] hover:bg-[#e68e42] text-white font-semibold py-3 rounded-lg transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-700">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-[#F4A261] hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>

        <p className="text-xs text-gray-500 mt-6 text-center">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[#F4A261]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-[#F4A261]">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </main>
  );
}
