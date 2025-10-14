"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user role and redirect to appropriate dashboard
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          switch (userData.role) {
            case "admin":
              router.push("/dashboard/admin");
              break;
            case "staff":
              router.push("/dashboard/staff");
              break;
            case "client":
            case "customer":
              router.push("/dashboard/client");
              break;
            default:
              router.push("/dashboard/client");
          }
        } else {
          router.push("/dashboard/client");
        }
      } else {
        router.push("/auth/signin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
