"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, MessageCircle, Trash2, Star, RefreshCw } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: string;
  adminReply?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (id: string, action: string, reply?: string) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, reply }),
      });
      if (response.ok) {
        fetchReviews();
        setSelectedReview(null);
        setReplyText('');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50]"></div></div>;
  }

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
            <p className="text-gray-500 mt-1">Moderate customer reviews and respond to feedback</p>
          </div>
          <button onClick={fetchReviews} className="flex items-center gap-2 px-4 py-2 bg-[#2F5D50] text-white rounded-lg hover:bg-[#23483E]">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Pending Reviews */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Approval ({pendingReviews.length})</h2>
          {pendingReviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center">
              <p className="text-gray-500">No pending reviews</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-900">{review.name}</p>
                        <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                      </div>
                      <p className="text-gray-600 mb-2">{review.comment}</p>
                      <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(review.id, 'approve')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1">
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleAction(review.id, 'reject')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1">
                        <XCircle size={14} /> Reject
                      </button>
                      <button onClick={() => setSelectedReview(review)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
                        <MessageCircle size={14} /> Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approved Reviews */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Approved Reviews ({approvedReviews.length})</h2>
          <div className="space-y-4">
            {approvedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    {review.adminReply && (
                      <div className="mt-2 pl-3 border-l-2 border-[#2F5D50] bg-gray-50 p-2 rounded">
                        <p className="text-sm font-medium text-[#2F5D50]">Admin Response:</p>
                        <p className="text-sm text-gray-600">{review.adminReply}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedReview(review)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1">
                      <MessageCircle size={14} /> Reply
                    </button>
                    <button onClick={() => handleAction(review.id, 'delete')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Modal */}
        {selectedReview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedReview(null)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Reply to Review</h2>
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{selectedReview.name}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedReview.comment}</p>
              </div>
              <textarea rows={4} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your response..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F5D50]" />
              <div className="flex gap-3 mt-4">
                <button onClick={() => handleAction(selectedReview.id, 'reply', replyText)} className="flex-1 bg-[#2F5D50] text-white py-2 rounded-lg">Send Reply</button>
                <button onClick={() => setSelectedReview(null)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
