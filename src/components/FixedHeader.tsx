"use client";

import React from 'react';
import { FiShoppingCart, FiUser, FiMenu } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function FixedHeader() {
  const { user } = useAuth();
  
  // Safely get cart with try-catch
  let cart = [];
  let cartItemCount = 0;
  
  try {
    const cartContext = useCart();
    cart = cartContext.cart || [];
    cartItemCount = Array.isArray(cart) 
      ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
      : 0;
  } catch (error) {
    console.warn('Cart context not available:', error);
    // Use empty cart as fallback
    cart = [];
    cartItemCount = 0;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-xl">GG</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Garden Grains</h1>
              <p className="text-xs text-gray-500">Healthy Bowls & More</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/menu" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Menu
            </Link>
            <Link 
              href="/catering" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Catering
            </Link>
            <Link 
              href="/reviews" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Reviews
            </Link>
            <Link 
              href="/schedule-order" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Schedule Order
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Cart with badge */}
            <Link href="/cart" className="relative">
              <FiShoppingCart className="w-6 h-6 text-gray-700 hover:text-green-600 transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User profile / Auth */}
            <Link href={user ? "/profile" : "/auth/signin"} className="flex items-center space-x-2">
              <FiUser className="w-6 h-6 text-gray-700 hover:text-green-600 transition-colors" />
              <span className="hidden md:inline text-sm text-gray-600">
                {user ? 'Account' : 'Sign In'}
              </span>
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden">
              <FiMenu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-around">
            <Link 
              href="/menu" 
              className="flex flex-col items-center text-xs text-gray-600 hover:text-green-600"
            >
              <span>Menu</span>
            </Link>
            <Link 
              href="/catering" 
              className="flex flex-col items-center text-xs text-gray-600 hover:text-green-600"
            >
              <span>Catering</span>
            </Link>
            <Link 
              href="/reviews" 
              className="flex flex-col items-center text-xs text-gray-600 hover:text-green-600"
            >
              <span>Reviews</span>
            </Link>
            <Link 
              href="/schedule-order" 
              className="flex flex-col items-center text-xs text-gray-600 hover:text-green-600"
            >
              <span>Schedule</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
