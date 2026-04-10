"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { FaUser, FaShoppingCart, FaTruck, FaStore } from "react-icons/fa";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isRestaurantUser, setIsRestaurantUser] = useState(false);
  const [isDriverUser, setIsDriverUser] = useState(false);

  const totalItems = cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

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
        const restaurantRef = doc(db, 'restaurant_staff', user.uid);
        const restaurantSnap = await getDoc(restaurantRef);
        setIsRestaurantUser(restaurantSnap.exists());
        
        const driverRef = doc(db, 'drivers', user.uid);
        const driverSnap = await getDoc(driverRef);
        setIsDriverUser(driverSnap.exists());
      }
    };
    
    if (user) {
      checkUserRole();
    }
  }, [user]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-4"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-700">
          Garden & Grains
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/menu" className="text-gray-700 hover:text-green-600 transition">
            Menu
          </Link>
          <Link href="/reviews" className="text-gray-700 hover:text-green-600 transition">
            Reviews
          </Link>
          <Link href="/reserve" className="text-gray-700 hover:text-green-600 transition">
            Reserve
          </Link>
          
          {/* Restaurant Dashboard Link */}
          {isRestaurantUser && (
            <Link href="/restaurant" className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition">
              <FaStore className="w-4 h-4" />
              <span>Restaurant</span>
            </Link>
          )}
          
          {/* Driver Dashboard Link */}
          {isDriverUser && (
            <Link href="/driver" className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition">
              <FaTruck className="w-4 h-4" />
              <span>Driver</span>
            </Link>
          )}
          
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition">
                <FaUser className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <button onClick={logout} className="text-red-600 hover:text-red-700 transition">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Login
            </Link>
          )}
          
          <Link href="/order" className="relative">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-green-600 transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
