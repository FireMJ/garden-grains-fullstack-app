"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  FaPhone, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaInstagram, 
  FaFacebook, 
  FaTiktok, 
  FaTwitter,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "email"
  });

  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to Firestore
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: "new",
        source: "website"
      });

      setFormStatus({
        submitted: true,
        success: true,
        message: "Thank you for reaching out! We'll get back to you within 24 hours."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredContact: "email"
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);

    } catch (error) {
      console.error("Error submitting contact form:", error);
      setFormStatus({
        submitted: true,
        success: false,
        message: "There was an error sending your message. Please try again or contact us directly."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[300px] bg-gradient-to-r from-[#1e4259] to-[#2c536b] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-[#94aa4d] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#ff9800] rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl mx-auto px-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Get in <span className="text-[#94aa4d]">Touch</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-white/80 max-w-2xl mx-auto"
            >
              We'd love to hear from you. Whether you have a question about our menu, 
              want to book an event, or just want to say hello.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20">
            {/* Phone Card */}
            <motion.a
              href="tel:+27693765574"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-14 h-14 bg-[#1e4259] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaPhone className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm mb-3">Speak directly with our team</p>
              <p className="text-[#94aa4d] font-semibold">(069) 376-5574</p>
            </motion.a>

            {/* WhatsApp Card */}
            <motion.a
              href="https://wa.me/27693765574"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-14 h-14 bg-[#25D366] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaWhatsapp className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600 text-sm mb-3">Quick responses via WhatsApp</p>
              <p className="text-[#25D366] font-semibold">+27 69 376 5574</p>
            </motion.a>

            {/* Email Card */}
            <motion.a
              href="mailto:info@gardengrains.co.za"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-14 h-14 bg-[#94aa4d] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm mb-3">Send us an email anytime</p>
              <p className="text-[#94aa4d] font-semibold">hello@gardengrains.co.za</p>
            </motion.a>

            {/* Location Card */}
            <motion.a
              href="https://maps.google.com/?q=Uitsig+Wine+Farm+Spaanschemat+River+Rd+Fir+Grove+Cape+Town"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-14 h-14 bg-[#ff9800] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FaMapMarkerAlt className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 text-sm mb-3">Uitsig Wine Farm, Cape Town</p>
              <p className="text-[#ff9800] font-semibold">Get Directions →</p>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-[#1e4259] mb-6">Send Us a Message</h2>
              
              {formStatus.submitted && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                  formStatus.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {formStatus.success ? (
                    <FaCheckCircle className="flex-shrink-0" size={20} />
                  ) : (
                    <FaExclamationCircle className="flex-shrink-0" size={20} />
                  )}
                  <p>{formStatus.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#94aa4d] focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#94aa4d] focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#94aa4d] focus:border-transparent transition"
                      placeholder="+27 69 376 5574"
                    />
                  </div>
                  <div>
                    <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredContact"
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#94aa4d] focus:border-transparent transition"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#94aa4d] focus:border-transparent transition"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#94aa4d] focus:border-transparent transition resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#94aa4d] to-[#6c8665] text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By submitting this form, you agree to our privacy policy. We'll respond within 24 hours.
                </p>
              </form>
            </motion.div>

            {/* Location & Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.0!2d18.416478!3d-34.031758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc676b7c8f8b8f%3A0x8f8b8f8b8f8b8f8b!2sUitsig%20Wine%20Farm!5e0!3m2!1sen!2sza!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Garden & Grains at Uitsig Wine Farm"
                  className="w-full h-full"
                />
              </div>

              {/* Address Details */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-[#1e4259] mb-4">Visit Our Farm Restaurant</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-[#94aa4d] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Uitsig Wine Farm</p>
                      <p className="text-gray-600">Spaanschemat River Rd</p>
                      <p className="text-gray-600">Fir Grove, Cape Town, 7806</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaClock className="text-[#94aa4d] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Opening Hours</p>
                      <p className="text-gray-600"><span className="font-medium">Sunday - Wednesday:</span> 9:00 AM - 5:30 PM</p>
                      <p className="text-gray-600"><span className="font-medium">Thursday - Saturday:</span> 9:00 AM - 9:00 PM</p>
                      <p className="text-sm text-gray-500 mt-1">Closed daily 4:00 PM - 5:00 PM for dinner prep</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-[#94aa4d] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a href="mailto:info@gardengrains.co.za" className="text-gray-600 hover:text-[#94aa4d] transition">
                        hello@gardengrains.co.za
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaPhone className="text-[#94aa4d] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <a href="tel:+27693765574" className="text-gray-600 hover:text-[#94aa4d] transition">
                        (069) 376-5574
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaWhatsapp className="text-[#94aa4d] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">WhatsApp</p>
                      <a 
                        href="https://wa.me/27693765574" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#94aa4d] transition"
                      >
                        +27 69 376 5574
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Follow Us</h4>
                  <div className="flex gap-4">
                    <a 
                      href="https://instagram.com/gardenandgrains" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <FaInstagram size={20} />
                    </a>
                    <a 
                      href="https://facebook.com/gardenandgrains" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <FaFacebook size={20} />
                    </a>
                    <a 
                      href="https://tiktok.com/@gardenandgrains" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <FaTiktok size={20} />
                    </a>
                    <a 
                      href="https://twitter.com/gardenandgrains" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <FaTwitter size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1e4259] mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "What are your delivery hours?",
                a: "We deliver during our operating hours: Sunday-Wednesday 9am-5:30pm, Thursday-Saturday 9am-9pm. Delivery times may vary based on distance and order volume."
              },
              {
                q: "Do you cater for events?",
                a: "Yes! We offer full catering services for corporate events, weddings, and private parties. Please visit our catering page or contact us directly for a custom quote."
              },
              {
                q: "Is there parking available?",
                a: "Yes, we have ample parking available on the farm, with just an entry fee of R30 if you stay for over 30 minutes. Follow the signs to the restaurant area."
              },
              {
                q: "Can I place a large order for pickup?",
                a: "Absolutely! For large orders (25+ people), we recommend ordering at least 24 hours in advance to ensure availability."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
              >
                <h3 className="font-bold text-[#1e4259] mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Still have questions? <Link href="/faq" className="text-[#94aa4d] font-semibold hover:underline">Visit our FAQ page</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
