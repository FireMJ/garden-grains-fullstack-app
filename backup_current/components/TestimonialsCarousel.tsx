// components/TestimonialsCarousel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  image: string; // This should be a Firebase Storage URL or valid path
  rating: number;
}

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for testimonials
    const unsubscribe = onSnapshot(
      collection(db, 'testimonials'),
      (snapshot) => {
        const testimonialData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Testimonial[];
        
        setTestimonials(testimonialData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching testimonials:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-white">Loading testimonials...</div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-white">No testimonials yet.</div>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-6 py-4 px-2">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-lg p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-300">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.src = '/images/placeholder-avatar.jpg';
                }}
              />
            </div>
            <div>
              <h4 className="font-semibold text-white">{testimonial.name}</h4>
              <div className="flex text-yellow-400">
                {'★'.repeat(testimonial.rating)}
                {'☆'.repeat(5 - testimonial.rating)}
              </div>
            </div>
          </div>
          <p className="text-white/80 text-sm">&ldquo;{testimonial.text}&rdquo;</p>
        </div>
      ))}
    </div>
  );
}