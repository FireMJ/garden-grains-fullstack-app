"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import { 
  FaInstagram, 
  FaFacebook, 
  FaTiktok, 
  FaTwitter, 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaStar, 
  FaClock,
  FaShippingFast,
  FaLeaf,
  FaHeart,
  FaUsers,
  FaCalendarAlt,
  FaUtensils
} from "react-icons/fa";

import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";

// Color Scheme
const colors = {
  primaryBg: "#1e4259",        // Deep blue
  primaryGreen: "#94aa4d",     // Sage green
  secondaryGreen: "#6c8665",   // Darker green
  accentGreen: "#a5bbb9",      // Light green
  lightBg: "#f8f9fa",          // Light background
  textDark: "#2c3e50",         // Dark text
  textLight: "#7f8c8d",        // Light text
  white: "#ffffff",
  orange: "#ff9800",
};

// Banner Images - using a curated selection
const bannerImages = [
  "/images/banners/healthy-bowl.jpg",
  "/images/banners/fresh-salad.jpg",
  "/images/banners/smoothie-bar.jpg",
  "/images/banners/wrap-sandwich.jpg",
  "/images/banners/farm-table.jpg",
];

// -------------------- Floating Buttons --------------------
function FloatingCartButton() {
  const { cart } = useCart();
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-[#ff9800] text-white font-semibold py-3 px-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 z-40 hover:scale-105 animate-bounce-once"
    >
      <div className="relative">
        🛒
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#1e4259] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {itemCount}
          </span>
        )}
      </div>
      <span>View Cart</span>
    </Link>
  );
}

