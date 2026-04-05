"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaUtensils, 
  FaTruck, 
  FaClock, 
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaStore,
  FaCreditCard,
  FaLeaf,
  FaUsers,
  FaGift,
  FaMobileAlt
} from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon?: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    question: "What are your operating hours?",
    answer: "Sunday - Wednesday: 9:00 AM - 5:30 PM\nThursday - Saturday: 9:00 AM - 9:00 PM\nWe are closed daily from 4:00 PM - 5:00 PM for dinner prep.",
    category: "General",
    icon: <FaClock className="text-[#94aa4d]" />
  },
  {
    question: "Where are you located?",
    answer: "We are located at Uitsig Wine Farm, Spaanschemat River Rd, Fir Grove, Cape Town, 7806.",
    category: "General",
    icon: <FaMapMarkerAlt className="text-[#94aa4d]" />
  },
  {
    question: "Do you offer delivery?",
    answer: "Yes! We offer delivery within Cape Town. Delivery fee is calculated based on distance (R35 for first 5km, R5 per additional km). Free delivery on orders over R850.",
    category: "Delivery",
    icon: <FaTruck className="text-[#94aa4d]" />
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery typically takes 30-45 minutes, depending on your location and current order volume.",
    category: "Delivery",
    icon: <FaClock className="text-[#94aa4d]" />
  },
  {
    question: "Can I pick up my order?",
    answer: "Absolutely! You can place an order for pickup at our Uitsig Wine Farm location. Your order will be ready for collection at the specified time.",
    category: "Pickup",
    icon: <FaStore className="text-[#94aa4d]" />
  },
  {
    question: "Do you cater for events?",
    answer: "Yes! We offer full catering services for corporate events, weddings, and private parties. Please visit our catering page or contact us directly for a custom quote.",
    category: "Catering",
    icon: <FaUsers className="text-[#94aa4d]" />
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Credit/Debit cards, VodaPay, and Instant EFT payments. No cash payments for online orders. Please note: For EFT payments, food will only be prepared and handed over once the payment reflects in our account. Please allow time for payment processing.",
    category: "Payments",
    icon: <FaCreditCard className="text-[#94aa4d]" />
  },
  {
    question: "How does Instant EFT work?",
    answer: "When you select Instant EFT at checkout, you'll be redirected to our secure payment gateway where you can complete the payment using your online banking credentials. The payment is processed instantly, and we receive confirmation immediately. Your order will be prepared once payment is confirmed.",
    category: "Payments",
    icon: <FaMobileAlt className="text-[#94aa4d]" />
  },
  {
    question: "What happens if my EFT payment doesn't reflect immediately?",
    answer: "For EFT payments, we require the payment to be reflected in our account before we prepare or hand over any food. We do not offer 'pay later' options. Please ensure you complete the payment process and wait for confirmation before expecting your order to be prepared.",
    category: "Payments",
    icon: <FaClock className="text-[#94aa4d]" />
  },
  {
    question: "Are your ingredients organic?",
    answer: "Yes! We pride ourselves on using 100% organic, locally sourced ingredients whenever possible. We partner with local farms to ensure the freshest produce.",
    category: "Food",
    icon: <FaLeaf className="text-[#94aa4d]" />
  },
  {
    question: "Do you offer vegetarian/vegan options?",
    answer: "Yes, we have a wide variety of vegetarian and vegan options clearly marked on our menu. Many dishes can also be customized to suit dietary preferences.",
    category: "Food",
    icon: <FaLeaf className="text-[#94aa4d]" />
  },
  {
    question: "Can I schedule an order in advance?",
    answer: "Yes! You can schedule orders for future delivery or pickup during checkout. Select your preferred date and time.",
    category: "Orders",
    icon: <FaClock className="text-[#94aa4d]" />
  },
  {
    question: "Do you have gift cards?",
    answer: "Yes, we offer gift cards in various denominations. They make perfect gifts for friends and family! Contact us or ask at the restaurant.",
    category: "Gifts",
    icon: <FaGift className="text-[#94aa4d]" />
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach us via phone at (069) 376-5574, WhatsApp at +27 69 376 5574, or email at hello@gardengrains.co.za. We're here to help!",
    category: "Contact",
    icon: <FaPhone className="text-[#94aa4d]" />
  }
];

// Get unique categories
const categories = [...new Set(faqs.map(faq => faq.category))];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = activeCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1e4259] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about Garden & Grains
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === "All"
                ? "bg-[#94aa4d] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Questions
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-[#94aa4d] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Important Payment Notice */}
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Important Payment Information:</strong> For EFT payments, 
            orders will only be prepared once payment reflects in our account. 
            No food will be handed over for unconfirmed payments. Please use 
            Instant EFT or card payments for immediate processing.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => {
            const originalIndex = faqs.findIndex(f => f.question === faq.question);
            const isOpen = openIndex === originalIndex;
            
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFAQ(originalIndex)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {faq.icon}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                    <p className="text-gray-600 whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Section */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#1e4259] to-[#2c536b] rounded-2xl text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-white/80 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="tel:+27693765574"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg py-3 px-4 transition"
            >
              <FaPhone className="text-white" />
              <span>Call Us</span>
            </a>
            <a
              href="https://wa.me/27693765574"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg py-3 px-4 transition"
            >
              <FaWhatsapp className="text-white" />
              <span>WhatsApp</span>
            </a>
            <a
              href="mailto:hello@gardengrains.co.za"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg py-3 px-4 transition"
            >
              <FaEnvelope className="text-white" />
              <span>Email Us</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need immediate assistance?{" "}
            <Link href="/contact" className="text-[#94aa4d] hover:underline font-medium">
              Visit our Contact Page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
