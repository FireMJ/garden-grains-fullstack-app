"use client";

import Link from "next/link";

const menuCategories = [
  {
    name: "Bowls",
    description: "Manage bowl items and pricing",
    href: "/menu/bowls",
    icon: "🥣",
    count: 12,
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "Salads", 
    description: "Manage salad items and ingredients",
    href: "/menu/salads",
    icon: "🥗",
    count: 8,
    color: "from-lime-500 to-green-600"
  },
  {
    name: "Wraps",
    description: "Manage wrap options and fillings",
    href: "/menu/wraps", 
    icon: "🌯",
    count: 6,
    color: "from-amber-500 to-orange-600"
  },
  {
    name: "Smoothies",
    description: "Manage smoothie recipes and pricing",
    href: "/menu/smoothies",
    icon: "🥤",
    count: 10,
    color: "from-purple-500 to-pink-600"
  },
  {
    name: "Juices",
    description: "Manage juice options and cleanses",
    href: "/menu/juices",
    icon: "🧃",
    count: 7,
    color: "from-red-500 to-orange-600"
  },
  {
    name: "Breakfast",
    description: "Manage breakfast menu items",
    href: "/menu/breakfast",
    icon: "🍳",
    count: 9,
    color: "from-yellow-500 to-amber-600"
  },
  {
    name: "Pastas",
    description: "Manage pasta dishes and sauces",
    href: "/menu/pastas",
    icon: "🍝",
    count: 5,
    color: "from-orange-500 to-red-600"
  },
  {
    name: "Stir Fry",
    description: "Manage stir-fry options and ingredients",
    href: "/menu/stirfry", 
    icon: "🍲",
    count: 4,
    color: "from-rose-500 to-red-600"
  },
  {
    name: "Soups",
    description: "Manage soup recipes and seasonal offerings",
    href: "/menu/soups",
    icon: "🍜",
    count: 6,
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "Fries",
    description: "Manage fry options and dipping sauces",
    href: "/menu/fries",
    icon: "🍟",
    count: 3,
    color: "from-amber-600 to-yellow-600"
  },
  {
    name: "Toasties",
    description: "Manage toasted sandwich options",
    href: "/menu/toasties",
    icon: "🥪",
    count: 5,
    color: "from-brown-500 to-amber-600"
  }
];

export default function DashboardMenuCategories() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Menu Categories</h2>
        <Link 
          href="/menu"
          className="bg-[#F4A261] text-white px-4 py-2 rounded-lg hover:bg-[#e68e42] transition font-semibold"
        >
          View Customer Menu
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {menuCategories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 hover:shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">{category.icon}</div>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                {category.count} items
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-[#F4A261] transition mb-1">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600">{category.description}</p>
            <div className="mt-3 text-xs text-[#F4A261] font-semibold group-hover:underline">
              Manage items →
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/menu?add=new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
          >
            + Add New Item
          </Link>
          <Link
            href="/menu/categories"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
          >
            Manage Categories
          </Link>
          <Link
            href="/menu/pricing"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-semibold text-sm"
          >
            Update Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
