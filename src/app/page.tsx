"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import { FaInstagram, FaFacebook, FaTiktok, FaTwitter, FaWhatsapp } from "react-icons/fa";

import PageWrapper from "@/components/layout/PageWrapper";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { useCart } from "@/contexts/CartContext";

// Banner images - using placeholder images for now
const bannerImages = [
  "/images/banners/banner1.jpg",
  "/images/banners/banner2.png", 
  "/images/banners/banner3.png",
  "/images/banners/banner4.png",
  "/images/banners/banner5.png", 
  "/images/banners/banner6.png",
  "/images/banners/banner7.png",
  "/images/banners/banner8.png",
  "/images/banners/banner9.png",
  "/images/banners/banner10.png",
  "/images/banners/banner11.png",
  "/images/banners/banner12.png",
  "/images/banners/banner13.png",
  "/images/banners/banner14.png",
  "/images/banners/banner15.png",
  "/images/banners/banner16.png",
  "/images/banners/banner17.png",
  "/images/banners/banner18.png",
  "/images/banners/banner19.png",
  "/images/banners/banner20.png",
  "/images/banners/banner21.png",
  "/images/banners/banner22.png",
  "/images/banners/banner23.png",
  "/images/banners/banner24.png",
  "/images/banners/banner25.png",
  "/images/banners/banner26.png",
  "/images/banners/banner27.png",
  "/images/banners/banner28.png",
  "/images/banners/banner29.png",
  "/images/banners/banner30.png",
  "/images/banners/banner31.png",
  "/images/banners/banner32.png",
  "/images/banners/banner33.png",
  "/images/banners/banner34.png",
  "/images/banners/banner35.png",
  "/images/banners/banner36.png",
  "/images/banners/banner37.png",
  "/images/banners/banner38.png",
  "/images/banners/banner39.png",
  "/images/banners/banner40.png", 
  "/images/banners/banner41.png",
  "/images/banners/banner42.png",
  "/images/banners/banner43.png",
  "/images/banners/banner44.png",
  "/images/banners/banner45.png",
  "/images/banners/banner46.png",
  "/images/banners/banner47.png",
  "/images/banners/banner48.png",
  "/images/banners/banner49.png",
  "/images/banners/banner50.png",
];

// Fallback banner color if images don't load
const bannerFallbacks = [
  "linear-gradient(135deg, #1E4259 0%, #2D536B 100%)",
  "linear-gradient(135deg, #6C7B58 0%, #8A9B6E 100%)",
  "linear-gradient(135deg, #F4A261 0%, #e68e42 100%)",
  "linear-gradient(135deg, #4A665E 0%, #5D7A72 100%)"
];

