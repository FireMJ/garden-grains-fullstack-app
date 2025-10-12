"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSwipeable } from "react-swipeable";
import { FaInstagram, FaFacebook, FaTiktok, FaTwitter, FaWhatsapp } from "react-icons/fa";

import PageWrapper from "@/components/layout/PageWrapper";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { useCart } from "@/context/CartContext";
import bannerImages from "@/data/bannerImages";

// -------------------- Floating Buttons --------------------
function FloatingCartButton() {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

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
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
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
        <Link
          href="/"
          className="absolute left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-30"
        >
          <div className="relative h-10 w-32 sm:h-12 sm:w-40 md:h-14 md:w-48">
            <Image
              src="/logo/logo.png"
              alt="Garden & Grains Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <span
            className={`text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-[#6C7B58] transform transition-all duration-500 ${
              isScrolled ? "opacity-60 scale-90" : "opacity-100 scale-100"
            }`}
          >
            Garden & Grains
          </span>
        </div>

        <div className="absolute right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-30 flex items-center gap-3 sm:gap-4 md:gap-5">
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin/dashboard"
              className="text-white hover:text-[#F4A261] transition font-medium text-xs sm:text-sm md:text-base"
            >
              Admin
            </Link>
          )}
          {session?.user?.role === "STAFF" && (
            <Link
              href="/staff/dashboard"
              className="text-white hover:text-[#F4A261] transition font-medium text-xs sm:text-sm md:text-base"
            >
              Staff
            </Link>
          )}

          {!session && (
            <>
              <Link
                href="/signin"
                className="text-white hover:text-[#F4A261] transition font-medium text-xs sm:text-sm md:text-base"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-white hover:text-[#F4A261] transition font-medium text-xs sm:text-sm md:text-base"
              >
                Sign Up
              </Link>
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

          <a
            href="https://wa.me/your-business-number"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-green-400 transition"
          >
            <FaWhatsapp className="h-5 w-5" />
          </a>

          <Link
            href="/cart"
            className="relative text-white hover:text-[#F4A261] transition"
          >
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

// -------------------- Dynamic Banner --------------------
const DynamicBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentIndex(Math.floor(Math.random() * bannerImages.length));
  }, []);

  const goNext = useCallback(
    () => setCurrentIndex((p) => (p + 1) % bannerImages.length),
    []
  );
  const goPrev = useCallback(
    () => setCurrentIndex((p) => (p === 0 ? bannerImages.length - 1 : p - 1)),
    []
  );

  useEffect(() => {
    if (!isClient || isPaused) return;
    const id = setInterval(goNext, 5000);
    return () => clearInterval(id);
  }, [isClient, isPaused, goNext]);

  useEffect(() => {
    if (!isClient) return;
    const preloadIndices = [
      currentIndex,
      (currentIndex + 1) % bannerImages.length,
      (currentIndex - 1 + bannerImages.length) % bannerImages.length,
      (currentIndex + 2) % bannerImages.length,
      (currentIndex + 3) % bannerImages.length,
    ];
    preloadIndices.forEach((i) => {
      const img = new window.Image();
      img.src = bannerImages[i];
    });
  }, [currentIndex, isClient]);

  const handlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  if (!isClient)
    return (
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-200 animate-pulse" />
    );

  return (
    <div
      {...handlers}
      className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Promotional banners"
    >
      <Image
        key={currentIndex}
        src={bannerImages[currentIndex]}
        alt={`Banner ${currentIndex + 1}`}
        fill
        priority
        className="object-cover transition-opacity duration-700"
      />

      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded text-sm sm:text-base">
        wholesome. crave-worthy. nourishment-focused.
      </div>

      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FAF7F2] to-transparent" />

      <button
        aria-label="Previous banner"
        onClick={goPrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none"
      >
        ◀
      </button>
      <button
        aria-label="Next banner"
        onClick={goNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none"
      >
        ▶
      </button>

      <button
        aria-label={isPaused ? "Play rotation" : "Pause rotation"}
        onClick={() => setIsPaused((p) => !p)}
        className="absolute top-2 left-2 bg-black/40 text-white px-3 py-1 rounded text-xs focus:outline-none hover:bg-black/60"
      >
        {isPaused ? "▶ Play" : "⏸ Pause"}
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {bannerImages.map((src, idx) => (
          <div
            key={idx}
            className="relative"
            onMouseEnter={() => setHoveredDot(idx)}
            onMouseLeave={() => setHoveredDot(null)}
          >
            <button
              aria-label={`Show banner ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full focus:outline-none ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
              }`}
            />
            {hoveredDot === idx && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-1 rounded shadow-lg z-50">
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
};

// -------------------- Homepage --------------------
const favoriteImages = [
  "/images/favorites/protein-pack-salad.jpg",
  "/images/favorites/chicken-avo-wrap.jpg",
  "/images/favorites/avocado-protein-stack-salad.jpg",
];

// -------------------- Updated Menu Item Card --------------------
const SimpleMenuItemCard = ({ name, price, tags, image, className }) => {
  const addOns = ["Extra Avocado", "Protein Boost", "Gluten-Free Bread"];
  const [showAddOns, setShowAddOns] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState(
    () => addOns.reduce((acc, addon) => ({ ...acc, [addon]: false }), {})
  );

  const toggleAddOn = (addon) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [addon]: !prev[addon],
    }));
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="relative h-48 w-full">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-[#F4A261] font-bold">R{price}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-[#6C7B58] text-white text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => setShowAddOns((prev) => !prev)}
          className="mt-3 px-3 py-1 bg-[#F4A261] text-white rounded hover:bg-[#e68e42] transition text-xs sm:text-sm"
        >
          Customize Your Order
        </button>

        {showAddOns && (
          <div className="mt-2 flex flex-col gap-2">
            {addOns.map((addon) => (
              <label key={addon} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-[#F4A261]"
                  checked={selectedAddOns[addon]}
                  onChange={() => toggleAddOn(addon)}
                />
                {addon}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <PageWrapper>
      <main className="min-h-screen w-screen overflow-x-hidden bg-[#1E4259] text-white">
        <FixedHeader />
        <div className="pt-16 sm:pt-20">
          <section className="relative w-screen overflow-x-hidden">
            <DynamicBanner />
            <Link
              href="/menu"
              className="absolute top-2 right-2 sm:top-6 sm:right-6 bg-[#F4A261] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base hover:bg-[#e68e42] transition shadow-lg z-10 animate-pulse"
            >
              Explore the Menu →
            </Link>
          </section>

          <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#FAF7F2] to-[#1E4259] shadow-inner text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#6C7B58] mb-4 sm:mb-6">
              Explore Our Menu
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Fresh, wholesome dishes designed to nourish and delight — discover your next mouth-watering favorite.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {["Salads","StirFry","Bowls","Toasties","Wraps","Fries","Soups","Pastas","Breakfast","Smoothies","Juices"].map((cat) => (
                <Link
                  key={cat}
                  href={`/menu/${cat.toLowerCase()}`}
                  className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#F4A261] text-white text-xs sm:text-sm font-medium hover:bg-[#e68e42] transition"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>

          <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 bg-[#1E4259]">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
              Customer Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-4">
              {favoriteImages.map((src, i) => (
                <SimpleMenuItemCard
                  key={i}
                  name={
                    i === 0
                      ? "Protein Pack Salad"
                      : i === 1
                      ? "Chicken Avo Wrap"
                      : "Avocado Protein Stack Salad"
                  }
                  price={i === 0 ? 125 : i === 1 ? 115 : 120}
                  tags={
                    i === 0
                      ? ["Popular"]
                      : i === 1
                      ? ["Customer Favorite", "New"]
                      : ["Vegetarian"]
                  }
                  image={src}
                  className="transition-transform duration-300 hover:scale-105"
                />
              ))}
            </div>
          </section>

          {/* Rest of your sections remain unchanged */}
          <section className="bg-[#FAF7F2] p-6 sm:p-8 rounded-lg text-center mb-12 sm:mb-16 mx-4 text-[#1E4259]">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#6C7B58] mb-2">Hosting a Gathering?</h2>
            <p className="text-sm sm:text-base text-[#4A665E] mb-4">Let us cater your next event with wholesome, crowd-pleasing dishes.</p>
            <Link href="/catering" className="inline-block bg-[#F4A261] text-white text-xs sm:text-sm px-4 py-2 rounded-lg hover:bg-[#e68e42] transition">Explore Catering Options</Link>
          </section>

          <section className="text-center mb-12 sm:mb-16">
            <div className="inline-block bg-[#F4A261] text-white text-sm sm:text-base px-4 py-2 rounded-lg">R30 OFF Your First Order</div>
            <p className="mt-2 text-xs sm:text-sm text-gray-200">Available for self-collection, takeaway, and delivery.</p>
          </section>

          <section className="bg-[#FAF7F2] text-[#1E4259] py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-12 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-[#6C7B58]">Our Vision</h2>
            <p className="text-sm sm:text-base md:text-lg text-[#4A665E] leading-relaxed max-w-3xl mx-auto">
              A vibrant, modern brand where clean eating meets connection. Fresh, flavorful, and halaal-friendly — made for locals, remote workers, students, health enthusiasts, and anyone craving wholesome food.
            </p>
          </section>

          <section className="px-4 md:px-12 mb-12">
            <h2 className="text-xl font-bold text-white text-center mb-4">What customers say</h2>
            <TestimonialsCarousel />
          </section>

          <section className="bg-gradient-to-r from-[#1e4259] to-[#163342] text-white py-6 px-4 sm:px-6 md:px-12 text-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">Connect with us</h3>
            <div className="flex justify-center gap-4 sm:gap-6">
              {[
                { href: "https://instagram.com/garden.and.grains", icon: FaInstagram },
                { href: "https://facebook.com/garden.and.grains", icon: FaFacebook },
                { href: "https://tiktok.com/@garden.and.grains", icon: FaTiktok },
                { href: "https://twitter.com/gardenandgrains", icon: FaTwitter },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F4A261] transition"
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </section>

          <FloatingCartButton />
          <FloatingWhatsAppButton />
        </div>
      </main>
    </PageWrapper>
  );
}
