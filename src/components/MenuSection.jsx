"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// -------------------- Types --------------------
const favorites = [
  {
    name: "Protein Pack Salad",
    price: 125,
    tags: ["Popular", "High Protein"],
    image: "/images/favorites/protein-pack-salad.jpg",
    link: "/menu/salads",
  },
  {
    name: "Chicken Avo Wrap",
    price: 115,
    tags: ["Customer Favorite", "New"],
    image: "/images/favorites/chicken-avo-wrap.jpg",
    link: "/menu/wraps",
  },
  {
    name: "Avocado Protein Stack",
    price: 120,
    tags: ["Vegetarian", "Healthy"],
    image: "/images/favorites/avocado-protein-stack-salad.jpg",
    link: "/menu/salads",
  },
];

const menuCategories = [
  "Salads", "Bowls", "Stir Fry", "Pastas", "Soups",
  "Fries", "Toasties", "Wraps", "Smoothies", "Juices", "Breakfast",
];

// -------------------- Components --------------------
const MenuItemCard = ({ name, price, tags, image, link }) => (
  <Link
    href={link}
    className="bg-white dark:bg-[white] rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 group"
  >
    <div className="relative h-48 w-full">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 dark:text-[#0a0a0a] text-lg mb-2">{name}</h3>
      <p className="text-primary font-bold text-xl mb-3">R{price}</p>
      <div className="flex flex-wrap gap-1">
        {tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-secondary text-[#0a0a0a] text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </Link>
);

const MenuSection = () => (
  <section className="py-16 px-6 bg-gradient-to-b from-background to-header text-center">
    <div className="max-w-6xl mx-auto">
      {/* Section Title */}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-6">
        Explore Our Menu
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
        Fresh, wholesome dishes designed to nourish and delight — discover your next favorite.
      </p>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {menuCategories.map((category) => {
          // Special handling for "Stir Fry" to use "stirfry" without hyphen
          const href = category === "Stir Fry" 
            ? "/menu/stirfry" 
            : `/menu/${category.toLowerCase().replace(" ", "-")}`;
          
          return (
            <Link
              key={category}
              href={href}
              className="px-4 py-2 rounded-full bg-[#F4A261] text-white font-medium hover:bg-[#e68e42] transition shadow-md"
            >
              {category}
            </Link>
          );
        })}
      </div>

      {/* Favorite Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((item, idx) => (
          <MenuItemCard key={idx} {...item} />
        ))}
      </div>

      {/* View Full Menu Button */}
      <div className="mt-12">
        <Link
          href="/menu"
          className="inline-block bg-secondary text-white px-8 py-3 rounded-lg hover:bg-[#5a6a4a] transition shadow-lg font-semibold"
        >
          View Full Menu
        </Link>
      </div>
    </div>
  </section>
);

export default MenuSection;