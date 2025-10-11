"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaInstagram, FaFacebook, FaTiktok, FaTwitter, FaWhatsapp } from "react-icons/fa";

import PageWrapper from "@/components/layout/PageWrapper";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import bannerImages from "@/data/bannerImages";

// -------------------- Floating Buttons --------------------
function FloatingCartButton() {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-[#F4A261] text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:bg-[#e68e42] transition flex items-center gap-2 z-40"
    >
      <span>🛒</span>
      <span>Go to Cart</span>
      {itemCount > 0 && (
        <span className="bg-[#1E4259] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

function FloatingWhatsAppButton() {
  return (
    <a
      href="https://wa.me/your-business-number"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 bg-green-500 text-white font-semibold py-3 px-3 rounded-full shadow-lg hover:bg-green-600 transition flex items-center gap-2 z-40"
    >
      <FaWhatsapp className="h-6 w-6" />
      <span className="sr-only">WhatsApp Business</span>
    </a>
  );
}

// -------------------- Fixed Header --------------------
function FixedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#1E4259] shadow-lg" : "bg-transparent"
      } h-16 sm:h-20`}
    >
      <div className="relative w-full h-full">
        {/* Logo */}
        <Link href="/" className="absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30">
          <img src="/logo/logo.png" alt="Garden & Grains Logo" className="h-10 sm:h-12 md:h-14 object-contain" />
        </Link>

        {/* Brand Name */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <span
            className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-[#6C7B58] transform transition-all duration-500 ${
              isScrolled ? "opacity-60 scale-90" : "opacity-100 scale-100"
            }`}
          >
            Garden & Grains
          </span>
        </div>

        {/* Nav + Cart */}
        <div className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 flex items-center gap-3 sm:gap-4 md:gap-5">
          {/* Role-based Links */}
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin/dashboard" className="text-white hover:text-[#F4A261] transition font-medium text-xs sm:text-sm md:text-base">
              Admin
            </Link>
          )}
          {session?.user?.role === "STAFF" && (
            <Link href="/staff/dashboard" className="text-white hover:text-[#F4A261] transition font-medium text-xs sm:text-sm md:text-base">
              Staff
            </Link>
          )}

          {!session && (
            <>
              <Link href="/signin" className="text-white hover:text-[#F4A261] transition font-medium text-xs sm:text-sm md:text-base">Sign In</Link>
              <Link href="/signup" className="text-white hover:text-[#F4A261] transition font-medium text-xs sm:text-sm md:text-base">Sign Up</Link>
            </>
          )}

          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white hover:text-[#F4A261] transition font-medium text-xs sm:text-sm md:text-base"
            >
              Sign Out
            </button>
          )}

          {/* WhatsApp */}
          <a href="https://wa.me/your-business-number" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-400 transition">
            <FaWhatsapp className="h-5 w-5" />
          </a>

          {/* Cart */}
          <Link href="/cart" className="relative text-white hover:text-[#F4A261] transition">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#F4A261] text-white text-[10px] sm:text-xs rounded-full w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center animate-bounce">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

