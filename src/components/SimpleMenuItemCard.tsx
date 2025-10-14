import React, { useState } from 'react';
import Image from 'next/image';

interface SimpleMenuItemCardProps {
  name: string;
  price: number;
  tags?: string[];
  image: string;
  className?: string;
}

const SimpleMenuItemCard = ({ name, price, tags, image, className }: SimpleMenuItemCardProps) => {
  const [showAddOns, setShowAddOns] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (addon: string) => {
    setSelectedAddOns((prev) => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="relative h-48">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-green-600 font-bold">R{price}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        <button 
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-700 transition-colors"
          onClick={() => setShowAddOns((prev) => !prev)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SimpleMenuItemCard;