// -------------------- Floating Buttons --------------------
function FloatingCartButton() {
  const { cart } = useCart();
  const itemCount = (cart || []).reduce((total: number, item) => total + (item.quantity || 1), 0);

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-[#F4A261] text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:bg-[#e68e42] transition flex items-center gap-2 z-40"
    >
      🛒 <span>Go to Cart</span>
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

// -------------------- Vertical Promo Banner --------------------
function VerticalPromoBanner() {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
      <div className="bg-[#F4A261] text-white p-4 rounded-lg shadow-lg max-w-[200px]">
        <h3 className="font-bold text-lg mb-2">Special Offer! 🎉</h3>
        <p className="text-sm mb-3">Get 20% off your first order when you create an account</p>
        <Link 
          href="/auth" 
          className="bg-white text-[#F4A261] font-semibold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 transition block text-center"
        >
          Join Now
        </Link>
      </div>
    </div>
  );
}

// -------------------- Single Fixed Header --------------------
function FixedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const itemCount = (cart || []).reduce((total: number, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
    return () => { if (typeof window !== "undefined") {
      window.removeEventListener("scroll", handleScroll);
    }
  }
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-16 ${
        isScrolled ? "bg-[#1E4259] shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
           <Link href="/" className="flex items-center space-x-2 z-50">
            <div className="relative h-10 w-40">
              <Image 
                src="/logo/logo.png" 
                alt="Garden & Grains Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Navigation Menu - Centered */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-[#F4A261] transition font-medium">
              Home
            </Link>
            <Link href="/menu" className="text-white hover:text-[#F4A261] transition font-medium">
              Menu
            </Link>
            <Link href="/about" className="text-white hover:text-[#F4A261] transition font-medium">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-[#F4A261] transition font-medium">
              Contact
            </Link>
          </nav>

          {/* Right Side - Auth & Cart */}
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-white hover:text-[#F4A261] transition text-sm font-medium">
              Sign In
            </Link>
            <Link href="/cart" className="relative text-white hover:text-[#F4A261] transition">
              <span className="text-xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#F4A261] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// -------------------- Dynamic Banner --------------------
const DynamicBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

  const goNext = useCallback(() => setCurrentIndex((p) => (p + 1) % bannerImages.length), []);
  const goPrev = useCallback(() => setCurrentIndex((p) => (p === 0 ? bannerImages.length - 1 : p - 1)), []);

  useEffect(() => {
    setIsClient(true);
    // Initialize images loaded state
    setImagesLoaded(new Array(bannerImages.length).fill(false));
  }, []);

  useEffect(() => {
    if (!isPaused && isClient) {
      const id = setInterval(goNext, 5000);
      return () => clearInterval(id);
    }
  }, [goNext, isPaused, isClient]);

  const handlers = useSwipeable({ 
    onSwipedLeft: goNext, 
    onSwipedRight: goPrev, 
    trackMouse: true, 
    preventScrollOnSwipe: true 
  });

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  if (!isClient) {
    return (
      <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-br from-[#1E4259] to-[#2D536B] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const currentBannerStyle = {
    background: bannerFallbacks[currentIndex]
  };

  return (
    <div 
      {...handlers} 
      className="relative h-64 sm:h-80 md:h-96 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={currentBannerStyle}
    >
      {/* Try to load image, fallback to gradient */}
      <div className="absolute inset-0">
        <Image 
          src={bannerImages[currentIndex]} 
          alt={`Banner ${currentIndex + 1}`}
          fill
          className="object-cover"
          onLoad={() => handleImageLoad(currentIndex)}
          onError={() => {
            // If image fails to load, we rely on the gradient background
            console.log(`Banner image ${currentIndex + 1} failed to load`);
          }}
          priority
        />
      </div>
      
      {/* Banner Overlay Text */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Garden & Grains
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 drop-shadow-lg max-w-2xl">
            Fresh • Wholesome • Delicious
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition shadow-lg text-lg font-semibold inline-block"
            >
              Order Now
            </Link>
            <Link
              href="/auth"
              className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#1E4259] transition text-lg font-semibold inline-block"
            >
              Join & Save 20%
            </Link>
          </div>
        </div>
      </div>

      {/* Banner Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex ? 'bg-[#F4A261]' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        aria-label="Previous banner"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
        aria-label="Next banner"
      >
        ›
      </button>
    </div>
  );
};

// -------------------- Menu Card --------------------
const SimpleMenuItemCard = ({ name, price, tags, image, link }: any) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 group">
    <Link href={link}>
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E4259] to-[#2D536B] flex items-center justify-center">
          <span className="text-white text-sm">Image: {name}</span>
        </div>
        {tags?.includes("Popular") && (
          <div className="absolute top-2 left-2 bg-[#F4A261] text-white text-xs font-bold px-2 py-1 rounded">
            Popular
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg mb-2">{name}</h3>
        <p className="text-[#F4A261] font-bold text-xl">R{price}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags?.map((tag: string, i: number) => (
            <span key={i} className="bg-[#6C7B58] text-white text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  </div>
);

// -------------------- HomePage --------------------
export default function HomePage() {
  const favorites = [
    { 
      name: "Protein Pack Salad", 
      price: 125, 
      tags: ["Popular", "High Protein"], 
      image: "/images/favorites/protein-pack-salad.jpg", 
      link: "/menu" 
    },
    { 
      name: "Chicken Avo Wrap", 
      price: 115, 
      tags: ["Customer Favorite", "New"], 
      image: "/images/favorites/chicken-avo-wrap.jpg", 
      link: "/menu" 
    },
    { 
      name: "Avocado Protein Stack", 
      price: 120, 
      tags: ["Vegetarian", "Healthy"], 
      image: "/images/favorites/avocado-protein-stack-salad.jpg", 
      link: "/menu" 
    },
  ];

  const features = [
    { icon: "🍃", title: "Fresh Ingredients", description: "Sourced daily from local suppliers" },
    { icon: "⚡", title: "Fast Service", description: "Ready in 15-20 minutes" },
    { icon: "🌱", title: "Healthy Options", description: "Nutritious & delicious meals" },
    { icon: "🚚", title: "Free Delivery", description: "On orders over R850 (10km radius)" },
  ];

  return (
    <PageWrapper>
      <VerticalPromoBanner />
      <main className="min-h-screen bg-[#1E4259] text-white">
        <FixedHeader />
        
        {/* Hero Banner Section - No extra padding since header is fixed */}
        <section className="relative pt-0">
          <DynamicBanner />
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-[#1E4259] mb-12">Why Choose Garden & Grains?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature: any, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-[#1E4259] mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Menu CTA Section */}
        <section className="py-16 px-6 text-center bg-gradient-to-b from-[#FAF7F2] to-[#1E4259]">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-extrabold text-[#6C7B58] mb-6">Explore Our Menu</h3>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Fresh, wholesome dishes designed to nourish and delight — discover your next favorite meal made with love and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="bg-[#F4A261] text-white px-8 py-4 rounded-lg hover:bg-[#e68e42] transition shadow-md text-lg font-semibold"
              >
                View Full Menu
              </Link>
              <Link
                href="/auth"
                className="border-2 border-[#F4A261] text-[#F4A261] px-8 py-4 rounded-lg hover:bg-[#F4A261] hover:text-white transition text-lg font-semibold"
              >
                Join & Save 20%
              </Link>
            </div>
          </div>
        </section>

        {/* Customer Favorites Section */}
        <section className="py-16 px-6 bg-[#1E4259]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Customer Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((item: any, i) => (
                <SimpleMenuItemCard key={i} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* Catering Section */}
        <section className="bg-[#FAF7F2] py-16 px-8 rounded-lg text-center mb-16 mx-4 text-[#1E4259]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#6C7B58] mb-4">Hosting a Gathering?</h2>
            <p className="text-[#4A665E] text-lg mb-6 max-w-2xl mx-auto">
              Let us cater your next event with wholesome, crowd-pleasing dishes that everyone will love.
            </p>
            <Link 
              href="/catering" 
              className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] text-lg font-semibold inline-block"
            >
              Explore Catering Options
            </Link>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-gradient-to-b from-[#FAF7F2] to-[#1E4259] text-[#1E4259] py-16 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#6C7B58]">Our Vision</h2>
            <p className="text-lg sm:text-xl text-[#4A665E] leading-relaxed">
              A vibrant, modern brand where clean eating meets connection. Fresh, flavorful, and halaal-friendly — 
              made for locals, remote workers, students, health enthusiasts, and anyone craving wholesome food that 
              nourishes both body and soul.
            </p>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="px-4 md:px-12 py-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1E4259] text-center mb-12">What Our Customers Say</h2>
            <TestimonialsCarousel />
          </div>
        </section>

        {/* Connect Section */}
        <section className="bg-gradient-to-r from-[#1e4259] to-[#163342] text-white py-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6">Connect With Us</h3>
            <p className="text-gray-300 mb-6">Follow us for updates, special offers, and behind-the-scenes content</p>
            <div className="flex justify-center gap-8">
              {[
                { Icon: FaInstagram, name: "Instagram" },
                { Icon: FaFacebook, name: "Facebook" },
                { Icon: FaTiktok, name: "TikTok" },
                { Icon: FaTwitter, name: "Twitter" }
              ].map(({ Icon, name }, i) => (
                <a 
                  key={i} 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-3xl hover:text-[#F4A261] transition transform hover:scale-110"
                  title={name}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </section>

        <FloatingCartButton />
        <FloatingWhatsAppButton />
      </main>
    </PageWrapper>
  );
}
