"use client";

import React from "react";

interface FilterBarProps {
  setFilter: React.Dispatch<React.SetStateAction<string | null>>;
}

const tags = ["🌶️ Spicy", "🥗 Vegan", "Halaal"];

export const FilterBar: React.FC<FilterBarProps> = ({ setFilter }) => {
  return (
    <div
      role="radiogroup"
      aria-label="Filter menu by tag"
      className="flex gap-2 mb-4"
    >
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          role="radio"
          onClick={() => setFilter(tag)}
          className="px-3 py-1 border rounded hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
        >
          {tag}
        </button>
      ))}
      <button
        type="button"
        role="radio"
        onClick={() => setFilter(null)}
        className="px-3 py-1 border rounded hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200"
      >
        All
      </button>
    </div>
  );
};

export default FilterBar;
