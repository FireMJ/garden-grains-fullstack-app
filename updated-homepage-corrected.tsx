"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import { FaInstagram, FaFacebook, FaTiktok, FaTwitter, FaWhatsapp } from "react-icons/fa";

import PageWrapper from "@/components/layout/PageWrapper";
import { useCart } from "@/contexts/CartContext";

// UPDATED COLOR SCHEME: Dark Azure with whitish fade
const colors = {
  darkAzure: "#005B96",       // Dark azure (primary)
  lightAzure: "#1C7AB0",      // Light azure
  whitishFade: "#F8F9FA",     // Whitish fade background
  menuBg: "#E8F4F8",          // Light azure tint for menu section
  accent: "#F4A261",          // Accent color (orange)
  textDark: "#2C3E50",        // Dark text
  textLight: "#546E7A",       // Light text
  white: "#FFFFFF",
  green: "#A3B899"            // For reserve button
};

// Banner images
const bannerImages = [
  "/images/banners/banner1.jpg",
  "/images/banners/banner2.png", 
  "/images/banners/banner3.png",
];

// Fallback banner gradients with UPDATED color scheme
const bannerFallbacks = [
  `linear-gradient(135deg, ${colors.darkAzure} 0%, ${colors.lightAzure} 100%)`,
  `linear-gradient(135deg, ${colors.darkAzure}80 0%, ${colors.lightAzure}80 100%)`,
  `linear-gradient(135deg, ${colors.accent}80 0%, #e68e4280 100%)`,
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
        <span className="bg-[#005B96] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
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
      <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-br from-[#005B96] to-[#1C7AB0] flex items-center justify-center">
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
      className="relative h-64 sm:h-80 md:h-96 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ background: bannerFallbacks[currentIndex] }}
    >
      {/* Dynamic Banner Image */}
      <div className="absolute inset-0">
        <Image 
          src={bannerImages[currentIndex]} 
          alt={`Banner ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Banner Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Garden & Grains
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 drop-shadow-lg">
            Fresh • Wholesome • Delicious
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/menu"
              className="bg-[#F4A261] text-white px-8 py-4 rounded-lg hover:opacity-90 transition shadow-lg text-lg font-semibold inline-block min-w-[180px] text-center"
            >
              Order Now
            </Link>
            <Link
              href="/auth"
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#005B96] transition text-lg font-semibold inline-block min-w-[180px] text-center"
            >
              Join & Save 20%
            </Link>
          </div>
        </div>
      </div>

      {/* Banner Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
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
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition backdrop-blur-sm"
        aria-label="Previous banner"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition backdrop-blur-sm"
        aria-label="Next banner"
      >
        ›
      </button>
    </div>
  );
};

// -------------------- Healthy Meals Section with Dynamic Background --------------------
function HealthyMealsSection() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollPosition * 0.3;

  return (
    <section className="relative overflow-hidden py-20" style={{ backgroundColor: colors.whitishFade }}>
      {/* Dynamic Background Banner - UPDATED with dark azure */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          background: `linear-gradient(rgba(0, 91, 150, 0.85), rgba(28, 122, 176, 0.75)), url('/images/healthy-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Animated floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-white/5 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white/8 animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Healthy Meals, <span className="text-[#F4A261]">Happy You</span>
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
          Nourish your body with our carefully crafted meals, made from the freshest ingredients 
          and packed with flavor and nutrition.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            { icon: "🥗", title: "Fresh Salads", desc: "Crisp greens & seasonal veggies" },
            { icon: "🍲", title: "Hearty Bowls", desc: "Nutritious & satisfying meals" },
            { icon: "🥤", title: "Power Smoothies", desc: "Vitamin-packed blends" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/80">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------- Menu Section - UPDATED with Garden & Grains color ethos --------------------
function MenuSection() {
  const menuItems = [
    { name: "Smoky Chipotle Chicken Bowl", price: 163, tags: ["Popular", "Spicy"], category: "bowl" },
    { name: "Greek Salad", price: 125, tags: ["Fresh", "Vegetarian"], category: "salad" },
    { name: "Protein Avocado Stack", price: 135, tags: ["High Protein", "Healthy"], category: "salad" },
    { name: "Chicken & Veg Stir-Fry", price: 145, tags: ["Hot", "Quick"], category: "stir-fry" },
    { name: "Berry Smoothie", price: 93, tags: ["Refreshing", "Healthy"], category: "smoothie" },
    { name: "Roasted Oats Breakfast", price: 85, tags: ["Breakfast", "Nutritious"], category: "breakfast" },
  ];

  const categories = ["All", "Bowls", "Salads", "Stir-Fry", "Smoothies", "Breakfast"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory.toLowerCase());

  return (
    <section className="py-20 px-6" style={{ backgroundColor: colors.menuBg }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: colors.darkAzure }}>Our Menu</h2>
          <p className="text-lg mb-8" style={{ color: colors.textDark }}>
            Explore our delicious selection of healthy meals
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full transition ${
                  activeCategory === cat 
                    ? 'bg-[#005B96] text-white' 
                    : 'bg-white text-[#005B96] hover:bg-[#1C7AB0] hover:text-white'
                }`}
                style={{ border: '1px solid #005B96' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="relative h-48">
                <div className={`absolute inset-0 flex items-center justify-center ${
                  item.category === 'bowl' ? 'bg-gradient-to-br from-[#005B96] to-[#1C7AB0]' :
                  item.category === 'salad' ? 'bg-gradient-to-br from-[#E8F4F8] to-[#B8DFE6]' :
                  item.category === 'stir-fry' ? 'bg-gradient-to-br from-[#F4A261] to-[#e68e42]' :
                  'bg-gradient-to-br from-[#A3B899] to-[#8A9B6E]'
                }`}>
                  <span className="text-white text-lg font-semibold">{item.name.split(' ')[0]}</span>
                </div>
                {item.tags.includes("Popular") && (
                  <div className="absolute top-3 right-3 bg-[#F4A261] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.darkAzure }}>{item.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: '#005B9615', 
                        color: colors.darkAzure 
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold" style={{ color: colors.accent }}>R{item.price}</span>
                  <Link 
                    href="/menu" 
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition"
                    style={{ 
                      backgroundColor: colors.darkAzure, 
                      color: 'white',
                      border: '1px solid #005B96'
                    }}
                  >
                    Add to Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/menu" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold transition hover:scale-105"
            style={{ 
              backgroundColor: colors.accent, 
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

// -------------------- Features Section - UPDATED colors --------------------
function FeaturesSection() {
  const features = [
    { icon: "🍃", title: "Fresh Ingredients", description: "Sourced daily from local suppliers" },
    { icon: "⚡", title: "Fast Service", description: "Ready in 15-20 minutes" },
    { icon: "🌱", title: "Healthy Options", description: "Nutritious & delicious meals" },
    { icon: "🚚", title: "Free Delivery", description: "On orders over R850 (10km radius)" },
  ];

  return (
    <section className="py-20 px-6" style={{ backgroundColor: colors.whitishFade }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: colors.darkAzure }}>
          Why Choose Garden & Grains?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-xl transition hover:shadow-xl border border-gray-200"
              style={{ backgroundColor: colors.white }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: colors.darkAzure }}>
                {feature.title}
              </h3>
              <p style={{ color: colors.textLight }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------- ACTION BUTTONS SECTION - All three in one line --------------------
function ActionButtonsSection() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: colors.whitishFade }}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-[#005B96] to-[#1C7AB0] rounded-2xl p-8 md:p-12 text-white shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Garden & Grains?</h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Whether you're dining in, ordering takeout, or planning an event, we've got you covered.
            </p>
          </div>
          
          {/* All three buttons in one line */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            {/* View Menu Button */}
            <Link 
              href="/menu" 
              className="flex-1 max-w-xs bg-white text-[#005B96] px-8 py-5 rounded-xl hover:bg-gray-50 text-xl font-bold transition flex flex-col items-center justify-center gap-3 min-h-[140px] shadow-lg hover:shadow-xl border-2 border-transparent hover:border-[#005B96]"
            >
              <div className="text-4xl">📋</div>
              <div>
                <div className="font-bold">View Menu</div>
                <div className="text-sm opacity-80 mt-1">Explore our delicious options</div>
              </div>
            </Link>
            
            {/* Book Catering Button */}
            <Link 
              href="/catering" 
              className="flex-1 max-w-xs bg-[#F4A261] text-white px-8 py-5 rounded-xl hover:bg-[#e68e42] text-xl font-bold transition flex flex-col items-center justify-center gap-3 min-h-[140px] shadow-lg hover:shadow-xl border-2 border-transparent hover:border-white"
            >
              <div className="text-4xl">🎉</div>
              <div>
                <div className="font-bold">Book Catering</div>
                <div className="text-sm opacity-90 mt-1">For events & gatherings</div>
              </div>
            </Link>
            
            {/* Reserve Table Button */}
            <Link 
              href="/reserve" 
              className="flex-1 max-w-xs bg-[#A3B899] text-white px-8 py-5 rounded-xl hover:bg-[#8A9B6E] text-xl font-bold transition flex flex-col items-center justify-center gap-3 min-h-[140px] shadow-lg hover:shadow-xl border-2 border-transparent hover:border-white"
            >
              <div className="text-4xl">🪑</div>
              <div>
                <div className="font-bold">Reserve Table</div>
                <div className="text-sm opacity-90 mt-1">Dine-in experience</div>
              </div>
            </Link>
          </div>
          
          {/* Small description below buttons */}
          <div className="text-center mt-10 text-white/80 text-sm">
            <p>📍 Uitsig Wine Farm, Cape Town | 📞 Call us: (021) 123-4567</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------- Connect Section - UPDATED colors --------------------
function ConnectSection() {
  return (
    <section className="py-16 px-6 text-center" style={{ 
      background: `linear-gradient(135deg, ${colors.darkAzure} 0%, ${colors.lightAzure} 100%)` 
    }}>
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-semibold mb-6 text-white">Connect With Us</h3>
        <p className="text-white/80 mb-8 text-lg">Follow us for updates, special offers, and behind-the-scenes content</p>
        <div className="flex justify-center gap-8 mb-10">
          {[
            { Icon: FaInstagram, name: "Instagram", color: "#E1306C" },
            { Icon: FaFacebook, name: "Facebook", color: "#1877F2" },
            { Icon: FaTiktok, name: "TikTok", color: "#000000" },
            { Icon: FaTwitter, name: "Twitter", color: "#1DA1F2" }
          ].map(({ Icon, name, color }, i) => (
            <a 
              key={i} 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-4xl transition transform hover:scale-110 hover:rotate-3"
              title={name}
              style={{ color }}
            >
              <Icon />
            </a>
          ))}
        </div>
        <p className="text-white/60 text-sm">
          Uitsig Wine Farm: ERF12995 Spaanschemat River Rd, Fir Grove, Cape Town, 7806
        </p>
      </div>
    </section>
  );
}

// -------------------- HomePage - NO REVIEWS SECTION --------------------
export default function HomePage() {
  return (
    <PageWrapper>
      <main className="min-h-screen" style={{ backgroundColor: colors.whitishFade }}>
        {/* Fixed Header - Keep as is from your original */}
        
        {/* Hero Banner Section */}
        <section className="relative pt-0">
          <DynamicBanner />
        </section>

        {/* Healthy Meals Section with Dynamic Banner Background */}
        <HealthyMealsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Menu Section with UPDATED Garden & Grains Colors */}
        <MenuSection />

        {/* Action Buttons Section - All three in one line */}
        <ActionButtonsSection />

        {/* Vision Section - UPDATED colors */}
        <section className="py-20 px-6 text-center" style={{ 
          background: `linear-gradient(to bottom, ${colors.whitishFade}, ${colors.darkAzure})` 
        }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-white">Our Vision</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl text-white leading-relaxed">
                A vibrant, modern brand where clean eating meets connection. Fresh, flavorful, and wholesome — 
                made for locals, remote workers, students, health enthusiasts, and anyone craving food that 
                nourishes both body and soul.
              </p>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <ConnectSection />

        {/* Floating Buttons */}
        <FloatingCartButton />
        <FloatingWhatsAppButton />
      </main>
    </PageWrapper>
  );
}
