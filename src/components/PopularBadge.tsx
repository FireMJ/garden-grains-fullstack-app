'use client';

import { useState, useEffect } from 'react';
import { isItemPopular, loadPopularItems } from '@/services/popularItemsService';
import { FaFire } from 'react-icons/fa';

interface PopularBadgeProps {
  itemId: string;
  category: string;
  itemName?: string;
}

export default function PopularBadge({ itemId, category, itemName }: PopularBadgeProps) {
  const [isPopular, setIsPopular] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadPopularItems();
    const popular = isItemPopular(itemId, category);
    setIsPopular(popular);
  }, [itemId, category]);

  if (!mounted || !isPopular) return null;

  return (
    <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
      <FaFire className="w-3 h-3" />
      Popular
    </span>
  );
}
