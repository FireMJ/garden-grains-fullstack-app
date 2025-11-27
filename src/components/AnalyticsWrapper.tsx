"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch((err) => console.error("Failed to track page visit", err));
  }, [pathname]);

  return <>{children}</>;
}