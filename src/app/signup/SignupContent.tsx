'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGift, FaArrowRight } from 'react-icons/fa';
import { promoService } from '@/services/promoService';

export default function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoCode = searchParams.get('promo');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPromoMessage, setShowPromoMessage] = useState(!!promoCode);
  const [deviceFingerprint, setDeviceFingerprint] = useState('');

  useEffect(() => {
    // Generate device fingerprint
    setDeviceFingerprint(promoService.generateDeviceFingerprint());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if user already exists
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      } catch (authError: any) {
        if (authError.code === 'auth/email-already-in-use') {
          setError('Account already exists. Please login to claim your promo.');
          setTimeout(() => {
            router.push(`/login?email=${encodeURIComponent(formData.email)}&promo=${promoCode || 'WELCOME20'}`);
          }, 2000);
          return;
        }
        throw authError;
      }
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone || '',
        createdAt: serverTimestamp(),
        role: 'customer',
        promoApplied: false
      });
      
      // Claim promo code if present
      if (promoCode || true) {
        const promoResult = await promoService.claimPromo(
          userCredential.user.uid,
          formData.email.toLowerCase(),
          deviceFingerprint,
          formData.phone
        );
        
        if (promoResult.success) {
          localStorage.setItem('gardenGrainsPromoApplied', 'true');
          localStorage.setItem('gardenGrainsPromoCode', promoResult.discountCode);
          localStorage.setItem('gardenGrainsPromoPercent', '20');
          setShowPromoMessage(true);
        }
      }
      
      // Redirect to menu or home
      setTimeout(() => {
        router.push('/menu?promo=applied');
      }, 1500);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-md">
        {showPromoMessage && (
          <div className="mb-6 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-xl p-4 text-center animate-pulse">
            <FaGift className="inline-block mr-2" />
            <span className="font-semibold">20% OFF Welcome Bonus!</span>
            <p className="text-sm mt-1 opacity-90">Complete signup to claim your discount</p>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-green-100 mt-1">Join Garden & Grains today</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+27 XX XXX XXXX"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : (
                <>
                  Sign Up
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>
          
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-6">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