function FloatingWhatsAppButton() {
  return (
    <a
      href="https://wa.me/27693765574"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 bg-[#25D366] text-white font-semibold py-3 px-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 z-40 hover:scale-105"
    >
      <FaWhatsapp className="h-6 w-6" />
      <span className="text-sm font-medium">Order via WhatsApp</span>
    </a>
  );
}

// -------------------- Modern Banner Carousel --------------------
function ModernBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + bannerImages.length) % bannerImages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Placeholder for images - you can replace with actual Image component */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e4259] via-[#1e4259]/90 to-transparent">
            <div className="absolute inset-0 opacity-20 bg-[url('/images/patterns/leaf-pattern.svg')]"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <FaLeaf className="text-[#94aa4d]" />
                  <span className="text-white text-sm font-medium">Since 2024</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Fresh & 
                  <span className="block text-[#94aa4d]">Healthy</span>
                  Every Day
                </h1>
                
                <p className="text-xl text-white/90 mb-8 max-w-xl">
                  Organic meals crafted with love at Uitsig Wine Farm. 
                  Experience farm-to-table dining with delivery & pickup available.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/menu"
                    className="bg-[#94aa4d] hover:bg-[#7d9243] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    <FaUtensils />
                    Order Now
                  </Link>
                  <Link
                    href="/about"
                    className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <FaUsers />
                    Learn More
                  </Link>
                </div>
                
                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mt-12">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <FaStar className="text-[#ff9800]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">4.9</div>
                      <div className="text-white/70 text-sm">Customer Rating</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <FaShippingFast className="text-[#94aa4d]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">30min</div>
                      <div className="text-white/70 text-sm">Avg Delivery</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <FaHeart className="text-[#ff6b6b]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">1000+</div>
                      <div className="text-white/70 text-sm">Happy Customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#94aa4d] w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// -------------------- Features Section --------------------
function FeaturesSection() {
  const features = [
    { 
      icon: "🌱", 
      title: "100% Organic", 
      description: "Locally sourced, chemical-free ingredients",
      color: "from-green-100 to-green-50"
    },
    { 
      icon: "⚡", 
      title: "Fast Delivery", 
      description: "30-45 minute delivery guarantee",
      color: "from-blue-100 to-blue-50"
    },
    { 
      icon: "❤️", 
      title: "Made with Love", 
      description: "Every dish prepared with care",
      color: "from-pink-100 to-pink-50"
    },
    { 
      icon: "♻️", 
      title: "Eco-Friendly", 
      description: "Sustainable & biodegradable packaging",
      color: "from-emerald-100 to-emerald-50"
    },
    { 
      icon: "👨‍🍳", 
      title: "Expert Chefs", 
      description: "Professional culinary team",
      color: "from-amber-100 to-amber-50"
    },
    { 
      icon: "⭐", 
      title: "Top Rated", 
      description: "Rated 4.9/5 by customers",
      color: "from-purple-100 to-purple-50"
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e4259] mb-4">
            Why Choose <span className="text-[#94aa4d]">Garden & Grains</span>
          </h2>
          <p className="text-xl text-[#666666] max-w-3xl mx-auto">
            We're committed to providing the best farm-to-table dining experience in Cape Town
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#94aa4d] to-[#6c8665] rounded-t-2xl"></div>
              <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-4xl">{feature.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1e4259] mb-3 text-center">{feature.title}</h3>
              <p className="text-[#666666] text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------- Operating Hours Banner --------------------
function HoursBanner() {
  return (
    <section className="py-12 px-6 bg-gradient-to-r from-[#1e4259] to-[#2c536b]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <FaClock className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Operating Hours</h3>
              <p className="text-white/80">Visit us or order online</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:text-right">
              <div className="text-white font-bold text-xl">Monday - Sunday</div>
              <div className="text-white/90 text-lg">10:00 AM - 8:30 PM</div>
            </div>
            
            <div className="h-12 w-px bg-white/30 hidden md:block"></div>
            
            <div className="text-center md:text-left">
              <div className="text-[#ff9800] font-bold text-lg">Dinner Prep Break</div>
              <div className="text-white/80">4:00 PM - 5:00 PM</div>
            </div>
          </div>
          
          <Link 
            href="/reserve" 
            className="bg-white hover:bg-gray-100 text-[#1e4259] font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Reserve Table
          </Link>
        </div>
      </div>
    </section>
  );
}

// -------------------- Menu Highlights --------------------
function MenuHighlightsSection() {
  const highlights = [
    { 
      name: "Smoky Chipotle Chicken Bowl", 
      price: "R163", 
      category: "Bowls",
      description: "Grilled chipotle-marinated chicken with fresh veggies",
      popular: true 
    },
    { 
      name: "Greek Salad", 
      price: "R125", 
      category: "Salads",
      description: "Fresh lettuce, tomatoes, peppers, feta & olives",
      vegetarian: true 
    },
    { 
      name: "Tangerine Dream Smoothie", 
      price: "From R65", 
      category: "Smoothies",
      description: "Naartje, orange, banana, greek yoghurt & honey",
      popular: true 
    },
    { 
      name: "Chicken Avocado Wrap", 
      price: "R135", 
      category: "Wraps",
      description: "Chicken breast, avocado, cherry tomatoes & spinach" 
    },
    { 
      name: "Beef & Veg Stir-Fry", 
      price: "R159", 
      category: "Stir-Fry",
      description: "Tender beef with fresh vegetables in savory sauce" 
    },
    { 
      name: "Creamy Butternut Soup", 
      price: "R130", 
      category: "Soups",
      description: "Roasted butternut with cinnamon & smoked paprika",
      vegetarian: true 
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e4259] mb-4">
            Menu <span className="text-[#94aa4d]">Highlights</span>
          </h2>
          <p className="text-xl text-[#666666] max-w-3xl mx-auto">
            Discover our most popular dishes made with fresh, local ingredients
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-48 relative bg-gradient-to-br from-green-200 to-yellow-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-30">
                    {item.category === 'Bowls' ? '🥗' : 
                     item.category === 'Smoothies' ? '🥤' :
                     item.category === 'Wraps' ? '🌯' :
                     item.category === 'Soups' ? '🍜' : '🍽️'}
                  </span>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-[#1e4259]">
                  {item.category}
                </div>
                {item.popular && (
                  <div className="absolute top-4 right-4 bg-[#ff9800] text-white px-3 py-1 rounded-full text-sm font-bold">
                    Popular
                  </div>
                )}
                {item.vegetarian && (
                  <div className="absolute top-12 right-4 bg-[#94aa4d] text-white px-3 py-1 rounded-full text-sm font-bold">
                    Vegetarian
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1e4259] mb-2">{item.name}</h3>
                <p className="text-[#666666] mb-4 text-sm">{item.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold text-[#94aa4d]">{item.price}</span>
                  <Link
                    href="/menu"
                    className="bg-[#1e4259] hover:bg-[#2c536b] text-white font-semibold py-2 px-6 rounded-xl transition duration-300 group-hover:scale-105"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-[#94aa4d] hover:bg-[#7d9243] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            View Full Menu
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// -------------------- Contact & Location Section --------------------
function ContactLocationSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-[#f8f9fa]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1e4259] mb-4">
            Visit Our <span className="text-[#94aa4d]">Farm Restaurant</span>
          </h2>
          <p className="text-xl text-[#666666] max-w-3xl mx-auto">
            Located at the beautiful Uitsig Wine Farm in Fir Grove, Cape Town
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-[#94aa4d]/10 rounded-xl flex items-center justify-center">
                <FaMapMarkerAlt className="h-6 w-6 text-[#94aa4d]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1e4259]">Location & Contact</h3>
                <p className="text-[#666666]">Find us at Uitsig Wine Farm</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <FaMapMarkerAlt className="h-6 w-6 mt-1 text-[#1e4259]" />
                <div>
                  <h4 className="font-bold mb-1 text-[#1e4259]">Address</h4>
                  <p className="text-[#666666]">
                    Uitsig Wine Farm<br />
                    ERF12995 Spaanschemat River Rd<br />
                    Fir Grove, Cape Town, 7806
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <FaPhone className="h-6 w-6 mt-1 text-[#1e4259]" />
                <div>
                  <h4 className="font-bold mb-1 text-[#1e4259]">Contact Information</h4>
                  <p className="text-[#666666]">
                    <strong>Phone:</strong> (069) 376-5574<br />
                    <strong>WhatsApp:</strong> +27 69 376 5574<br />
                    <strong>Email:</strong> info@gardengrains.co.za
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <FaClock className="h-6 w-6 mt-1 text-[#1e4259]" />
                <div>
                  <h4 className="font-bold mb-1 text-[#1e4259]">Operating Hours</h4>
                  <p className="text-[#666666]">
                    <strong>Monday - Sunday:</strong> 10:00 AM - 8:30 PM<br />
                    <strong className="text-[#ff9800]">Dinner Prep Break:</strong> 4:00 PM - 5:00 PM<br />
                    <em className="text-sm text-gray-500">Closed daily for dinner prep</em>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-[#6c8665] text-white hover:bg-[#5a7054]"
              >
                Get Directions →
              </Link>
              <a 
                href="https://wa.me/27693765574"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-[#25D366] text-white hover:bg-[#1da851]"
              >
                <FaWhatsapp /> WhatsApp Order
              </a>
            </div>
          </div>
          
          {/* Service Info Card */}
          <div className="bg-gradient-to-br from-[#1e4259] to-[#2c536b] rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <FaUsers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Services & Information</h3>
                <p className="text-white/80">Everything you need to know</p>
              </div>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-2 text-lg">Delivery Service</h4>
                <p className="text-white/90 text-sm">
                  Fast delivery within Cape Town area. Estimated delivery time: 30-45 minutes.
                </p>
              </div>
              
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-2 text-lg">Pickup Available</h4>
                <p className="text-white/90 text-sm">
                  Order online and pickup at our farm restaurant. Skip the wait!
                </p>
              </div>
              
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-2 text-lg">Dine-In Experience</h4>
                <p className="text-white/90 text-sm">
                  Enjoy our beautiful farm setting. Reservations recommended for dinner.
                </p>
              </div>
              
              <div className="p-4 bg-[#ff9800]/20 rounded-xl backdrop-blur-sm">
                <h4 className="font-bold mb-2 text-lg">Service Charge Notice</h4>
                <p className="text-white/90 text-sm">
                  A 10% service charge is automatically added to tables of 6 guests or more.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href="/reserve" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-white text-[#1e4259] hover:bg-gray-100"
              >
                <FaCalendarAlt /> Reserve Your Table Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// -------------------- Footer --------------------
function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#1e4259] to-[#2c536b] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center lg:text-left">
            <div className="text-3xl font-bold mb-2">Garden & Grains</div>
            <p className="text-white/70">Fresh, healthy meals since 2024</p>
            <p className="text-white/60 text-sm mt-2">
              Uitsig Wine Farm • Fir Grove, Cape Town, 7806
            </p>
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
                className="text-2xl text-white hover:text-[#94aa4d] transition-colors duration-300 hover:scale-110"
                title={name}
                aria-label={name}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-8 mb-8 text-center">
          <Link href="/menu" className="text-white/80 hover:text-white transition-colors">
            Menu
          </Link>
          <Link href="/about" className="text-white/80 hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="/catering" className="text-white/80 hover:text-white transition-colors">
            Catering
          </Link>
          <Link href="/reviews" className="text-white/80 hover:text-white transition-colors">
            Reviews
          </Link>
          <Link href="/faq" className="text-white/80 hover:text-white transition-colors">
            FAQ
          </Link>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-white/60 text-sm">
            &copy; {currentYear} Garden & Grains. All rights reserved.<br />
            Phone: (069) 376-5574 • WhatsApp: +27 69 376 5574<br />
            Operating Hours: Monday-Sunday 10:00-20:30 • Closed 16:00-17:00 for dinner prep
          </p>
        </div>
      </div>
    </footer>
  );
}

// -------------------- CSS Animations --------------------
const styles = `
@keyframes bounce-once {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-once {
  animation: bounce-once 2s ease-in-out infinite;
}
`;

// -------------------- Main HomePage Component --------------------
export default function HomePage() {
  return (
    <>
      <style jsx global>{styles}</style>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Banner */}
        <ModernBanner />

        {/* Features Section */}
        <FeaturesSection />

        {/* Operating Hours Banner */}
        <HoursBanner />

        {/* Menu Highlights */}
        <MenuHighlightsSection />

        {/* Contact & Location */}
        <ContactLocationSection />

        {/* Footer */}
        <FooterSection />

        {/* Floating Buttons */}
        <FloatingCartButton />
        <FloatingWhatsAppButton />
      </main>
    </>
  );
}
