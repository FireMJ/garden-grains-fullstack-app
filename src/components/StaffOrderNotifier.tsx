"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export default function StaffOrderNotifier() {
  useEffect(() => {
    const auth = getAuth();
    let currentUser: User | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      currentUser = user;
    });

    // Example: simulate a WebSocket or Firestore listener for new orders
    const simulateNewOrder = setInterval(() => {
      if (currentUser) {
        toast(`New order received!`, { description: "Check the dashboard." });
      }
    }, 15000);

    return () => {
      unsubscribeAuth();
      clearInterval(simulateNewOrder);
    };
  }, []);

  return null;
}
