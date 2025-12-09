"use client";
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  User, 
  Home, 
  Utensils, 
  Coffee, 
  Phone, 
  Truck,
  Star,
  Info,
  Package,
  MapPin,
  Clock,
  Shield,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

export default function FixedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const { cart } = useCart();
  
  // Calculate cart totals
  const itemCount = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : 0;
    
  const cartTotal = Array.isArray(cart)
    ? cart.reduce((sum, item) => {
        const basePrice = item.basePrice || item.price || 0;
        const baseExtra = item.baseExtra || 0;
        const addOnsTotal = (item.selectedAddOns || []).reduce((a, b) => a + (b.price || 0), 0);
        const friesPrice = item.fries?.price || 0;
        const juicePrice = item.juice?.price || 0;
        const itemTotal = (basePrice + baseExtra + addOnsTotal + friesPrice + juicePrice) * (item.quantity || 1);
        return sum + itemTotal;
      }, 0)
    : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Main navigation items
  const mainNavItems = [
    { name: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'Menu', href: '/menu', icon: <Utensils className="w-4 h-4" /> },
    { name: 'Catering', href: '/catering', icon: <Coffee className="w-4 h-4" /> },
    { name: 'About', href: '/about', icon: <Info className="w-4 h-4" /> },
    { name: 'Contact', href: '/contact', icon: <Phone className="w-4 h-4" /> },
  ];

  // Secondary navigation items
  const secondaryNavItems = [
    { name: 'Delivery', href: '/delivery', icon: <Truck className="w-4 h-4" /> },
    { name: 'Tracking', href: '/tracking', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Schedule', href: '/schedule-order', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' 
        : 'bg-gradient-to-r from-green-50 to-yellow-50 border-b border-green-100 py-3'
    }`}>
      <div className="container mx-auto px-4">
        {/* Top Row - Logo, Contact, Hours */}
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full"></div>
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <span className="block text-green-600 font-bold text-lg leading-tight">GG</span>
                  <span className="block text-[8px] text-gray-600 font-semibold">Fresh</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl text-gray-900 leading-tight group-hover:text-green-600 transition-colors">
                Garden Grains
              </span>
              <span className="text-sm text-gray-600">Healthy • Fresh • Delicious</span>
            </div>
          </Link>

          {/* Desktop Contact & Hours - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-right">
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="font-medium">(123) 456-7890</span>
              </div>
              <p className="text-sm text-gray-500">Open 8AM - 8PM</p>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">100% Organic</span>
            </div>
          </div>

          {/* Right Side - Cart & User */}
          <div className="flex items-center space-x-3">
            {/* Favorites */}
            <button className="hidden md:flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Favorites</span>
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg group"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Cart</span>
                <span className="text-xs font-bold">R{cartTotal.toFixed(2)}</span>
              </div>
            </Link>

            {/* User/Auth */}
            {user ? (
              <Link
                href="/profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <span className="font-medium text-gray-700 block">Welcome back</span>
                  <span className="text-sm text-gray-500">{user.name?.split(' ')[0] || 'User'}</span>
                </div>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                <span className="hidden md:inline">Sign In / Register</span>
                <span className="md:hidden">Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Main Navigation */}
        <nav className="hidden lg:flex items-center justify-center space-x-1 mt-3">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors group"
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
          
          {/* Separator */}
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          
          {secondaryNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-white z-40 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {/* Mobile Contact Info */}
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-gray-900">(123) 456-7890</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-700">8AM - 8PM</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>100% Organic Ingredients</span>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Main Menu</h3>
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Secondary Navigation */}
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Services</h3>
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="border-t pt-6 mt-6">
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">My Account</span>
                    <span className="text-sm text-gray-600">{user.email || 'View Profile'}</span>
                  </div>
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth"
                    className="block w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-center rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full py-3 border-2 border-green-500 text-green-600 text-center rounded-xl font-bold hover:bg-green-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-6 mt-6">
              <Link
                href="/cart"
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-yellow-50 border border-green-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">Your Cart</span>
                    <span className="text-sm text-gray-600">{itemCount} items</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600 block">R{cartTotal.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">View Cart →</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
