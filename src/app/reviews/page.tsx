"use client";

import { useState, useEffect } from 'react';
import { Star, StarHalf, ThumbsUp, Flag, User, Calendar, Send } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
  helpful: number;
  adminReply?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews.filter((r: any) => r.status === 'approved'));
        setAverageRating(data.averageRating);
        setTotalReviews(data.total);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', rating: 5, comment: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400" size={16} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} className="fill-yellow-400 text-yellow-400" size={16} />);
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={16} />);
      }
    }
    return stars;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50]"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-gray-600">See what our customers are saying about us</p>
        </div>

        {/* Rating Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 text-center">
          <div className="text-5xl font-bold text-[#2F5D50] mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center gap-1 mb-2">{renderStars(Math.round(averageRating))}</div>
          <p className="text-gray-500">Based on {totalReviews} reviews</p>
        </div>

        {/* Write Review Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h2>
          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              Thank you for your review! It will be published after moderation.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5D50]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="focus:outline-none">
                      <Star className={`${star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`} size={28} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
              <textarea rows={4} value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5D50]" required></textarea>
            </div>
            <button type="submit" disabled={submitting} className="bg-[#2F5D50] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#23483E] transition-all disabled:opacity-50 flex items-center gap-2">
              {submitting ? 'Submitting...' : <><Send size={16} /> Submit Review</>}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl">
              <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2F5D50]/10 rounded-full flex items-center justify-center">
                      <User size={20} className="text-[#2F5D50]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Verified Order</span>}
                </div>
                <p className="text-gray-600 mb-3">{review.comment}</p>
                {review.adminReply && (
                  <div className="mt-3 pl-4 border-l-2 border-[#2F5D50] bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-[#2F5D50] mb-1">Response from Garden Grains:</p>
                    <p className="text-sm text-gray-600">{review.adminReply}</p>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-3 pt-2 border-t">
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2F5D50] transition-colors">
                    <ThumbsUp size={14} /> Helpful ({review.helpful || 0})
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                    <Flag size={14} /> Report
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
