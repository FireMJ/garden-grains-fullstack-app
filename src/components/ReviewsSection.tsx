"use client";

import React, { useState, useEffect } from "react";

export interface Review {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface ReviewsSectionProps {
  itemId: string;
  showHeader?: boolean;
  maxReviews?: number;
}

export default function ReviewsSection({ 
  itemId, 
  showHeader = true, 
  maxReviews = 10 
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Use your existing API route with itemId filter
        const response = await fetch(`/api/reviews?itemId=${itemId}&take=${maxReviews}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.avgRating || 0);
        
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Failed to load reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchReviews();
    }
  }, [itemId, maxReviews]);

  const totalReviews = reviews.length;
  const formattedAverage = averageRating ? averageRating.toFixed(1) : "0.0";

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <span className="text-yellow-500 font-bold text-sm">
          {"★".repeat(Math.floor(rating))}
          {"☆".repeat(5 - Math.floor(rating))}
        </span>
        <span className="ml-1 text-gray-600 text-xs">({rating})</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const displayedReviews = isExpanded ? reviews : reviews.slice(0, 2);

  return (
    <div className="mt-4">
      {/* Dropdown Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        disabled={loading}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="font-semibold text-gray-800">{formattedAverage}</span>
          </div>
          <span className="text-gray-600 text-sm">
            {loading ? "Loading..." : `${totalReviews} review${totalReviews !== 1 ? 's' : ''}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse"></div>
          ) : totalReviews > 0 ? (
            <>
              <span className="text-gray-500 text-sm">
                {isExpanded ? 'Show Less' : 'Show All'}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          ) : (
            <span className="text-gray-400 text-sm">No reviews</span>
          )}
        </div>
      </button>

      {/* Reviews Content */}
      {isExpanded && (
        <div className="mt-3 space-y-3 border-t pt-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 border rounded-lg bg-gray-50 animate-pulse">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                  </div>
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-3 border border-red-200 rounded-lg bg-red-50">
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Try Again
              </button>
            </div>
          ) : displayedReviews.length === 0 ? (
            <div className="p-4 text-center border rounded-lg bg-gray-50">
              <p className="text-gray-500 text-sm">No reviews yet.</p>
              <p className="text-gray-400 text-xs mt-1">Be the first to review this item!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-3 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-gray-800 text-sm">
                        {review.user.name || review.user.email.split('@')[0]}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {review.text && (
                    <p className="text-gray-600 text-sm leading-relaxed mt-2">
                      {review.text}
                    </p>
                  )}
                </div>
              ))}
              
              {reviews.length > maxReviews && isExpanded && (
                <div className="text-center pt-2">
                  <button className="text-[#F4A261] hover:text-[#e68e42] text-sm font-medium transition-colors">
                    Load More Reviews
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}