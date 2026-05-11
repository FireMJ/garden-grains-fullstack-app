'use client';

import { useState, useEffect } from 'react';
import { discountService } from '@/services/discountService';
import { FaGift, FaTimes } from 'react-icons/fa';

interface NewUserDiscountProps {
  onApply?: () => void;
}

export default function NewUserDiscount({ onApply }: NewUserDiscountProps) {
  const [showModal, setShowModal] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check local storage for discount claim status
    const hasClaimed = localStorage.getItem('newUserDiscountClaimed') === 'true';
    if (hasClaimed) {
      setClaimed(true);
      return;
    }
    
    // Show modal after a short delay
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClaimDiscount = async () => {
    setIsChecking(true);
    try {
      // Claim the discount
      const success = await discountService.claimNewUserDiscount();
      if (success) {
        localStorage.setItem('newUserDiscountClaimed', 'true');
        setClaimed(true);
        setShowModal(false);
        if (onApply) onApply();
        alert('20% discount applied to your order! 🎉');
      } else {
        alert('Discount has already been claimed or is not available.');
      }
    } catch (error) {
      console.error('Error claiming discount:', error);
      alert('Unable to claim discount at this time.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  if (!showModal || claimed) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaGift className="text-white text-2xl" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Welcome to Garden & Grains! 🌹
          </h3>
          
          <p className="text-gray-600 mb-4">
            Get 20% off your first order as a welcome gift!
          </p>
          
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-green-800">
              Promo Code: <strong className="font-mono">WELCOME20</strong>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Valid for first-time customers only
            </p>
          </div>
          
          <button
            onClick={handleClaimDiscount}
            disabled={isChecking}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
          >
            {isChecking ? 'Applying...' : 'Claim 20% OFF'}
          </button>
          
          <p className="text-xs text-gray-500 mt-3">
            No thanks, I'll pass
          </p>
        </div>
      </div>
    </div>
  );
}
