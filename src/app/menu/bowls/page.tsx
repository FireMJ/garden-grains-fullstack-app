'use client';

import { useRouter } from 'next/navigation';
import { allBowls } from '@/data/bowlsData';

export default function BowlsListPage() {
  const router = useRouter();

  const handleNavigate = (slug: string) => {
    router.push(`/menu/bowls/${slug}`);
  };

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      {/* Navigation */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push("/menu")}
            className="flex items-center text-white hover:text-[#F4A261] transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Menu
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#F4A261] mb-4">Signature Bowls</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Customize your perfect bowl with fresh ingredients, premium proteins, and delicious dressings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBowls.map((bowl) => (
            <div
              key={bowl.id}
              className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-[#F4A261]/30 transition-all duration-300 cursor-pointer group"
              onClick={() => handleNavigate(bowl.slug)}
            >
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-[#2A5568] to-[#6C7B58] rounded-xl mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/80 text-sm">Bowl Image</span>
                </div>
              </div>

              {/* Bowl Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#F4A261] transition">
                    {bowl.name}
                  </h3>
                  <span className="text-lg font-bold text-green-300 bg-green-900/30 px-2 py-1 rounded">
                    R{bowl.price}
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {bowl.description}
                </p>

                {/* Quick Info */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="font-medium mr-2">Bases:</span>
                    <span>{bowl.bases.map(b => b.name).join(', ')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="font-medium mr-2">Proteins:</span>
                    <span>{bowl.includedIngredients.proteins.join(', ')}</span>
                  </div>
                </div>

                {/* Customize Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(bowl.slug);
                  }}
                  className="w-full mt-4 bg-[#F4A261] text-white py-3 rounded-lg font-semibold hover:bg-[#e68e42] transition group-hover:scale-105"
                >
                  Customize Bowl
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mt-16 bg-white/5 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
          <h2 className="text-2xl font-bold text-[#F4A261] mb-6 text-center">Available Add-Ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Extra Protein</h3>
              <p className="text-gray-300 text-sm">Add more chicken, beef, or tofu</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Premium Toppings</h3>
              <p className="text-gray-300 text-sm">Avocado, feta, nuts & more</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Side Fries</h3>
              <p className="text-gray-300 text-sm">Crispy sweet potato or regular fries</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Fresh Juice</h3>
              <p className="text-gray-300 text-sm">Boost your meal with a healthy juice</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
