'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaRegStar, FaTrash, FaEdit } from 'react-icons/fa';

interface Review {
  id: string;
  userId: string;
  userName: string;
  itemId: string;
  itemName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  date: string;
  helpful: number;
  verified: boolean;
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    itemName: '',
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    loadReviews();
    if (user) {
      loadUserReviews();
    }
  }, [user]);

  const loadReviews = () => {
    // Mock reviews - replace with actual API call
    const mockReviews: Review[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        itemId: 'soup-1',
        itemName: 'Creamy Broccoli Soup',
        rating: 5,
        title: 'Absolutely delicious!',
        comment: 'Best soup I\'ve ever had. Creamy and flavorful.',
        date: '2024-03-15',
        helpful: 12,
        verified: true,
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        itemId: 'toastie-1',
        itemName: 'Bacon, Egg & Cheese Toastie',
        rating: 4,
        title: 'Great breakfast option',
        comment: 'Perfectly toasted, generous filling.',
        date: '2024-03-14',
        helpful: 8,
        verified: true,
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Mike Johnson',
        itemId: 'bowl-1',
        itemName: 'Smoky Chipotle Bowl',
        rating: 5,
        title: 'Healthy and tasty',
        comment: 'Love the combination of flavors.',
        date: '2024-03-13',
        helpful: 15,
        verified: true,
      },
    ];
    
    setReviews(mockReviews);
    
    // Calculate stats
    const total = mockReviews.length;
    const sum = mockReviews.reduce((acc, r) => acc + r.rating, 0);
    setAverageRating(sum / total);
    
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    mockReviews.forEach(r => {
      counts[r.rating as keyof typeof counts]++;
    });
    setRatingCounts(counts);
  };

  const loadUserReviews = () => {
    // Mock user reviews
    const mockUserReviews: Review[] = [];
    setUserReviews(mockUserReviews);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    
    const review: Review = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      itemId: newReview.itemName.toLowerCase().replace(/\s+/g, '-'),
      itemName: newReview.itemName,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString(),
      helpful: 0,
      verified: true,
    };
    
    setReviews([review, ...reviews]);
    setUserReviews([review, ...userReviews]);
    setShowWriteReview(false);
    setNewReview({ itemName: '', rating: 5, title: '', comment: '' });
    
    alert('Thank you for your review!');
  };

  const StarRating = ({ rating, onRatingChange, size = 'md' }: { rating: number; onRatingChange?: (r: number) => void; size?: string }) => {
    const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
    const starSize = sizes[size as keyof typeof sizes] || sizes.md;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange?.(star)}
            className={onRatingChange ? 'cursor-pointer' : 'cursor-default'}
          >
            {star <= rating ? (
              <FaStar className={`${starSize} text-yellow-500`} />
            ) : star - 0.5 === rating ? (
              <FaStarHalfAlt className={`${starSize} text-yellow-500`} />
            ) : (
              <FaRegStar className={`${starSize} text-yellow-500`} />
            )}
          </button>
        ))}
      </div>
    );
  };

  const filteredReviews = selectedRating ? reviews.filter(r => r.rating === selectedRating) : reviews;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center mt-2">
                  <StarRating rating={Math.round(averageRating)} size="lg" />
                </div>
                <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</p>
              </div>
              
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition"
                  >
                    <span className="text-sm font-medium w-8">{star} ★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${(ratingCounts[star as keyof typeof ratingCounts] / reviews.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{ratingCounts[star as keyof typeof ratingCounts]}</span>
                  </button>
                ))}
              </div>
              
              {user && (
                <button
                  onClick={() => setShowWriteReview(true)}
                  className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Write a Review
                </button>
              )}
              
              {userReviews.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-gray-900 mb-3">Your Reviews</h3>
                  {userReviews.map((review) => (
                    <div key={review.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{review.itemName}</p>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-700">
                            <FaEdit size={14} />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{review.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Reviews List */}
          <div className="lg:col-span-2">
            {selectedRating && (
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">Showing {filteredReviews.length} reviews with {selectedRating} stars</p>
                <button onClick={() => setSelectedRating(null)} className="text-sm text-green-600 hover:underline">
                  Clear filter
                </button>
              </div>
            )}
            
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={review.rating} size="sm" />
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900">{review.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>{review.userName}</span>
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                        <span>{review.itemName}</span>
                      </div>
                    </div>
                    <button className="text-sm text-gray-400 hover:text-green-600">
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
              <button onClick={() => setShowWriteReview(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newReview.itemName}
                  onChange={(e) => setNewReview({ ...newReview, itemName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <StarRating rating={newReview.rating} onRatingChange={(r) => setNewReview({ ...newReview, rating: r })} size="lg" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
