import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    slug: string;
    image?: string;
    tags?: string[];
    popular?: boolean;
  };
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  // Fallback image if none provided
  const imageUrl = item.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
  
  return (
    <Link href={`/menu/${item.category}/${item.slug}`}>
      <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer">
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Popular Badge */}
          {item.popular && (
            <div className="absolute top-4 right-4 bg-[#94aa4d] text-white text-xs px-3 py-1 rounded-full font-medium">
              Popular
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#94aa4d] transition-colors">
              {item.name}
            </h3>
            <span className="text-xl font-bold text-[#94aa4d]">
              R{item.price.toFixed(2)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* View Details Button */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Click to view details</span>
            <div className="text-[#94aa4d] font-medium text-sm flex items-center gap-1">
              View Details
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MenuItemCard;
