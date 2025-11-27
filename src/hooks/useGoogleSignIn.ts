// src/hooks/useGoogleSignIn.ts
"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, AuthError } from "firebase/auth";
import { toast } from "react-hot-toast";

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) {
        toast.error("Google sign in failed.");
        return null;
      }

      return user;
    } catch (error: unknown) {
      console.error("Google sign in error:", error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if ('code' in error) {
          // Firebase AuthError
          const authError = error as AuthError;
          switch (authError.code) {
            case 'auth/popup-closed-by-user':
              toast.error("Sign in cancelled.");
              break;
            case 'auth/popup-blocked':
              toast.error("Popup blocked. Please allow popups for this site.");
              break;
            case 'auth/network-request-failed':
              toast.error("Network error. Please check your connection.");
              break;
            default:
              toast.error("Google sign in failed. Please try again.");
          }
        } else {
          // Generic Error
          toast.error("Google sign in failed. Please try again.");
        }
      } else {
        // Unknown error type
        toast.error("An unexpected error occurred.");
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signInWithGoogle, loading };
};