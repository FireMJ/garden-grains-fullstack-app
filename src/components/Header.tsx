'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt, 
  FaHome, 
  FaUtensils, 
  FaHeart, 
  FaPhone, 
  FaTruck,
  FaBars,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa';

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/', icon: <FaHome size={16} /> },
    { name: 'Menu', href: '/menu', icon: <FaUtensils size={16} /> },
    { name: 'Our Story', href: '/about', icon: <FaHeart size={16} /> },
    { name: 'Contact', href: '/contact', icon: <FaPhone size={16} /> },
    { name: 'Driver', href: '/driver', icon: <FaTruck size={16} /> },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'
      }`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Image */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md transition-all group-hover:shadow-lg group-hover:scale-105 bg-gradient-to-br from-[#2F5D50] to-[#23483E] flex items-center justify-center">
                {!logoError ? (
                  <Image
                    src="/logo/logo.png"
                    alt="Garden Grains Logo"
                    width={36}
                    height={36}
                    className="object-cover"
                    onError={() => setLogoError(true)}
                    priority
                  />
                ) : (
                  <span className="text-white font-bold text-lg">GG</span>
                )}
              </div>
              <div>
                <span className="font-bold text-gray-800 group-hover:text-[#2F5D50] transition-colors text-lg">
                  Garden Grains
                </span>
                <span className="text-xs text-gray-400 block -mt-1">Farm to Table</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-[#2F5D50] border-b-2 border-[#2F5D50] pb-0.5'
                      : 'text-gray-600 hover:text-[#2F5D50] hover:border-b-2 hover:border-[#2F5D50]/50 pb-0.5'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              {/* Cart Button */}
              <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group">
                <FaShoppingCart size={18} className="text-gray-600 group-hover:text-[#2F5D50]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2F5D50] text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                >
                  <FaUser size={16} className="text-gray-600 group-hover:text-[#2F5D50]" />
                </button>
                
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                              <FaUserCircle size={16} className="text-[#2F5D50]" />
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.displayName || 'Customer'}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Orders
                          </Link>
                          <Link
                            href="/profile/addresses"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Saved Addresses
                          </Link>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <FaSignOutAlt size={12} />
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/signup"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Create Account
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive(link.href)
                        ? 'text-[#2F5D50] bg-[#2F5D50]/5'
                        : 'text-gray-600 hover:text-[#2F5D50] hover:bg-gray-50'
                    }`}
                  >
                    {link.icon}
                    <span className="font-medium text-sm">{link.name}</span>
                  </Link>
                ))}
                
                {/* Mobile divider */}
                <div className="border-t border-gray-100 my-2"></div>
                
                {/* Mobile cart link */}
                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-[#2F5D50] hover:bg-gray-50 transition-all duration-200"
                >
                  <FaShoppingCart size={16} />
                  <span className="font-medium text-sm">Cart</span>
                  {itemCount > 0 && (
                    <span className="ml-auto bg-[#2F5D50] text-white text-xs rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16"></div>
    </>
  );
}
