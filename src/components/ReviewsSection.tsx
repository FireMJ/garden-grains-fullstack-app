"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from "firebase/firestore";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

interface ReviewsSectionProps {
  itemId: string;
}

export default function ReviewsSection({ itemId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    const q = query(collection(db, "reviews"), where("itemId", "==", itemId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review)));
  };

  const handleSubmit = async () => {
    if (!userName || !comment) return alert("Please fill in name and comment.");
    setLoading(true);
    try {
      await addDoc(collection(db, "reviews"), { itemId, userName, rating, comment, createdAt: serverTimestamp() });
      setUserName("");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [itemId]);

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
      <h4 className="font-semibold text-gray-800 mb-3">Reviews</h4>

      <div className="space-y-2 mb-4">
        <input type="text" placeholder="Your name" className="w-full p-2 border rounded-md" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <textarea placeholder="Your review" className="w-full p-2 border rounded-md" rows={2} value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="flex items-center gap-2">
          <label className="font-medium">Rating:</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="p-1 border rounded-md">
            {[5, 4, 3, 2, 1].map((r) => (<option key={r} value={r}>{r} ★</option>))}
          </select>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="border-b pb-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{r.userName}</span>
              <span className="text-yellow-500">{r.rating} ★</span>
            </div>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}