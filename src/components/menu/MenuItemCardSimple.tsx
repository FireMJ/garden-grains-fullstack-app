"use client";
import React from "react";

interface MenuItemCardProps {
  name: string;
  price: number | string;
  tags?: string[];
}

export default function MenuItemCardSimple({ name, price, tags = [] }: MenuItemCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition p-4 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-green-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600">R {price}</p>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
