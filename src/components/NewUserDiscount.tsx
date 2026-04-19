'use client';

import { useState, useEffect } from 'react';
import { discountService } from '@/services/discountService';
import { FaGift, FaCopy, FaCheck } from 'react-icons/fa';

export default function NewUserDiscount() {
  const [discount, setDiscount] = useState<any>(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [copied, setCopied] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    // Check if user has already claimed discount
    if (discountService.hasNewUserClaimedDiscount()) {
      setClaimed(true);
      return;
    }
    
    const newUserDiscount = discountService.getNewUserDiscount();
    if (newUserDiscount) {
      setDiscount(newUserDiscount);
      setShowDiscount(true);
    }
  }, []);

  const handleCopyCode = () => {
    if (discount?.code) {
      navigator.clipboard.writeText(discount.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClaimDiscount = () => {
    discountService.markNewUserDiscountClaimed();
    setClaimed(true);
    setShowDiscount(false);
    alert('20% discount code saved! Use it at checkout.');
  };

  if (!showDiscount || claimed) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-xl p-4 text-white max-w-sm">
        <div className="flex items-start gap-3">
          <div className="bg-white rounded-full p-2">
            <FaGift className="text-green-600 w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Welcome! 20% OFF</h3>
            <p className="text-sm text-green-100 mt-1">Get 20% off your first order</p>
            <div className="mt-3 flex items-center gap-2">
              <code className="bg-white/20 px-3 py-1 rounded text-sm font-mono">
                {discount?.code}
              </code>
              <button
                onClick={handleCopyCode}
                className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition"
              >
                {copied ? <FaCheck className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleClaimDiscount}
              className="mt-3 w-full bg-white text-green-600 py-1 rounded hover:bg-green-50 transition text-sm font-medium"
            >
              Claim Discount
            </button>
          </div>
          <button
            onClick={() => setShowDiscount(false)}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
