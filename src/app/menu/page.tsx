"use client";

import { useRouter } from "next/navigation";

const menuCategories = [
  {
    name: "Bowls",
    description: "Nutritious grain and protein bowls",
    image: "/images/menu/bowls.jpg",
    href: "/menu/bowls",
    color: "bg-green-500"
  },
  {
    name: "Salads",
    description: "Fresh, crisp salads with homemade dressings",
    image: "/images/menu/salads.jpg",
    href: "/menu/salads",
    color: "bg-blue-500"
  },
  {
    name: "Wraps",
    description: "Hearty wraps and sandwiches",
    image: "/images/menu/wraps.jpg",
    href: "/menu/wraps",
    color: "bg-yellow-500"
  },
  {
    name: "Smoothies",
    description: "Fresh fruit and vegetable smoothies",
    image: "/images/menu/smoothies.jpg",
    href: "/menu/smoothies",
    color: "bg-purple-500"
  },
  {
    name: "Juices",
    description: "Cold-pressed juices and detox drinks",
    image: "/images/menu/juices.jpg",
    href: "/menu/juices",
    color: "bg-orange-500"
  },
  {
    name: "Breakfast",
    description: "Healthy breakfast options",
    image: "/images/menu/breakfast.jpg",
    href: "/menu/breakfast",
    color: "bg-red-500"
  }
];

export default function MenuPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600">Fresh, healthy, and delicious options for every taste</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuCategories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => router.push(category.href)}
            >
              <div className={`h-48 ${category.color} flex items-center justify-center`}>
                <span className="text-white text-6xl">🍽️</span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <button className="text-green-600 hover:text-green-700 font-semibold">
                  Browse {category.name} →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Catering Services</h2>
            <p className="text-gray-600 mb-6">Planning an event? Check out our professional catering options.</p>
            <button
              onClick={() => router.push("/catering")}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              View Catering Options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
