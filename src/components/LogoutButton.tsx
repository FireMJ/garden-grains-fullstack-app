'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
    >
      Sign Out
    </button>
  );
}
