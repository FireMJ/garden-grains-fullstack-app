"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// This FixedHeader is for pages that need their own header
// The main layout already has a Header component
export default function FixedHeader() {
  const pathname = usePathname();
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-green-700">
            Garden & Grains
          </Link>
          <nav className="flex space-x-6">
            <Link 
              href="/" 
              className={`${pathname === "/" ? "text-green-600 font-semibold" : "text-gray-600"}`}
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className={`${pathname === "/menu" ? "text-green-600 font-semibold" : "text-gray-600"}`}
            >
              Menu
            </Link>
            <Link 
              href="/cart" 
              className={`${pathname === "/cart" ? "text-green-600 font-semibold" : "text-gray-600"}`}
            >
              Cart
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
