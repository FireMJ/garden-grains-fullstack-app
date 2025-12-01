'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function FixedHeader() {
  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#F4A261] rounded-full"></div>
            <span className="text-xl font-bold text-gray-900">Garden Grains</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#F4A261] transition">
              Home
            </Link>
            <Link href="/menu" className="text-gray-700 hover:text-[#F4A261] transition">
              Menu
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#F4A261] transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#F4A261] transition">
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-[#F4A261] transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F4A261] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/staff/dashboard"
                  className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-[#1E4259] text-white px-4 py-2 rounded-lg hover:bg-[#2a536e] transition"
              >
                Staff Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
