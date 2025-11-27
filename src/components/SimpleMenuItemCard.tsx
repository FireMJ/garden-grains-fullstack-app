"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MenuItemProps {
  name: string;
  price: number;
  tags?: string[];
  image: string;
  link: string;
}

const SimpleMenuItemCard: React.FC<MenuItemProps> = ({ name, price, tags, image, link }) => {
  return (
    <Link
      href={link}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      <div className="relative h-48 w-full">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-[#F4A261] font-bold">R{price}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags?.map((tag, i) => (
            <span key={i} className="bg-[#6C7B58] text-white text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default SimpleMenuItemCard;
