// src/components/CartUIWrapper.tsx
"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function CartUIWrapper() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // You can add authentication logic here if needed
      // For example: sync cart with user profile, etc.
      console.log("Auth state changed:", currentUser?.email);
    });
    return () => unsubscribe();
  }, []);

  // This component doesn't render anything visible
  // It's used for side effects like auth state management
  return null;
}