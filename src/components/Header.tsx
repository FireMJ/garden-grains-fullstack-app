"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { FaUser, FaShoppingCart } from "react-icons/fa";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#2F5D50]">
          Garden & Grains
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="text-gray-700 hover:text-[#2F5D50] transition">
            Menu
          </Link>
          <Link href="/reviews" className="text-gray-700 hover:text-[#2F5D50] transition">
            Reviews
          </Link>
          <Link href="/reserve" className="text-gray-700 hover:text-[#2F5D50] transition">
            Reserve
          </Link>
          
          {user ? (
            <>
              <Link href="/profile" className="text-gray-700 hover:text-[#2F5D50] transition flex items-center gap-2">
                <FaUser />
                <span>{user.displayName || "Profile"}</span>
              </Link>
              <button onClick={logout} className="text-red-600 hover:text-red-700 transition">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-[#2F5D50] text-white px-4 py-2 rounded-lg hover:bg-[#244a3f] transition">
              Login
            </Link>
          )}
          
          <Link href="/order" className="relative">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-[#2F5D50] transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-700 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-700"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link href="/menu" className="text-gray-700 hover:text-[#2F5D50] transition py-2">
              Menu
            </Link>
            <Link href="/reviews" className="text-gray-700 hover:text-[#2F5D50] transition py-2">
              Reviews
            </Link>
            <Link href="/reserve" className="text-gray-700 hover:text-[#2F5D50] transition py-2">
              Reserve
            </Link>
            
            {user ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-[#2F5D50] transition py-2 flex items-center gap-2">
                  <FaUser />
                  <span>{user.displayName || "Profile"}</span>
                </Link>
                <button onClick={logout} className="text-red-600 hover:text-red-700 transition py-2 text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-[#2F5D50] text-white px-4 py-2 rounded-lg hover:bg-[#244a3f] transition text-center">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
