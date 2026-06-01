'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { promoService } from '@/services/promoService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGift, FaTimes, FaChevronRight, FaCheckCircle, FaSpinner, FaUserPlus, FaEnvelope } from 'react-icons/fa';

export default function FloatingPromoButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [eligibility, setEligibility] = useState<{ eligible: boolean; reason?: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkEligibility = async () => {
      setIsChecking(true);
      const deviceFingerprint = promoService.generateDeviceFingerprint();
      const userEmail = user?.email || '';
      const eligibilityResult = await promoService.isEligible(user?.uid || null, userEmail, deviceFingerprint);
      setEligibility(eligibilityResult);
      setIsChecking(false);
      
      if (eligibilityResult.eligible) {
        const timer = setTimeout(() => setIsMinimized(true), 3000);
        return () => clearTimeout(timer);
      }
    };
    
    checkEligibility();
  }, [user]);

  const handleOpenModal = () => {
    setShowModal(true);
    setIsOpen(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmail('');
    setPhoneNumber('');
  };

  const handleClaimPromo = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsClaiming(true);
    const deviceFingerprint = promoService.generateDeviceFingerprint();
    
    const result = await promoService.claimPromo(
      user?.uid || null,
      email,
      deviceFingerprint,
      phoneNumber || undefined
    );

    if (result.success) {
      setDiscountCode(result.discountCode);
      setClaimed(true);
      setShowSuccess(true);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('gardenGrainsPromoApplied', 'true');
        localStorage.setItem('gardenGrainsPromoCode', result.discountCode);
        localStorage.setItem('gardenGrainsPromoPercent', '20');
      }
      
      setTimeout(() => {
        setShowModal(false);
        setClaimed(false);
        setShowSuccess(false);
        
        if (confirm('🎉 20% discount applied! Would you like to browse our menu now?')) {
          router.push('/menu');
        }
      }, 3000);
    } else {
      alert(result.message);
      setIsClaiming(false);
    }
  };

  const handleSignupRedirect = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('promoIntent', 'true');
    }
    router.push('/signup?promo=WELCOME20');
    setShowModal(false);
  };

  if (!mounted) return null;
  if (eligibility && !eligibility.eligible) return null;
  
  const alreadyClaimed = typeof window !== 'undefined' && localStorage.getItem('gardenGrainsPromo_claimed') === 'true';
  if (alreadyClaimed) return null;

  return (
    <>
      <AnimatePresence>
        {isMinimized && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleOpenModal}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-full shadow-2xl z-50 flex items-center gap-2 px-5 py-3 group"
          >
            <div className="relative">
              <FaGift className="text-xl group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
            </div>
            <span className="font-bold">20% OFF</span>
            <span className="text-xs opacity-90">First Order</span>
            <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
        
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {showSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-4xl text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Success!</h3>
                  <p className="text-gray-600 mb-4">20% discount applied to your first order!</p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-4">
                    <p className="text-sm text-gray-600 mb-1">Your promo code:</p>
                    <p className="text-2xl font-mono font-bold text-green-700 tracking-wider">{discountCode}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                    <motion.div 
                      initial={{ width: '100%' }}
                      animate={{ width: 0 }}
                      transition={{ duration: 3 }}
                      className="h-full bg-green-600"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 p-6 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaGift className="text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold">Welcome Offer! 🎁</h2>
                    <p className="text-white/90 mt-1">Get 20% off your first order</p>
                  </div>
                  
                  <div className="p-6">
                    {!user ? (
                      <div className="text-center">
                        <div className="bg-amber-50 p-4 rounded-xl mb-6">
                          <p className="text-amber-800 text-sm">
                            Sign up to claim your 20% welcome discount!
                          </p>
                        </div>
                        <button
                          onClick={handleSignupRedirect}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition font-semibold flex items-center justify-center gap-2"
                        >
                          <FaUserPlus />
                          Sign Up & Claim Discount
                        </button>
                        <p className="text-xs text-gray-500 mt-4">
                          Already have an account? <button onClick={() => router.push('/login')} className="text-green-600 hover:underline">Login</button>
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-green-50 p-4 rounded-xl mb-6">
                          <p className="text-green-800 text-sm">
                            Enter your details to claim your 20% welcome discount!
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="+27 XX XXX XXXX"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          
                          <button
                            onClick={handleClaimPromo}
                            disabled={isClaiming || !email}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isClaiming ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                Claiming...
                              </>
                            ) : (
                              <>
                                <FaGift />
                                Claim 20% Discount
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="px-6 pb-6 text-center">
                    <p className="text-xs text-gray-400">
                      Limited time offer. One per customer. Valid for first order only.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
