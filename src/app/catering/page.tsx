"use client";

import Link from "next/link";
import Image from "next/image";
import PageWrapper from "@/components/layout/PageWrapper";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const eventTypes = [
  {
    title: "Board Meetings",
    description:
      "Keep your team energized with light, wholesome meals designed for focus and productivity. Perfect for morning or afternoon sessions.",
    image: "/images/catering/board-meeting.jpg",
    meals: ["Protein-packed salads", "Mini wraps & sandwiches", "Fresh fruit platters", "Assorted juices & smoothies"],
  },
  {
    title: "Private Events",
    description:
      "Celebrate milestones with healthy yet indulgent options that delight your guests without compromising wellness.",
    image: "/images/catering/private-event.jpg",
    meals: ["Signature salads", "Grilled wraps & bowls", "Mini toasties & finger foods", "Cold-pressed juices"],
  },
  {
    title: "Conferences",
    description:
      "Fuel your attendees with nutritious meals that keep energy levels high throughout long sessions. Options for all dietary needs.",
    image: "/images/catering/conference.jpg",
    meals: ["Hearty bowls & stir-fries", "Assorted sandwiches & wraps", "Snack boxes with fruits & nuts", "Smoothies & fresh juices"],
  },
];

const mealCourses = [
  {
    title: "Starters / Light Bites",
    description: "Delicate and wholesome starters to kick off your event. Fresh, colorful, and nutritious.",
    examples: ["Mini avocado toast", "Hummus & veggie cups", "Fruit skewers", "Mini salad jars"],
  },
  {
    title: "Main Courses",
    description: "Hearty and balanced options to satisfy diverse palates.",
    examples: ["Grilled chicken & quinoa bowls", "Vegan protein stack salads", "Wholegrain wraps & sandwiches", "Warm stir-fry bowls"],
  },
  {
    title: "Desserts / Sweet Treats",
    description: "Indulgent yet healthy desserts that leave a lasting impression.",
    examples: ["Fruit parfaits", "Dark chocolate energy bites", "Oat & nut bars", "Chia pudding cups"],
  },
  {
    title: "Beverages",
    description: "Refreshing drinks to complement your meal and keep everyone hydrated.",
    examples: ["Cold-pressed juices", "Smoothies", "Herbal teas", "Sparkling water with fruit infusions"],
  },
];

function CateringContactForm({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement> }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [copiedField, setCopiedField] = useState<null | "email" | "phone">(null);

  const handleCopy = (value: string, field: "email" | "phone") => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div ref={scrollRef} className="max-w-2xl mx-auto bg-[#FAF7F2] p-8 rounded-lg shadow-lg mt-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="text-2xl font-bold text-[#1E4259] mb-6"
      >
        Contact Us for Catering
      </motion.h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[#1E4259] mb-2 font-medium">Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg text-[#1E4259] focus:ring-2 focus:ring-[#F4A261] outline-none transition"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-[#1E4259] mb-2 font-medium">Email</label>
          <input
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border rounded-lg text-[#1E4259] focus:ring-2 focus:ring-[#F4A261] outline-none transition"
            required
          />
          {formData.email && (
            <button
              type="button"
              onClick={() => handleCopy(formData.email, "email")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-[#1E4259] hover:text-[#F4A261] transition"
            >
              {copiedField === "email" ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        <div className="relative">
          <label className="block text-[#1E4259] mb-2 font-medium">Phone</label>
          <input
            type="tel"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full p-3 border rounded-lg text-[#1E4259] focus:ring-2 focus:ring-[#F4A261] outline-none transition"
            required
          />
          {formData.phone && (
            <button
              type="button"
              onClick={() => handleCopy(formData.phone, "phone")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-[#1E4259] hover:text-[#F4A261] transition"
            >
              {copiedField === "phone" ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#F4A261] hover:bg-[#e68e42] text-white p-3 rounded-lg font-semibold transition transform hover:scale-105"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default function CateringPage() {
  const contactFormRef = useRef<HTMLDivElement>(null);
  const eventTypesRef = useRef<HTMLDivElement>(null);
  const mealCoursesRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState<"event" | "courses" | "contact">("event");

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>, section: "event" | "courses" | "contact") => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(section);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const eventTop = eventTypesRef.current?.getBoundingClientRect().top ?? Infinity;
      const coursesTop = mealCoursesRef.current?.getBoundingClientRect().top ?? Infinity;
      const contactTop = contactFormRef.current?.getBoundingClientRect().top ?? Infinity;

      if (contactTop <= 100) setActiveSection("contact");
      else if (coursesTop <= 100) setActiveSection("courses");
      else setActiveSection("event");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <PageWrapper>
      <main className="min-h-screen w-screen bg-[#FAF7F2] text-[#1E4259] relative overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-[#1E4259] text-white">
          <Image
            src="/images/catering/hero.jpg"
            alt="Catering Hero"
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL="/images/placeholder.jpg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative text-center px-4 sm:px-6 md:px-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg"
            >
              Elevate Your Event with Garden & Grains
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-lg sm:text-xl md:text-2xl drop-shadow-md max-w-3xl mx-auto"
            >
              Premium, wholesome catering designed for board meetings, private events, and conferences.
            </motion.p>
            <button
              onClick={() => scrollToSection(contactFormRef, "contact")}
              className="mt-6 bg-[#F4A261] hover:bg-[#e68e42] text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Book Your Catering
            </button>
          </div>
        </section>

        {/* Navigation Buttons */}
        <div className="sticky top-0 bg-[#FAF7F2] z-40 flex justify-center gap-6 py-4 shadow-md">
          {["event", "courses", "contact"].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section === "event" ? eventTypesRef : section === "courses" ? mealCoursesRef : contactFormRef, section as any)}
              className={`relative font-semibold text-lg ${activeSection === section ? "text-[#F4A261]" : "text-[#1E4259]"} transition`}
            >
              {section === "event" ? "Event Types" : section === "courses" ? "Meal Courses" : "Contact"}
              {activeSection === section && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 w-full h-1 bg-[#F4A261] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Event Types Section */}
        <section ref={eventTypesRef} className="py-12 px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventTypes.map((event, index) => (
            <motion.div
              key={event.title}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="/images/placeholder.jpg"
                />
              </div>
              <div className="p-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-xl sm:text-2xl font-bold mb-2"
                >
                  {event.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.3 + index * 0.2, duration: 0.8 }}
                  className="text-gray-700 mb-4"
                >
                  {event.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Meal Courses Section */}
        <section ref={mealCoursesRef} className="bg-[#1E4259] text-white py-12 px-4 sm:px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8"
          >
            Meal Courses
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mealCourses.map((course, index) => (
              <motion.div
                key={course.title}
                className="bg-[#FAF7F2] text-[#1E4259] rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-xl sm:text-2xl font-semibold mb-2"
                >
                  {course.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ delay: 0.3 + index * 0.2, duration: 0.8 }}
                  className="mb-4"
                >
                  {course.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <CateringContactForm scrollRef={contactFormRef} />

      </main>
    </PageWrapper>
  );
}