// -------------------- Updated Dynamic Banner --------------------
function DynamicBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Hydration guard
  useEffect(() => {
    setIsClient(true);
    setCurrentIndex(Math.floor(Math.random() * bannerImages.length));
  }, []);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));

  // Auto-rotate only on client
  useEffect(() => {
    if (!isClient || isPaused) return;
    const interval = setInterval(goNext, 5000);
    return () => clearInterval(interval);
  }, [isClient, isPaused]);

  // Preload neighbors - FIXED: using window.Image instead of Image
  useEffect(() => {
    if (!isClient) return;
    const nextIndex = (currentIndex + 1) % bannerImages.length;
    const prevIndex = currentIndex === 0 ? bannerImages.length - 1 : currentIndex - 1;
    
    [bannerImages[nextIndex], bannerImages[prevIndex]].forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [currentIndex, isClient]);

  // Swipe handlers
  const handlers = {
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    trackMouse: true,
    preventScrollOnSwipe: true,
  };

  // Don't render dynamic content until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-xs sm:text-sm md:text-lg">
          wholesome. crave-worthy. nourishment‑focused.
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF7F2] to-transparent"></div>
      </div>
    );
  }

  return (
    <div {...handlers} className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      <Image 
        key={currentIndex} 
        src={bannerImages[currentIndex]} 
        alt="Banner" 
        fill 
        className="object-cover transition-opacity duration-700" 
        priority 
      />
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-xs sm:text-sm md:text-lg">
        wholesome. crave-worthy. nourishment‑focused.
      </div>

      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF7F2] to-transparent"></div>

      <button 
        onClick={goPrev} 
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        ◀
      </button>
      <button 
        onClick={goNext} 
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        ▶
      </button>

      <button 
        onClick={() => setIsPaused((prev) => !prev)} 
        className="absolute top-2 left-2 bg-black/40 text-white px-3 py-1 rounded hover:bg-black/60 transition text-xs"
      >
        {isPaused ? "▶ Play" : "⏸ Pause"}
      </button>

      <div className="absolute bottom-4 w-full flex justify-center gap-2">
        {bannerImages.map((src, idx) => (
          <div 
            key={idx} 
            className="relative group" 
            onMouseEnter={() => setHoveredDot(idx)} 
            onMouseLeave={() => setHoveredDot(null)}
          >
            <button 
              onClick={() => setCurrentIndex(idx)} 
              className={`w-3 h-3 rounded-full transition ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
              }`} 
            />
            {hoveredDot === idx && (
              <div className="hidden sm:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-1 rounded shadow-lg z-50">
                <Image 
                  src={src} 
                  alt={`Preview ${idx + 1}`} 
                  width={80} 
                  height={50} 
                  className="object-cover rounded" 
                  loading="lazy" 
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------- HomePage --------------------
const favoriteImages = [
  "/images/favorites/protein-pack-salad.jpg",
  "/images/favorites/chicken-avo-wrap.jpg",
  "/images/favorites/avocado-protein-stack-salad.jpg",
];

export default function HomePage() {
  return (
    <PageWrapper>
      <main className="min-h-screen w-screen overflow-x-hidden bg-[#1E4259] text-white">
        <FixedHeader />
        <div className="pt-16 sm:pt-20">
          {/* Banner */}
          <section className="relative w-screen overflow-x-hidden">
            <DynamicBanner />
            <Link href="/menu" className="absolute top-2 right-2 sm:top-6 sm:right-6 bg-[#F4A261] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base hover:bg-[#e68e42] transition shadow-lg z-10 animate-pulse">
              Explore the Menu →
            </Link>
          </section>

          {/* Explore Menu */}
          <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#FAF7F2] to-[#1E4259] shadow-inner text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#6C7B58] mb-4 sm:mb-6">Explore Our Menu</h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Fresh, wholesome dishes designed to nourish and delight — discover your next mouth-watering favorite.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {[
                { name: "Salads", href: "/menu/salads" },
                { name: "StirFry", href: "/menu/stirfry" },
                { name: "Bowls", href: "/menu/bowls" },
                { name: "Toasties", href: "/menu/toasties" },
                { name: "Wraps", href: "/menu/wraps" },
                { name: "Fries", href: "/menu/fries" },
                { name: "Soups", href: "/menu/soups" },
                { name: "Pastas", href: "/menu/pastas" },
                { name: "Breakfast", href: "/menu/breakfast" },
                { name: "Smoothies", href: "/menu/smoothies" },
                { name: "Juices", href: "/menu/juices" },
              ].map(({ name, href }) => (
                <Link key={name} href={href} className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#F4A261] text-white text-xs sm:text-sm font-medium hover:bg-[#e68e42] transition">
                  {name}
                </Link>
              ))}
            </div>
          </section>

          {/* Customer Favorites */}
          <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 bg-[#1E4259]">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">Customer Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-4">
              {favoriteImages.map((src, i) => (
                <MenuItemCard
                  key={i}
                  name={
                    i === 0 ? "Protein Pack Salad" :
                    i === 1 ? "Chicken Avo Wrap" :
                    "Avocado Protein Stack Salad"
                  }
                  price={i === 0 ? 125 : 115}
                  tags={
                    i === 0 ? ["Popular"] :
                    i === 1 ? ["Customer Favorite", "New"] :
                    ["Vegetarian"]
                  }
                  image={src}
                  className="transition-transform duration-300 hover:scale-105"
                />
              ))}
            </div>
          </section>

          {/* Catering Promo */}
          <section className="bg-[#FAF7F2] p-6 sm:p-8 rounded-lg text-center mb-12 sm:mb-16 mx-4 text-[#1E4259]">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#6C7B58] mb-2">Hosting a Gathering?</h2>
            <p className="text-sm sm:text-base text-[#4A665E] mb-4">Let us cater your next event with wholesome, crowd-pleasing dishes.</p>
            <Link href="/catering" className="inline-block bg-[#F4A261] text-white text-xs sm:text-sm px-4 py-2 rounded-lg hover:bg-[#e68e42] transition">
              Explore Catering Options
            </Link>
          </section>

          {/* Promo Badge */}
          <section className="text-center mb-12 sm:mb-16">
            <div className="inline-block bg-[#F4A261] text-white text-sm sm:text-base px-4 py-2 rounded-lg">
              R30 OFF Your First Order
            </div>
            <p className="mt-2 text-xs sm:text-sm text-gray-200">Available for self-collection, takeaway, and delivery.</p>
          </section>

          {/* Vision Statement */}
          <section className="bg-[#FAF7F2] text-[#1E4259] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-[#6C7B58]">Our Vision</h2>
            <p className="text-sm sm:text-base md:text-lg text-[#4A665E] leading-relaxed max-w-3xl mx-auto">
              A vibrant, modern brand where clean eating meets connection. Fresh, flavorful, and halaal‑friendly — made for locals, remote workers, students, health enthusiasts, and anyone craving wholesome food.
            </p>
          </section>

          {/* Social Media */}
          <section className="bg-gradient-to-r from-[#1e4259] to-[#163342] text-white py-6 px-4 sm:px-6 md:px-12 text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Connect with us</h3>
            <div className="flex justify-center gap-4 sm:gap-6">
              {[
                { href: "https://instagram.com/garden.and.grains", icon: <FaInstagram className="h-5 w-5 sm:h-6 sm:w-6" />, alt: "Instagram" },
                { href: "https://facebook.com/@garden&grains", icon: <FaFacebook className="h-5 w-5 sm:h-6 sm:w-6" />, alt: "Facebook" },
                { href: "https://tiktok.com/@gardenandgrains", icon: <FaTiktok className="h-5 w-5 sm:h-6 sm:w-6" />, alt: "TikTok" },
                { href: "https://twitter.com/gardenandgrains", icon: <FaTwitter className="h-5 w-5 sm:h-6 sm:w-6" />, alt: "Twitter" },
                { href: "https://wa.me/your-business-number", icon: <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />, alt: "WhatsApp Business" },
              ].map(({ href, icon, alt }) => (
                <a key={alt} href={href} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#F4A261] transition-colors duration-300">
                  {icon}
                </a>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gradient-to-r from-[#1e4259] to-[#163342] text-center text-sm text-white py-4 px-4">
            <p>© 2025 Garden &amp; Grains • Health Eating • Follow us @garden.and.grains</p>
          </footer>
        </div>

        {/* Floating Buttons */}
        <FloatingCartButton />
        <FloatingWhatsAppButton />
      </main>
    </PageWrapper>
  );
}