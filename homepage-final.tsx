"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import { FaInstagram, FaFacebook, FaTiktok, FaTwitter, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

import PageWrapper from "@/components/layout/PageWrapper";
import { useCart } from "@/contexts/CartContext";

// Modern Color Scheme: Dark Azure with whitish fade
const colors = {
  darkAzure: "#005B96",       // Primary brand color
  lightAzure: "#1C7AB0",      // Light azure
  whitishFade: "#F8F9FA",     // Main background
  sageGreen: "#A3B899",       // Natural accent
  warmAccent: "#F4A261",      // CTA accent (orange)
  textDark: "#2C3E50",        // Primary text
  textLight: "#5D6D7E",       // Secondary text
  white: "#FFFFFF",
  lightGray: "#EAEDED"        // Subtle backgrounds
};

// Banner images - simplified
const bannerImages = [
  "/images/banners/banner1.jpg",
  "/images/banners/banner2.png", 
  "/images/banners/banner3.png",
];

// -------------------- Floating Buttons --------------------
function FloatingCartButton() {
  const { cart } = useCart();
  const itemCount = (cart || []).reduce((total: number, item) => total + (item.quantity || 1), 0);

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-[#F4A261] text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:bg-[#e68e42] transition-all duration-300 flex items-center gap-2 z-40 hover:scale-105"
    >
      🛒 <span>Go to Cart</span>
      {itemCount > 0 && (
        <span className="bg-[#005B96] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

function FloatingWhatsAppButton() {
  return (
    <a
      href="https://wa.me/27612345678"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 bg-green-500 text-white font-semibold py-3 px-3 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-2 z-40 hover:scale-105"
    >
      <FaWhatsapp className="h-6 w-6" />
      <span className="sr-only">WhatsApp Business</span>
    </a>
  );
}

// -------------------- UPDATED FIXED HEADER (Best Version) --------------------
function FixedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const itemCount = (cart || []).reduce((total: number, item) => total + (item.quantity || 1), 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#005B96] shadow-lg" : "bg-transparent"
      } h-16`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-50 hover:opacity-90 transition-opacity">
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

          {/* Navigation Menu - UPDATED with proper links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-[#F4A261] transition-colors font-medium text-sm px-3 py-1 rounded hover:bg-white/10">
              Home
            </Link>
            <Link href="/menu" className="text-white hover:text-[#F4A261] transition-colors font-medium text-sm px-3 py-1 rounded hover:bg-white/10">
              Menu
            </Link>
            <Link href="/catering" className="text-white hover:text-[#F4A261] transition-colors font-medium text-sm px-3 py-1 rounded hover:bg-white/10">
              Catering
            </Link>
            <Link href="/about" className="text-white hover:text-[#F4A261] transition-colors font-medium text-sm px-3 py-1 rounded hover:bg-white/10">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-[#F4A261] transition-colors font-medium text-sm px-3 py-1 rounded hover:bg-white/10">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions - UPDATED with Book Table */}
          <div className="flex items-center gap-3">
            <Link 
              href="/reserve" 
              className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition-all duration-300 text-sm font-semibold hover:scale-105"
            >
              Book a Table
            </Link>
            <Link 
              href="/auth" 
              className="text-white hover:text-[#F4A261] transition-colors text-sm font-medium px-3 py-1 rounded hover:bg-white/10"
            >
              Sign In
            </Link>
            <Link 
              href="/cart" 
              className="relative text-white hover:text-[#F4A261] transition-colors p-2"
            >
              <span className="text-xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F4A261] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
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

  const goNext = useCallback(() => setCurrentIndex((p) => (p + 1) % bannerImages.length), []);
  const goPrev = useCallback(() => setCurrentIndex((p) => (p === 0 ? bannerImages.length - 1 : p - 1)), []);

  useEffect(() => {
    setIsClient(true);
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

  if (!isClient) {
    return (
      <div className="h-80 bg-gradient-to-br from-[#005B96] to-[#1C7AB0] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      {...handlers} 
      className="relative h-80 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ background: "linear-gradient(135deg, #005B96 0%, #1C7AB0 100%)" }}
    >
      {/* Banner Image */}
      <div className="absolute inset-0">
        <Image 
          src={bannerImages[currentIndex]} 
          alt={`Garden & Grains Banner ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Overlay with Content */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Garden & Grains
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 drop-shadow-lg font-light">
            Fresh • Wholesome • Delicious
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/menu"
              className="bg-[#F4A261] text-white px-8 py-4 rounded-lg hover:bg-[#e68e42] transition-all duration-300 shadow-lg text-lg font-semibold inline-block min-w-[180px] text-center hover:scale-105"
            >
              Order Now
            </Link>
            <Link
              href="/reserve"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#005B96] transition-all duration-300 text-lg font-semibold inline-block min-w-[180px] text-center hover:scale-105"
            >
              Reserve Table
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows Only - No Dots */}
      <button
        onClick={goPrev}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 backdrop-blur-sm hover:scale-110"
        aria-label="Previous banner"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-all duration-300 backdrop-blur-sm hover:scale-110"
        aria-label="Next banner"
      >
        ›
      </button>
    </div>
  );
};

// -------------------- Features Section --------------------
function FeaturesSection() {
  const features = [
    { icon: "🍃", title: "Fresh Ingredients", description: "Locally sourced daily" },
    { icon: "⚡", title: "Fast Service", description: "Ready in 15-20 minutes" },
    { icon: "🌱", title: "Healthy Options", description: "Nutritious & delicious" },
    { icon: "🚚", title: "Free Delivery", description: "Orders over R850 (10km)" },
  ];

  return (
    <section className="py-16" style={{ backgroundColor: colors.whitishFade }}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: colors.darkAzure }}>
          Why Choose Garden & Grains?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg border border-gray-100"
              style={{ backgroundColor: colors.white }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: colors.darkAzure }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: colors.textLight }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------- Menu Highlights Section --------------------
