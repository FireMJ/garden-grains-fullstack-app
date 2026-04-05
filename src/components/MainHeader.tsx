"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FaSignInAlt,
  FaUser,
  FaTruck,
  FaHeart,
  FaShoppingCart
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function MainHeader() {
  const { cartItems, totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Calculate cart count
  const cartCount = totalItems || (cartItems && Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0) 
    : 0);
  
  // Track navigation clicks in Firebase
  const trackNavClick = async (page: string) => {
    try {
      const statsRef = doc(db, 'stats', 'navigation');
      await updateDoc(statsRef, {
        [page + 'Clicks']: increment(1),
        [`last${page.charAt(0).toUpperCase() + page.slice(1)}Click`]: new Date()
      }, { merge: true });
    } catch (error) {
      console.error("Error tracking navigation click:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 py-2 md:py-3">
        <div className="flex items-center justify-between">
          {/* Logo with Brand Name */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group" onClick={() => trackNavClick('home')}>
            <div className="relative h-10 w-auto md:h-12 flex items-center">
              <Image 
                src="/logo/logo.png" 
                alt="Garden & Grains" 
                width={120} 
                height={40}
                className="object-contain w-auto h-full"
                priority
              />
            </div>
            {/* Brand Name - Bold and next to logo */}
            <div className="flex flex-col leading-tight">
              <span className="text-base md:text-lg font-extrabold text-gray-900">Garden & Grains</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-[#94aa4d] transition font-medium px-3 py-2 text-sm lg:text-base"
              onClick={() => trackNavClick('home')}
            >
              Home
            </Link>
            <Link 
              href="/menu" 
              className="text-gray-700 hover:text-[#94aa4d] transition font-medium px-3 py-2 text-sm lg:text-base"
              onClick={() => trackNavClick('menu')}
            >
              Menu
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-[#94aa4d] transition font-medium px-3 py-2 text-sm lg:text-base"
              onClick={() => trackNavClick('about')}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-[#94aa4d] transition font-medium px-3 py-2 text-sm lg:text-base"
              onClick={() => trackNavClick('contact')}
            >
              Contact
            </Link>
            
            {/* Auth Buttons - Compact */}
            <div className="flex items-center space-x-2 ml-2">
              <Link 
                href="/login" 
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1.5 px-3 rounded-xl transition-all duration-300 text-sm"
                onClick={() => trackNavClick('login')}
              >
                <FaSignInAlt className="h-3.5 w-3.5" />
                <span>Login</span>
              </Link>
              <Link 
                href="/signup" 
                className="flex items-center gap-1.5 bg-[#94aa4d] hover:bg-[#7d9243] text-white font-medium py-1.5 px-3 rounded-xl transition-all duration-300 text-sm"
                onClick={() => trackNavClick('signup')}
              >
                <FaUser className="h-3.5 w-3.5" />
                <span>Sign Up</span>
              </Link>
              <Link 
                href="/driver" 
                className="flex items-center gap-1.5 bg-[#1e4259] hover:bg-[#2c536b] text-white font-medium py-1.5 px-3 rounded-xl transition-all duration-300 text-sm"
                onClick={() => trackNavClick('driver')}
              >
                <FaTruck className="h-3.5 w-3.5" />
                <span>Driver</span>
              </Link>
            </div>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-3">
            <Link href="/cart" className="relative" onClick={() => trackNavClick('cart')}>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-[#ff9800] rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                <FaShoppingCart className="text-white text-sm md:text-base" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1e4259] text-white text-xs w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
            </Link>

            <button
              className="md:hidden w-8 h-8 flex items-center justify-center text-[#1e4259]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <span className="text-xl font-bold">✕</span>
              ) : (
                <span className="text-xl">☰</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 pb-3 border-t pt-3 overflow-hidden"
          >
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-[#94aa4d] transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50"
                onClick={() => {
                  trackNavClick('home');
                  setIsMenuOpen(false);
                }}
              >
                Home
              </Link>
              <Link 
                href="/menu" 
                className="text-gray-700 hover:text-[#94aa4d] transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50"
                onClick={() => {
                  trackNavClick('menu');
                  setIsMenuOpen(false);
                }}
              >
                Menu
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-[#94aa4d] transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50"
                onClick={() => {
                  trackNavClick('about');
                  setIsMenuOpen(false);
                }}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-[#94aa4d] transition font-medium py-2 px-2 rounded-lg hover:bg-gray-50"
                onClick={() => {
                  trackNavClick('contact');
                  setIsMenuOpen(false);
                }}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Buttons - Compact Grid */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
                <Link 
                  href="/login" 
                  className="flex flex-col items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-1 rounded-xl transition-all duration-300 text-xs"
                  onClick={() => {
                    trackNavClick('login');
                    setIsMenuOpen(false);
                  }}
                >
                  <FaSignInAlt className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link 
                  href="/signup" 
                  className="flex flex-col items-center justify-center gap-1 bg-[#94aa4d] hover:bg-[#7d9243] text-white font-medium py-2 px-1 rounded-xl transition-all duration-300 text-xs"
                  onClick={() => {
                    trackNavClick('signup');
                    setIsMenuOpen(false);
                  }}
                >
                  <FaUser className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
                <Link 
                  href="/driver" 
                  className="flex flex-col items-center justify-center gap-1 bg-[#1e4259] hover:bg-[#2c536b] text-white font-medium py-2 px-1 rounded-xl transition-all duration-300 text-xs"
                  onClick={() => {
                    trackNavClick('driver');
                    setIsMenuOpen(false);
                  }}
                >
                  <FaTruck className="h-4 w-4" />
                  <span>Driver</span>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
