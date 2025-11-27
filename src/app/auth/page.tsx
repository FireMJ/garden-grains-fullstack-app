"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { user, signIn, signUp, signInWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      // Success - user will be redirected via useEffect
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = "Authentication failed";
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password";
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "An account with this email already exists";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Success - user will be redirected via useEffect
    } catch (error: any) {
      console.error("Google sign in error:", error);
      let errorMessage = "Google sign in failed";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign in was cancelled";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked by your browser. Please allow popups for this site.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google sign in is not enabled. Please contact support.";
      }
      
      alert(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E4259] to-[#2D536B] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E4259] to-[#2D536B] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
          <p>Redirecting you to the homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E4259] to-[#2D536B] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <div className="relative h-16 w-48 mx-auto">
              <Image src="/logo/logo.png" alt="Garden & Grains Logo" fill className="object-contain" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Join Garden & Grains"}
          </h2>
          <p className="mt-2 text-gray-300">
            {isLogin ? "Sign in to your account" : "Create your account and get 20% off your first order!"}
          </p>
        </div>

        {/* Benefits Card */}
        {!isLogin && (
          <div className="bg-[#F4A261] text-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🎉 Special Welcome Offer!</h3>
            <p className="text-sm">Get 20% off your first order when you create an account</p>
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A261] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                Signing in...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-400" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-gray-300">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-lg" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] focus:z-10 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:border-[#F4A261] focus:z-10 transition-colors"
                placeholder="Enter your password"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#F4A261] hover:bg-[#e68e42] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A261] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#F4A261]"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                isLogin ? "Sign In" : "Create Account & Save 20%"
              )}
            </button>
          </div>

          {/* Switch between login/signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#F4A261] hover:text-[#e68e42] font-medium text-sm transition-colors"
            >
              {isLogin ? "Need an account? Sign up and save 20%" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Continue without account */}
          <div className="text-center pt-4 border-t border-gray-200">
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              ← Continue without account
            </Link>
          </div>
        </form>

        {/* Delivery Info */}
        <div className="text-center text-sm text-gray-300 space-y-2 bg-white/10 p-4 rounded-lg">
          <p className="font-semibold">🚚 Free Delivery</p>
          <p>Free delivery on orders over R850 within 10km radius</p>
        </div>

        {/* Features */}
        <div className="text-center text-sm text-gray-300 space-y-2">
          <p>🍃 Fresh ingredients daily</p>
          <p>🚚 Free delivery over R850 (10km)</p>
          <p>💳 Secure checkout</p>
          <p>🎁 20% off first order</p>
        </div>
      </div>
    </div>
  );
}
