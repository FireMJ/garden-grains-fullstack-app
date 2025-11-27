"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function GoBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (pathname === "/") return null;

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => router.push("/"), 300);
  };

  return (
    <div className={`fixed ${isMobile ? "bottom-4 left-4" : "top-4 left-4"} z-50`}>
      <button
        onClick={handleGoHome}
        aria-label="Go back to homepage"
        className="flex items-center gap-2 bg-[#F4A261]/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm shadow-md hover:bg-[#F4A261] hover:shadow-lg transition-all duration-300"
      >
        <ArrowLeft size={16} className="text-white" />
        <span className="font-medium">Home</span>
      </button>
    </div>
  );
}