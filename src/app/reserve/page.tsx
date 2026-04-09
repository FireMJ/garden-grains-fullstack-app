"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaUsers, FaPhone, FaEnvelope, FaUser, FaUtensils } from "react-icons/fa";

export default function ReservePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    occasion: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically save to Firebase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        router.push('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('There was an error processing your reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 20; hour++) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    if (hour !== 16) { // Skip 4:00 PM - 5:00 PM dinner prep
      timeSlots.push(`${displayHour}:00 ${ampm}`);
      if (hour !== 20) {
        timeSlots.push(`${displayHour}:30 ${ampm}`);
      }
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservation Request Sent!</h1>
            <p className="text-gray-600 mb-4">
              Thank you for choosing Garden & Grains. We'll confirm your reservation shortly.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Reservation Details:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>📅 Date: {formData.date}</li>
                <li>⏰ Time: {formData.time}</li>
                <li>👥 Guests: {formData.guests}</li>
              </ul>
            </div>
            <p className="text-sm text-gray-500">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back to Menu Link */}
        <Link 
          href="/menu" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition mb-6 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Menu</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2F5D50] mb-4">Reserve a Table</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience farm-to-table dining at Uitsig Wine Farm. Reserve your table for an unforgettable meal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reservation Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
              {/* Personal Information */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-green-600" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+27 XX XXX XXXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-green-600" />
                  Reservation Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests *</label>
                    <input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="20"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occasion (Optional)</label>
                    <select
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select occasion</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="business">Business Dinner</option>
                      <option value="romantic">Romantic Dinner</option>
                      <option value="family">Family Gathering</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUtensils className="text-green-600" />
                  Special Requests
                </h2>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Any dietary requirements, seating preferences, or special requests?"
                />
              </div>

              {/* Important Notes */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notes</h3>
                <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-4">
                  <li>Reservations are held for 15 minutes past the reservation time</li>
                  <li>A 10% service charge applies to tables of 6 or more guests</li>
                  <li>Dinner prep break: 4:00 PM - 5:00 PM daily</li>
                  <li>Please inform us of any allergies before ordering</li>
                </ul>
              </div>

              {/* Operating Hours */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Operating Hours</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <p className="font-medium">Sunday - Wednesday</p>
                    <p>09:00 AM - 17:30 PM</p>
                  </div>
                  <div>
                    <p className="font-medium">Thursday - Saturday</p>
                    <p>09:00 AM - 21:00 PM</p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">Closed daily 4:00 PM - 5:00 PM for dinner prep</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Request Reservation'}
              </button>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                  <a href="tel:+27693765574" className="text-green-600 hover:underline">
                    (069) 376-5574
                  </a>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                  <a href="https://wa.me/27693765574" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                    +27 69 376 5574
                  </a>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <a href="mailto:hello@gardengrains.co.za" className="text-green-600 hover:underline">
                    hello@gardengrains.co.za
                  </a>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-sm text-gray-600">
                    Uitsig Wine Farm<br />
                    Spaanschemat River Rd<br />
                    Fir Grove, Cape Town, 7806
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-2">Service Charge Notice</h3>
                <p className="text-sm text-gray-600">
                  A 10% service charge is automatically added to tables of 6 guests or more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
