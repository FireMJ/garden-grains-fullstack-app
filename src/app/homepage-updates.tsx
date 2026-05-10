// This file contains only the updated button components
// Import this into your homepage to replace the existing button functions

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaArrowRight, FaGift, FaTimes, FaStar, FaCheckCircle } from "react-icons/fa";

// Review Modal Component
function ReviewModal({ isOpen, onClose, onSubmit }: any) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name || !comment) {
      alert('Please fill in your name and review');
      return;
    }
    
    setIsSubmitting(true);
    await onSubmit({ name, rating, comment });
    setName('');
    setRating(5);
    setComment('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Share Your Constantia Moment 🌹</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
        </div>
        <div className="space-y-4">
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          <div>
            <p className="text-sm text-gray-700 mb-2">Your Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} className="text-2xl">
                  <FaStar className={(hoveredRating >= star || rating >= star) ? 'text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>
          <textarea placeholder="What made your Constantia moment special?" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full px-4 py-2 border rounded-lg" />
          <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
            {isSubmitting ? 'Submitting...' : 'Share My Moment'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Updated Like Counter Button - Now tracks actual likes and opens review modal
export function UpdatedLikeCounterButton() {
  const [isLiking, setIsLiking] = useState(false);
  const [showLoveEffect, setShowLoveEffect] = useState(false);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1247);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load actual like count from localStorage
    const savedLikes = localStorage.getItem('gardenGrainsLikes');
    const liked = localStorage.getItem('gardenGrainsLiked');
    if (savedLikes) setLikeCount(parseInt(savedLikes));
    if (liked === 'true') setUserHasLiked(true);
  }, []);

  const handleLikeClick = async () => {
    if (isLiking) return;
    
    if (!userHasLiked) {
      // First time liking - increment count
      setIsLiking(true);
      setShowLoveEffect(true);
      const newCount = likeCount + 1;
      setLikeCount(newCount);
      setUserHasLiked(true);
      localStorage.setItem('gardenGrainsLiked', 'true');
      localStorage.setItem('gardenGrainsLikes', newCount.toString());
      
      setTimeout(() => { 
        setShowLoveEffect(false); 
        setIsLiking(false); 
      }, 1000);
      
      // After liking, show review modal
      setTimeout(() => {
        setShowReviewModal(true);
      }, 500);
    } else {
      // Already liked - just open review modal
      setShowReviewModal(true);
    }
  };

  const handleSubmitReview = async (review: any) => {
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      alert('Thank you for sharing your Constantia moment! 🌹✨');
    } catch (error) {
      console.error('Error:', error);
      alert('Thank you for your feedback!');
    }
  };

  // Animated counter component
  function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 0;
      const end = value;
      const incrementTime = Math.max(30, duration / end);
      const timer = setInterval(() => { start += 1; setCount(start); if (start >= end) clearInterval(timer); }, incrementTime);
      return () => clearInterval(timer);
    }, [value, duration]);
    return <>{count.toLocaleString()}</>;
  }

  return (
    <>
      <button onClick={handleLikeClick} disabled={isLiking} className="group relative w-full">
        {showLoveEffect && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 1 }} className="text-4xl">❤️</motion.div>
          </div>
        )}
        <div className={`flex items-center gap-3 backdrop-blur-sm p-3 rounded-2xl transition-all duration-300 border w-full ${userHasLiked ? 'bg-[#ff6b6b]/30 border-[#ff6b6b]/50' : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 cursor-pointer'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${userHasLiked ? 'bg-gradient-to-br from-[#ff6b6b]/40 to-[#ff6b6b]/60' : 'bg-gradient-to-br from-[#ff6b6b]/20 to-[#ff6b6b]/40'}`}>
            {isLiking ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-xl">❤️</motion.div> : userHasLiked ? <div className="text-xl animate-pulse">❤️</div> : <FaHeart className="text-[#ff6b6b] text-lg group-hover:scale-110 transition-transform" />}
          </div>
          <div className="flex-1 text-left">
            <div className="text-2xl font-bold text-white"><AnimatedCounter value={likeCount} duration={800} key={likeCount} /></div>
            <div className="text-white/70 text-xs">{userHasLiked ? 'Share your experience!' : 'Happy Customers'}</div>
          </div>
          <div className="hidden sm:block text-white/50"><FaArrowRight className="transform group-hover:translate-x-1 transition-transform" /></div>
        </div>
      </button>
      <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} onSubmit={handleSubmitReview} />
    </>
  );
}

// Updated New Client Promo Button - Now links to signup with promo
export function UpdatedNewClientPromoButton() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  const handleClick = () => {
    setIsChecking(true);
    const hasUsedPromo = localStorage.getItem('gardenGrainsPromoUsed') === 'true';
    
    if (!hasUsedPromo) {
      setShowPromoModal(true);
    } else {
      router.push('/signup');
    }
    setIsChecking(false);
  };

  const acceptPromo = () => {
    localStorage.setItem('gardenGrainsPromoIntent', 'true');
    router.push('/signup?promo=WELCOME20');
    setShowPromoModal(false);
  };

  const declinePromo = () => {
    router.push('/signup');
    setShowPromoModal(false);
  };

  return (
    <>
      <button onClick={handleClick} disabled={isChecking} className="group relative w-full">
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff9800] backdrop-blur-sm p-3 rounded-2xl hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 w-full">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            {isChecking ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><FaGift className="text-white text-xl" /></motion.div> : <FaGift className="text-white text-xl group-hover:scale-110 transition-transform" />}
          </div>
          <div className="flex-1 text-left">
            <div className="text-xl font-bold text-white flex items-center gap-1"><span>20% OFF</span><span className="text-xs bg-white/30 px-2 py-1 rounded-full">First Order</span></div>
            <div className="text-white/90 text-xs font-medium">New customers only</div>
          </div>
          <div className="hidden sm:block text-white"><FaArrowRight className="transform group-hover:translate-x-1 transition-transform" /></div>
        </div>
      </button>

      {showPromoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPromoModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#ff6b6b] to-[#ff9800] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <FaGift className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Garden & Grains! 🌹</h3>
              <p className="text-gray-600 mb-4">Get 20% off your first order as a welcome gift!</p>
              <div className="bg-green-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-green-800">Promo Code: <strong className="font-mono text-lg">WELCOME20</strong></p>
              </div>
              <div className="flex gap-3">
                <button onClick={acceptPromo} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold">Claim 20% OFF</button>
                <button onClick={declinePromo} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">Maybe Later</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
