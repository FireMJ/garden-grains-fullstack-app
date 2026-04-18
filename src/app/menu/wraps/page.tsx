'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { wraps } from '@/data/wrapsData';
import { loadPopularItems, isItemPopular } from '@/services/popularItemsService';
import { FaChevronRight, FaFire } from 'react-icons/fa';

export default function WrapsPage() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [popularItems, setPopularItems] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadPopularItems();
    const popularStatus: Record<string, boolean> = {};
    wraps.forEach(wrap => { popularStatus[wrap.id] = isItemPopular(wrap.id, 'wraps'); });
    setPopularItems(popularStatus);
  }, []);

  if (!mounted) return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/menu" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition">← Back to Menu</Link>
        <div className="text-center mb-8"><h1 className="text-4xl font-bold text-gray-900 mb-2">Wraps</h1><p className="text-gray-600 max-w-2xl mx-auto">Delicious wraps filled with fresh ingredients</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wraps.map((wrap) => (
            <Link key={wrap.id} href={`/menu/wraps/${wrap.slug}`} className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <Image src={wrap.image} alt={wrap.name} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized />
                {popularItems[wrap.id] && (<div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10"><FaFire className="w-3 h-3" /> Popular</div>)}
              </div>
              <div className="p-5"><h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{wrap.name}</h3><p className="text-gray-500 text-sm mb-3 line-clamp-2">{wrap.description}</p><div className="flex justify-between items-center mt-3"><div><span className="text-2xl font-bold text-green-600">R{wrap.price}</span></div><div className="flex items-center gap-1 text-green-600 group-hover:gap-2 transition-all duration-300"><span className="text-sm font-medium">View Details</span><FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" /></div></div></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
