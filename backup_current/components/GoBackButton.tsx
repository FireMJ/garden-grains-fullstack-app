"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

interface GoBackButtonProps {
  onClick?: () => void;
}

const GoBackButton = ({ onClick }: GoBackButtonProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkMobile();
    
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  if (!isClient) {
    return (
      <button
        onClick={handleClick}
        className="flex items-center text-[#E9C46A] hover:text-[#F4A261] transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center text-[#E9C46A] hover:text-[#F4A261] transition-colors"
      aria-label="Go back"
    >
      <ChevronLeft className="w-5 h-5" />
      <span>{isMobile ? "" : "Back"}</span>
    </button>
  );
};

export default GoBackButton;
