const fs = require('fs');
const path = require('path');

// Read the updated menu data
const menuData = require('./src/data/menuData.ts');

// Update breakfast page
const breakfastPage = `
"use client";

import React from "react";
import MenuItemCard from "@/components/MenuItemCard";
import { breakfastBowls } from "@/data/menuData";

export default function BreakfastPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Breakfast Bowls</h1>
        <p className="text-gray-600 mb-8">Start your day with our nutritious breakfast bowls</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {breakfastBowls.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
`;

// Write updated pages
const pages = {
  'breakfast': breakfastPage,
  // Add other category pages as needed
};

Object.entries(pages).forEach(([category, content]) => {
  const pagePath = path.join('src/app/menu', category, 'page.tsx');
  fs.writeFileSync(pagePath, content);
  console.log(\`Updated \${category} page\`);
});
