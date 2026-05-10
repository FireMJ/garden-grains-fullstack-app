"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaTruck, FaSignInAlt } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { cartItems, totalItems } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = totalItems || (cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10">
              <Image
                src="/logo/logo.png"
                alt="Garden & Grains"
                fill
                sizes="40px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base md:text-lg font-extrabold text-gray-900">Garden & Grains</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition">Home</Link>
            <Link href="/menu" className="text-gray-700 hover:text-green-600 transition">Menu</Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-green-600 transition">Contact</Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:scale-105 transition">
                <FaShoppingCart className="text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
            </Link>
            
            {user ? (
              <div className="relative">
                <button onClick={() => router.push('/profile')} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUser />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-green-600">Login</Link>
                <Link href="/signup" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Sign Up
                </Link>
              </div>
            )}
            
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-600 py-2">Home</Link>
              <Link href="/menu" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-600 py-2">Menu</Link>
              <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-600 py-2">About</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-green-600 py-2">Contact</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
