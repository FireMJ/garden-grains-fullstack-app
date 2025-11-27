"use client";

import { useState } from 'react';

interface CupSizeSelectorProps {
  sizes: string[];
  prices: { [key: string]: number };
  onSizeSelect: (size: string) => void;
  required?: boolean;
}

export default function CupSizeSelector({ 
  sizes, 
  prices, 
  onSizeSelect, 
  required = true 
}: CupSizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState('');

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    onSizeSelect(size);
  };

  return (
    <div className="mb-4">
      <label className="block text-white text-sm font-semibold mb-2">
        Cup Size {required && '*'}
      </label>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => handleSizeSelect(size)}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              selectedSize === size
                ? 'bg-[#F4A261] border-[#F4A261] text-white'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
          >
            <div className="text-sm font-semibold">{size}</div>
            <div className="text-xs opacity-80">R{prices[size]}</div>
          </button>
        ))}
      </div>
      {required && !selectedSize && (
        <p className="text-red-400 text-xs mt-1">Please select a cup size</p>
      )}
    </div>
  );
}
