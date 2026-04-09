"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";

export default function MainHeader() {
  const { user, logout } = useAuth();
  const { cartItems, totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const trackClick = async (page: string) => {
    try {
      const statsRef = doc(db, 'stats', 'navigation');
      
      // Check if document exists, create if not
      const docSnap = await getDoc(statsRef);
      if (!docSnap.exists()) {
        await setDoc(statsRef, {
          homeClicks: 0,
          menuClicks: 0,
          reviewsClicks: 0,
          reserveClicks: 0,
          loginClicks: 0,
          profileClicks: 0,
          orderClicks: 0,
          lastHomeClick: null,
          lastMenuClick: null,
          lastReviewsClick: null,
          lastReserveClick: null,
          lastLoginClick: null,
          lastProfileClick: null,
          lastOrderClick: null,
        });
      }
      
      // Update the click count
      const updateData: Record<string, any> = {
        [`${page}Clicks`]: increment(1),
        [`last${page.charAt(0).toUpperCase() + page.slice(1)}Click`]: new Date()
      };
      await updateDoc(statsRef, updateData);
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  const itemCount = totalItems || cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#2F5D50]" onClick={() => trackClick('home')}>
          Garden & Grains
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="text-gray-700 hover:text-[#2F5D50] transition" onClick={() => trackClick('menu')}>
            Menu
          </Link>
          <Link href="/reviews" className="text-gray-700 hover:text-[#2F5D50] transition" onClick={() => trackClick('reviews')}>
            Reviews
          </Link>
          <Link href="/reserve" className="text-gray-700 hover:text-[#2F5D50] transition" onClick={() => trackClick('reserve')}>
            Reserve
          </Link>
          <Link href="/driver" className="text-gray-700 hover:text-[#2F5D50] transition" onClick={() => trackClick('driver')}>
            Driver
          </Link>
          
          {user ? (
            <>
              <Link href="/profile" className="text-gray-700 hover:text-[#2F5D50] transition" onClick={() => trackClick('profile')}>
                Profile
              </Link>
              <button onClick={() => { logout(); trackClick('logout'); }} className="text-red-600 hover:text-red-700 transition">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-[#2F5D50] text-white px-4 py-2 rounded-lg hover:bg-[#244a3f] transition" onClick={() => trackClick('login')}>
              Login
            </Link>
          )}
          
          <Link href="/order" className="relative" onClick={() => trackClick('order')}>
            <span className="text-2xl">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
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
            <Link href="/menu" className="text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('menu')}>
              Menu
            </Link>
            <Link href="/reviews" className="text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('reviews')}>
              Reviews
            </Link>
            <Link href="/reserve" className="text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('reserve')}>
              Reserve
            </Link>
            <Link href="/driver" className="text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('driver')}>
              Driver
            </Link>
            
            {user ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('profile')}>
                  Profile
                </Link>
                <button onClick={() => { logout(); trackClick('logout'); }} className="text-red-600 hover:text-red-700 transition py-2 text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-[#2F5D50] text-white px-4 py-2 rounded-lg hover:bg-[#244a3f] transition text-center" onClick={() => trackClick('login')}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
