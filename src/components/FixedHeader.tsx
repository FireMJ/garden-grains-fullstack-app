"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function FixedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { state } = useCart();
  const cart = state.items;
  const { user, logout, loading } = useAuth();
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#1E4259] shadow-lg" : "bg-transparent"
      } h-16`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-50">
            <div className="relative h-10 w-40">
              <Image 
                src="/logo/logo.png" 
                alt="Garden & Grains Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation Menu - Centered */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-[#F4A261] transition font-medium">
              Home
            </Link>
            <Link href="/menu" className="text-white hover:text-[#F4A261] transition font-medium">
              Menu
            </Link>
            <Link href="/about" className="text-white hover:text-[#F4A261] transition font-medium">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-[#F4A261] transition font-medium">
              Contact
            </Link>
          </nav>

          {/* Right Side - Auth & Cart */}
          <div className="flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm hidden sm:block">
                      Hi, {user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-white hover:text-[#F4A261] transition text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/auth" className="text-white hover:text-[#F4A261] transition text-sm font-medium">
                    Sign In
                  </Link>
                )}
                <Link href="/cart" className="relative text-white hover:text-[#F4A261] transition">
                  <span className="text-xl">🛒</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#F4A261] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
