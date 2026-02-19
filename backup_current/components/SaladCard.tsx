"use client";
import React, { ReactNode } from "react";
import Image from "next/image";

interface SaladCardProps {
  name: string;
  price: number | string;
  tags?: string[];
  image?: string;
  children?: ReactNode;
}

const SaladCard: React.FC<SaladCardProps> = ({ name, price, tags, image, children }) => {
  return (
    <div
      className="group flex flex-col rounded-2xl shadow-lg bg-white overflow-hidden
                 transform transition-transform duration-300
                 hover:scale-105 md:hover:scale-103
                 hover:shadow-2xl md:hover:shadow-xl
                 active:scale-105 active:shadow-2xl
                 focus-within:scale-105 focus-within:shadow-2xl"
      tabIndex={0} // focusable for mobile
    >
      {/* Image with aspect ratio and subtle zoom */}
      <div className="w-full aspect-[1/1] sm:aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Name, price, tags, and children content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm font-medium text-gray-800 mt-1">R{price}</p>

        {tags && tags.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {children && <div className="mt-3 flex flex-col flex-grow">{children}</div>}
      </div>
    </div>
  );
};

export default SaladCard;
