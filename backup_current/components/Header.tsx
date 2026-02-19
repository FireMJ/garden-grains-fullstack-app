"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/context/AuthContext";
import { 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiHome,
  FiCoffee,
  FiUsers,
  FiPhone
} from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();

  const cartItemsCount = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: <FiHome /> },
    { href: "/menu", label: "Menu", icon: <FiCoffee /> },
    { href: "/about", label: "About", icon: <FiUsers /> },
    { href: "/contact", label: "Contact", icon: <FiPhone /> },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">GG</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">Garden Grains</h1>
                <p className="text-xs text-gray-600">Healthy Bowls & Salads</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 font-medium transition"
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-green-600 transition"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Auth/Profile */}
              <Link
                href={user ? "/profile" : "/auth/signin"}
                className="p-2 text-gray-700 hover:text-green-600 transition"
              >
                <FiUser className="w-6 h-6" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-green-600 transition"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                <div className="pt-4 border-t">
                  <Link
                    href={user ? "/profile" : "/auth/signin"}
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="font-medium">
                      {user ? "My Profile" : "Sign In"}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
