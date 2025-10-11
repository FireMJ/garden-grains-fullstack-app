"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/signin");
  }, [session, status, router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {session?.user?.name || "Guest"}!</h1>
      <p>This is your client dashboard. You can browse menu, place orders, and track them here.</p>
    </div>
  );
}
