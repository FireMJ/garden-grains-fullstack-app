"use client";
import React, { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#F3F5F0] text-gray-900">
      {children}
    </div>
  );
};

export default PageWrapper;
