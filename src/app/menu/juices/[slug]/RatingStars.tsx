"use client";

import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  onRate?: (value: number) => void;
  interactive?: boolean;
}

const RatingStars = ({ rating, onRate, interactive = false }: RatingStarsProps) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 cursor-pointer transition ${
            star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
};

export default RatingStars;