function MenuHighlightsSection() {
  const menuItems = [
    { 
      name: "Smoky Chipotle Chicken Bowl", 
      price: 163, 
      tags: ["Popular", "Spicy"], 
      description: "Grilled chipotle chicken with fresh veggies"
    },
    { 
      name: "Protein Avocado Stack", 
      price: 135, 
      tags: ["High Protein", "Healthy"], 
      description: "Fresh avocado with protein-packed ingredients"
    },
    { 
      name: "Berry Power Smoothie", 
      price: 93, 
      tags: ["Refreshing", "Healthy"], 
      description: "Mixed berries with yogurt and chia seeds"
    },
  ];

  return (
    <section className="py-16 px-6" style={{ backgroundColor: colors.lightGray }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: colors.darkAzure }}>Menu Highlights</h2>
          <p className="text-lg mb-8" style={{ color: colors.textLight }}>
            Discover our most popular and nutritious dishes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold" style={{ color: colors.darkAzure }}>{item.name}</h3>
                  <span className="text-2xl font-bold" style={{ color: colors.warmAccent }}>R{item.price}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: '#005B9610', 
                        color: colors.darkAzure 
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className="text-sm mb-6" style={{ color: colors.textLight }}>{item.description}</p>
                
                <div className="flex gap-3">
                  <Link 
                    href="/menu" 
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-center transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: colors.darkAzure, 
                      color: 'white' 
                    }}
                  >
                    Order Now
                  </Link>
                  <Link 
                    href="/reserve" 
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-center transition-all duration-300 hover:scale-105 border"
                    style={{ 
                      borderColor: colors.darkAzure,
                      color: colors.darkAzure 
                    }}
                  >
                    Dine In
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/menu" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{ 
              backgroundColor: colors.warmAccent, 
              color: 'white' 
            }}
          >
            View Full Menu →
          </Link>
        </div>
      </div>
    </section>
  );
}

