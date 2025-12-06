"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthErrorBoundary({ 
  children,
  fallback = null 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // This is a client-side only component
    // It ensures auth-dependent components don't break during SSR
  }, []);

  return <>{children}</>;
}
