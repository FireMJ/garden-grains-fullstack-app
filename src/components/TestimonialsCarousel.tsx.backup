"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// 🌿 Sample testimonials — you can replace these with real data or pull from your DB later
const testimonials = [
  {
    name: "Aisha M.",
    text: "Absolutely love the Protein Pack Salad! Fresh ingredients, generous portions, and packed with flavor.",
    image: "/images/testimonials/aisha.jpg",
  },
  {
    name: "Liam K.",
    text: "Garden & Grains has become my go-to lunch spot. The wraps are healthy and filling — plus the staff are amazing!",
    image: "/images/testimonials/liam.jpg",
  },
  {
    name: "Tania P.",
    text: "The smoothies are divine! You can really taste the freshness. Love the eco-friendly vibe too.",
    image: "/images/testimonials/tania.jpg",
  },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [paused]);

  const current = testimonials[index];

  return (
    <div
      className="relative bg-[#FAF7F2] text-[#1E4259] rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 max-w-3xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Testimonial content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center space-y-4"
        >
          {/* Profile Image */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-[#F4A261] shadow-md">
            <Image
              src={current.image}
              alt={current.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <p className="text-sm sm:text-base md:text-lg italic text-[#4A665E] max-w-xl">
            “{current.text}”
          </p>

          {/* Name */}
          <h4 className="text-[#6C7B58] font-semibold text-sm sm:text-base md:text-lg">
            — {current.name}
          </h4>
        </motion.div>
      </AnimatePresence>

      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-[#F4A261] scale-125" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Play/Pause toggle (optional small control) */}
      <button
        onClick={() => setPaused((p) => !p)}
        className="absolute top-2 right-2 text-xs text-[#6C7B58] bg-[#F4A261]/10 hover:bg-[#F4A261]/20 rounded-full px-2 py-1"
      >
        {paused ? "▶" : "⏸"}
      </button>
    </div>
  );
}