// -------------------- Action Section --------------------
function ActionSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-[#005B96] to-[#1C7AB0] rounded-2xl p-10 text-white shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Garden & Grains?</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Fresh meals, cozy atmosphere, and exceptional service await you
            </p>
          </div>
          
          {/* Action Buttons in One Line */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            {/* Order Online */}
            <Link 
              href="/menu" 
              className="flex-1 max-w-sm bg-white text-[#005B96] px-8 py-6 rounded-xl hover:bg-gray-50 text-xl font-bold transition-all duration-300 flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl">📱</div>
              <div className="text-center">
                <div className="font-bold text-lg">Order Online</div>
                <div className="text-sm opacity-80 mt-2">Quick delivery & pickup</div>
              </div>
            </Link>
            
            {/* Book Catering */}
            <Link 
              href="/catering" 
              className="flex-1 max-w-sm bg-[#F4A261] text-white px-8 py-6 rounded-xl hover:bg-[#e68e42] text-xl font-bold transition-all duration-300 flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl">🎉</div>
              <div className="text-center">
                <div className="font-bold text-lg">Book Catering</div>
                <div className="text-sm opacity-90 mt-2">Events & gatherings</div>
              </div>
            </Link>
            
            {/* Reserve Table */}
            <Link 
              href="/reserve" 
              className="flex-1 max-w-sm bg-[#A3B899] text-white px-8 py-6 rounded-xl hover:bg-[#8A9B6E] text-xl font-bold transition-all duration-300 flex flex-col items-center justify-center gap-4 shadow-lg hover:shadow-xl"
            >
              <div className="text-4xl">🪑</div>
              <div className="text-center">
                <div className="font-bold text-lg">Reserve Table</div>
                <div className="text-sm opacity-90 mt-2">Dine-in experience</div>
              </div>
            </Link>
          </div>
          
          {/* Contact Info */}
          <div className="text-center mt-10 text-white/80 text-sm">
            <p>📍 Uitsig Wine Farm, Cape Town | 📞 (021) 123-4567 | 📱 +27 61 234 5678</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------- Contact & Hours Section --------------------
function ContactHoursSection() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: colors.whitishFade }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Info */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.darkAzure }}>Visit Us</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="h-6 w-6 mt-1" style={{ color: colors.darkAzure }} />
                <div>
                  <h4 className="font-bold mb-1" style={{ color: colors.darkAzure }}>Location</h4>
                  <p className="text-sm" style={{ color: colors.textLight }}>
                    Uitsig Wine Farm<br />
                    ERF12995 Spaanschemat River Rd<br />
                    Fir Grove, Cape Town, 7806
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <FaPhone className="h-6 w-6 mt-1" style={{ color: colors.darkAzure }} />
                <div>
                  <h4 className="font-bold mb-1" style={{ color: colors.darkAzure }}>Contact</h4>
                  <p className="text-sm" style={{ color: colors.textLight }}>
                    Phone: (021) 123-4567<br />
                    WhatsApp: +27 61 234 5678<br />
                    Email: info@gardenandgrains.co.za
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: colors.darkAzure, 
                    color: 'white' 
                  }}
                >
                  Get Directions →
                </Link>
              </div>
            </div>
          </div>
          
          {/* Hours Info */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.darkAzure }}>Opening Hours</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="font-medium" style={{ color: colors.textDark }}>Monday - Sunday</span>
                <span className="font-semibold" style={{ color: colors.darkAzure }}>10:00 AM - 8:30 PM</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="font-medium" style={{ color: colors.textDark }}>Dinner Prep Break</span>
                <span className="font-semibold" style={{ color: colors.warmAccent }}>4:00 PM - 5:00 PM</span>
              </div>
              <div className="pt-4">
                <p className="text-sm" style={{ color: colors.textLight }}>
                  <strong>Note:</strong> We recommend booking in advance for dinner service, 
                  especially on weekends.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/reserve" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: colors.warmAccent, 
                  color: 'white' 
                }}
              >
                Reserve Your Table Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------- Footer Section --------------------
function FooterSection() {
  return (
    <footer className="py-12 px-6 text-center" style={{ 
      background: `linear-gradient(135deg, ${colors.darkAzure} 0%, #004A7C 100%)` 
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          {/* Logo */}
          <div className="relative h-12 w-48">
            <Image 
              src="/logo/logo.png" 
              alt="Garden & Grains Logo" 
              fill 
              className="object-contain"
            />
          </div>
          
          {/* Social Links */}
          <div className="flex gap-6">
            {[
              { Icon: FaInstagram, name: "Instagram", url: "https://instagram.com/gardenandgrains" },
              { Icon: FaFacebook, name: "Facebook", url: "https://facebook.com/gardenandgrains" },
              { Icon: FaTiktok, name: "TikTok", url: "https://tiktok.com/@gardenandgrains" },
              { Icon: FaTwitter, name: "Twitter", url: "https://twitter.com/gardenandgrains" }
            ].map(({ Icon, name, url }, i) => (
              <a 
                key={i} 
                href={url}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-2xl text-white hover:text-[#F4A261] transition-colors"
                title={name}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/20 pt-6">
          <p className="text-white/70 text-sm">
            &copy; {new Date().getFullYear()} Garden & Grains. All rights reserved.<br />
            Uitsig Wine Farm: ERF12995 Spaanschemat River Rd, Fir Grove, Cape Town, 7806
          </p>
        </div>
      </div>
    </footer>
  );
}

// -------------------- HomePage --------------------
export default function HomePage() {
  return (
    <PageWrapper>
      <main className="min-h-screen" style={{ backgroundColor: colors.whitishFade }}>
        {/* UPDATED Fixed Header (Reinstated) */}
        <FixedHeader />
        
        {/* Hero Banner */}
        <section className="pt-0">
          <DynamicBanner />
        </section>

        {/* Features */}
        <FeaturesSection />

        {/* Menu Highlights */}
        <MenuHighlightsSection />

        {/* Action Section */}
        <ActionSection />

        {/* Contact & Hours */}
        <ContactHoursSection />

        {/* Footer */}
        <FooterSection />

        {/* Floating Buttons */}
        <FloatingCartButton />
        <FloatingWhatsAppButton />
      </main>
    </PageWrapper>
  );
}
