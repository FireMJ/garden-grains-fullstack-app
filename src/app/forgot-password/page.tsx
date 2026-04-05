"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      
      // Handle specific Firebase error codes
      switch (err.code) {
        case 'auth/user-not-found':
          setError("No account found with this email address.");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address.");
          break;
        case 'auth/too-many-requests':
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Back to Login Link */}
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email and we'll send you a link to reset your password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <p className="text-red-600 text-sm flex-1">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 p-6 bg-green-50 rounded-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-600 mb-4">
                  We've sent a password reset link to <strong className="text-green-600">{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Didn't receive it? Check your spam folder or{" "}
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-green-600 hover:underline font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>
              
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 font-medium transition inline-flex items-center gap-1"
              >
                Return to Login <span>→</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We'll send a password reset link to this email address.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Remember your password?{" "}
            <Link href="/login" className="text-green-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
