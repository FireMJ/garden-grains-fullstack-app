'use client';

import { useState } from 'react';
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, AuthError } from "firebase/auth";

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      const authError = err as AuthError;
      let errorMessage = 'Failed to sign in with Google';
      
      switch (authError.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in cancelled. Please try again.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup was blocked. Please allow popups for this site.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = authError.message || errorMessage;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
  };
};
