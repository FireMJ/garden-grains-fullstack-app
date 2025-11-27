"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Define TypeScript interfaces
interface User {
  id: string;
  name: string;
  email?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  user?: User;
  createdAt?: string;
  itemId?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Review[]>("/api/reviews");
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6">
        <h1 className="text-2xl font-semibold mb-6">Customer Testimonials</h1>
        <div className="flex justify-center items-center py-8">
          <div className="animate-pulse text-gray-500">Loading reviews...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6">
        <h1 className="text-2xl font-semibold mb-6">Customer Testimonials</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-semibold mb-2 text-gray-800">Customer Testimonials</h1>
      <p className="text-gray-600 mb-6">See what our customers are saying about their experience</p>
      
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No reviews yet.</p>
          <p className="text-gray-400 mt-2">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-yellow-500 text-lg font-semibold">
                  {renderStars(review.rating)}
                  <span className="text-gray-600 text-sm ml-2">
                    {review.rating}/5
                  </span>
                </p>
                {review.createdAt && (
                  <p className="text-sm text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <p className="italic text-gray-700 text-lg leading-relaxed mb-4">
                &ldquo;{review.comment}&rdquo;
              </p>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">
                  — {review.user?.name || "Anonymous Customer"}
                </p>
                {review.itemId && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    Item #{review.itemId}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}