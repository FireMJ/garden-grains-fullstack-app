"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";
import { FaStore, FaTruck, FaUser, FaShoppingCart, FaHome, FaUtensils, FaStar, FaCalendarAlt } from "react-icons/fa";

export default function MainHeader() {
  const { user, logout } = useAuth();
  const { cartItems, totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRestaurantUser, setIsRestaurantUser] = useState(false);
  const [isDriverUser, setIsDriverUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check user role
  useEffect(() => {
    const checkUserRole = async () => {
      if (user?.uid) {
        try {
          // Check if user is restaurant staff
          const restaurantRef = doc(db, 'restaurant_staff', user.uid);
          const restaurantSnap = await getDoc(restaurantRef);
          setIsRestaurantUser(restaurantSnap.exists());
          
          // Check if user is driver
          const driverRef = doc(db, 'drivers', user.uid);
          const driverSnap = await getDoc(driverRef);
          setIsDriverUser(driverSnap.exists());
        } catch (error) {
          console.error("Error checking user roles:", error);
        }
      }
      setLoading(false);
    };
    
    if (user) {
      checkUserRole();
    } else {
      setLoading(false);
    }
  }, [user]);

  const trackClick = async (page: string) => {
    if (!user) return;
    
    try {
      const statsRef = doc(db, 'stats', 'navigation');
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
          restaurantClicks: 0,
          driverClicks: 0,
        });
      }
      
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white shadow-md py-2" : "bg-white/95 backdrop-blur-sm py-4"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl font-bold text-[#2F5D50] hover:text-[#244a3f] transition"
          onClick={() => trackClick('home')}
        >
          Garden & Grains
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="flex items-center gap-1 text-gray-700 hover:text-[#2F5D50] transition" onClick={() => trackClick('menu')}>
            <FaUtensils className="w-4 h-4" />
            Menu
          </Link>
          <Link href="/reviews" className="flex items-center gap-1 text-gray-700 hover:text-[#2F5D50] transition" onClick={() => trackClick('reviews')}>
            <FaStar className="w-4 h-4" />
            Reviews
          </Link>
          <Link href="/reserve" className="flex items-center gap-1 text-gray-700 hover:text-[#2F5D50] transition" onClick={() => trackClick('reserve')}>
            <FaCalendarAlt className="w-4 h-4" />
            Reserve
          </Link>
          
          {/* Restaurant Dashboard - only for restaurant staff */}
          {!loading && isRestaurantUser && (
            <Link 
              href="/restaurant" 
              className="flex items-center gap-1 text-gray-700 hover:text-[#2F5D50] transition font-medium"
              onClick={() => trackClick('restaurant')}
            >
              <FaStore className="w-4 h-4 text-green-600" />
              <span>Restaurant</span>
            </Link>
          )}
          
          {/* Driver Dashboard - only for drivers */}
          {!loading && isDriverUser && (
            <Link 
              href="/driver" 
              className="flex items-center gap-1 text-gray-700 hover:text-[#2F5D50] transition font-medium"
              onClick={() => trackClick('driver')}
            >
              <FaTruck className="w-4 h-4 text-blue-600" />
              <span>Driver</span>
            </Link>
          )}
          
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-1 text-gray-700 hover:text-[#2F5D50] transition" onClick={() => trackClick('profile')}>
                <FaUser className="w-4 h-4" />
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
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-[#2F5D50] transition" />
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
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('home')}>
              <FaHome className="w-4 h-4" />
              Home
            </Link>
            <Link href="/menu" className="flex items-center gap-2 text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('menu')}>
              <FaUtensils className="w-4 h-4" />
              Menu
            </Link>
            <Link href="/reviews" className="flex items-center gap-2 text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('reviews')}>
              <FaStar className="w-4 h-4" />
              Reviews
            </Link>
            <Link href="/reserve" className="flex items-center gap-2 text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('reserve')}>
              <FaCalendarAlt className="w-4 h-4" />
              Reserve
            </Link>
            
            {/* Restaurant Dashboard - Mobile */}
            {!loading && isRestaurantUser && (
              <Link href="/restaurant" className="flex items-center gap-2 text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('restaurant')}>
                <FaStore className="w-4 h-4 text-green-600" />
                Restaurant Dashboard
              </Link>
            )}
            
            {/* Driver Dashboard - Mobile */}
            {!loading && isDriverUser && (
              <Link href="/driver" className="flex items-center gap-2 text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('driver')}>
                <FaTruck className="w-4 h-4 text-blue-600" />
                Driver Dashboard
              </Link>
            )}
            
            {user ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 text-gray-700 hover:text-[#2F5D50] transition py-2" onClick={() => trackClick('profile')}>
                  <FaUser className="w-4 h-4" />
                  Profile
                </Link>
                <button onClick={() => { logout(); trackClick('logout'); }} className="flex items-center gap-2 text-red-600 hover:text-red-700 transition py-2">
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
