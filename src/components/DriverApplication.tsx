'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export default function DriverApplication() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    driversLicense: '',
    vehicleType: '',
    experience: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'driverApplications'), {
        ...formData,
        userId: user?.uid || null,
        status: 'pending',
        submittedAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
        adminNotes: ''
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold text-green-800 mb-2">Application Submitted! ✅</h3>
        <p className="text-green-700">Thank you for your interest in joining our delivery team.</p>
        <p className="text-green-600 mt-2">Our admin team will review your application and contact you within 2-3 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          className="mt-1 w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Email *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="mt-1 w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="mt-1 w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Driver's License Number *</label>
        <input
          type="text"
          required
          value={formData.driversLicense}
          onChange={(e) => setFormData({...formData, driversLicense: e.target.value})}
          className="mt-1 w-full px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Vehicle Type *</label>
        <select
          required
          value={formData.vehicleType}
          onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
          className="mt-1 w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Select vehicle type</option>
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="scooter">Scooter</option>
          <option value="bicycle">Bicycle</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Delivery Experience</label>
        <textarea
          value={formData.experience}
          onChange={(e) => setFormData({...formData, experience: e.target.value})}
          rows={3}
          className="mt-1 w-full px-4 py-2 border rounded-lg"
          placeholder="Tell us about any previous delivery experience..."
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
}
