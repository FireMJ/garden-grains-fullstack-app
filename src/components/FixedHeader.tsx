"use client";

import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHome, FiPackage, FiStar, FiCalendar, FiTruck } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { usePathname } from 'next/navigation';

export default function FixedHeader() {
  const { user } = useAuth();
  const { cart } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Calculate cart item count
  const cartItemCount = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Don't show header on login/signup pages to avoid duplication
  const hideHeaderPaths = ['/driver/login', '/auth/signin', '/auth/signup', '/admin', '/staff'];
  if (hideHeaderPaths.some(path => pathname?.startsWith(path))) {
    return null;
  }

  // Navigation items - simplified for better mobile
  const navItems = [
    { href: '/', label: 'Home', icon: <FiHome className="w-5 h-5" /> },
    { href: '/menu', label: 'Menu', icon: <FiPackage className="w-5 h-5" /> },
    { href: '/catering', label: 'Catering', icon: <FiPackage className="w-5 h-5" /> },
    { href: '/reviews', label: 'Reviews', icon: <FiStar className="w-5 h-5" /> },
  ];

  // Check if current path is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  // Toggle body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white shadow-md py-2' 
            : 'bg-white/95 backdrop-blur-sm py-3 border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo - Simplified for mobile */}
            <Link href="/" className="flex items-center space-x-2 z-50">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">GG</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-800">Garden Grains</h1>
                <p className="text-xs text-gray-500">Healthy Bowls</p>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    isActive(item.href)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {/* Driver link for desktop */}
              <Link 
                href="/driver/login"
                className="px-4 py-2 rounded-lg font-medium text-blue-600 hover:bg-blue-50 transition-colors text-sm flex items-center"
              >
                <FiTruck className="w-4 h-4 mr-1" />
                Driver
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-2">
              {/* Cart with badge */}
              <Link 
                href="/cart" 
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`Cart (${cartItemCount} items)`}
              >
                <FiShoppingCart className="w-6 h-6 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>

              {/* User profile - Hidden on mobile */}
              <Link 
                href={user ? "/profile" : "/auth/signin"} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:flex items-center"
                aria-label={user ? 'Account' : 'Sign In'}
              >
                <FiUser className="w-6 h-6 text-gray-700" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6 text-gray-700" />
                ) : (
                  <FiMenu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-4 py-3">
              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="text-xs font-medium mt-1">{item.label}</span>
                  </Link>
                ))}
                
                {/* Driver portal for mobile */}
                <Link
                  href="/driver/login"
                  className="flex flex-col items-center justify-center p-3 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiTruck className="w-5 h-5" />
                  <span className="text-xs font-medium mt-1">Driver</span>
                </Link>
                
                {/* User for mobile */}
                <Link
                  href={user ? "/profile" : "/auth/signin"}
                  className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 text-gray-700" />
                  <span className="text-xs font-medium mt-1">
                    {user ? 'Account' : 'Sign In'}
                  </span>
                </Link>
              </div>

              {/* Cart summary for mobile */}
              {cartItemCount > 0 && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiShoppingCart className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-green-800 text-sm">
                          {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in cart
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/cart"
                      className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      View
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Add global styles for animation and mobile menu */}
      <style jsx global>{`
        /* Prevent body scroll when menu is open on mobile */
        body.menu-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
        }

        /* Smooth transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
      `}</style>
    </>
  );
}
