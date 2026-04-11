'use client';

import { useState } from 'react';
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, AuthError } from "firebase/auth";

// Simple toast function without external dependency
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // You can replace this with a proper toast library later
  console.log(`${type.toUpperCase()}: ${message}`);
  alert(message); // Temporary fallback
};

export const useGoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      showToast(`Welcome ${result.user.displayName || 'User'}!`, 'success');
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
      showToast(errorMessage, 'error');
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
