"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const menuCategories = [
  {
    title: "Breakfast",
    description: "Start your day with nourishing, energy-packed bowls",
    image: "/images/menu/breakfast.jpg",
    href: "/menu/breakfast",
    color: "from-[#F4A261] to-[#E76F51]",
    items: [
      "Yoghurt, Chia Seeds & Fruit Bowl",
      "Nutritious Breakfast Bowl", 
      "Roasted Oats and Nuts Bowl",
      "Granola and Yogurt Bowl",
      "All-Bran and Yogurt Bowl"
    ]
  },
  {
    title: "Nourish Bowls",
    description: "Wholesome, balanced meals for lunch and dinner",
    image: "/images/menu/bowls.jpg",
    href: "/menu/bowls",
    color: "from-[#6C7B58] to-[#8A9B6E]",
    items: [
      "Smoky Chipotle Chicken Bowl",
      "Beef Glow Bowl",
      "Fiery Chickpea Bowl",
      "Boiled Egg & Tofu Power Bowl",
      "Grilled Chicken Poke Bowl"
    ]
  },
  {
    title: "Fresh Juices",
    description: "Cold-pressed juices and healthy beverages",
    image: "/images/menu/juices.jpg",
    href: "/menu/juices",
    color: "from-[#2A5568] to-[#1E4259]",
    items: [
      "Green Detox Juice",
      "Tropical Bliss",
      "Red Revitalize", 
      "Citrus Burst",
      "Berry Boost"
    ]
  },
  {
    title: "Fries & Sides",
    description: "Perfect accompaniments to your meal",
    image: "/images/menu/fries.jpg",
    href: "/menu/fries",
    color: "from-[#E76F51] to-[#F4A261]",
    items: [
      "Regular Fries",
      "Sweet Potato Fries",
      "Loaded Fries",
      "Garlic Sauce",
      "Cheese Sauce"
    ]
  },
  {
    title: "Pastas",
    description: "Authentic Italian pasta dishes made with fresh ingredients",
    image: "/images/menu/pastas.jpg",
    href: "/menu/pastas",
    color: "from-[#8B4513] to-[#D2691E]",
    items: [
      "Creamy Mushroom Pasta",
      "Classic Bolognese",
      "Pesto Pasta",
      "Carbonara",
      "Arrabbiata"
    ]
  },
  {
    title: "Salads",
    description: "Crisp, fresh salads made with locally sourced ingredients",
    image: "/images/menu/salads.jpg",
    href: "/menu/salads",
    color: "from-[#4A7C59] to-[#6B8E23]",
    items: [
      "Protein Pack Salad",
      "Greek Salad",
      "Caesar Salad",
      "Quinoa Salad",
      "Chicken Avo Salad"
    ]
  },
  {
    title: "Smoothies",
    description: "Refreshing and nutritious smoothies made with fresh fruits",
    image: "/images/menu/smoothies.jpg",
    href: "/menu/smoothies",
    color: "from-[#FF6B6B] to-[#FFA726]",
    items: [
      "Berry Blast Smoothie",
      "Green Detox Smoothie",
      "Tropical Paradise",
      "Protein Power Smoothie",
      "Chocolate Banana"
    ]
  },
  {
    title: "Soups",
    description: "Warm, comforting soups made with fresh ingredients",
    image: "/images/menu/soups.jpg",
    href: "/menu/soups",
    color: "from-[#8B7355] to-[#CD853F]",
    items: [
      "Creamy Tomato Soup",
      "Chicken Noodle Soup",
      "Butternut Squash Soup",
      "Lentil Soup",
      "Vegetable Soup"
    ]
  },
  {
    title: "Stirfry",
    description: "Quick, flavorful stirfry dishes with fresh vegetables",
    image: "/images/menu/stirfry.jpg",
    href: "/menu/stirfry",
    color: "from-[#DC2626] to-[#EA580C]",
    items: [
      "Chicken Stirfry",
      "Beef Stirfry",
      "Vegetable Stirfry",
      "Tofu Stirfry",
      "Shrimp Stirfry"
    ]
  },
  {
    title: "Toasties",
    description: "Delicious, crispy toasties made with artisanal bread",
    image: "/images/menu/toasties.jpg",
    href: "/menu/toasties",
    color: "from-[#D97706] to-[#F59E0B]",
    items: [
      "Ham & Cheese Toastie",
      "Chicken Mayo Toastie",
      "Vegetable Toastie",
      "Bacon & Avo Toastie",
      "Macon, Egg & Cheese"
    ]
  },
  {
    title: "Wraps",
    description: "Fresh, flavorful wraps perfect for lunch on the go",
    image: "/images/menu/wraps.jpg",
    href: "/menu/wraps",
    color: "from-[#059669] to-[#10B981]",
    items: [
      "Chicken Avo Wrap",
      "Falafel Wrap",
      "Beef Wrap",
      "Vegetable Wrap",
      "Chicken Caesar Wrap"
    ]
  }
];

export default function MenuPage() {
  const { state } = useCart();

  return (
    <div className="min-h-screen bg-[#1E4259] pt-20">
      {/* Navigation Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link 
              href="/"
              className="flex items-center text-white hover:text-[#F4A261] transition"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-white">Garden Grains</h1>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Complete Menu
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our carefully crafted selection of healthy and delicious options,
            made with the freshest local ingredients.
          </p>
        </div>

        {/* Cart Summary - Sticky */}
        {state.itemCount > 0 && (
          <div className="sticky top-20 z-40 bg-white rounded-lg shadow-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">
                  {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in cart
                </p>
                <p className="text-green-600 font-bold text-lg">
                  Total: R{state.total.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/cart"
                  className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition font-semibold"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  className="bg-[#6C7B58] text-white px-4 py-2 rounded-lg hover:bg-[#5a6a4d] transition font-semibold"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Menu Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {menuCategories.map((category, index) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              {/* Category Image */}
              <div className="relative h-48 w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback to gradient if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>

              {/* Category Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#F4A261] transition-colors duration-200">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <div className="text-[#F4A261] group-hover:translate-x-1 transition-transform duration-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Popular Items */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Items:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {category.items.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-[#F4A261] rounded-full mr-2" />
                        {item}
                      </li>
                    ))}
                    {category.items.length > 3 && (
                      <li className="text-[#F4A261] font-medium">
                        +{category.items.length - 3} more items
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-4">
                  <span className="inline-flex items-center text-[#F4A261] font-semibold group-hover:translate-x-1 transition-transform duration-200">
                    Browse {category.title}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-300 mb-6">
              We're constantly updating our menu with new, exciting options.
              Feel free to contact us with any special requests or dietary requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition font-semibold"
              >
                Contact Us
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#1E4259] transition font-semibold"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
