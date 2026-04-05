"use client";

import { useState, FormEvent, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";

// Types
interface CateringPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  serves: string;
  minGuests: number;
  maxGuests: number;
  popular?: boolean;
  features: {
    name: string;
    included: boolean;
  }[];
  image: string;
  cuisineOptions: string[];
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: "perPerson" | "flat";
  category: string;
}

interface EventType {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommendedPackages: string[];
  averageGuests: string;
}

interface CateringFormData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  guests: number;
  package: string;
  cuisinePreferences: string[];
  dietaryRestrictions: string;
  budget: string;
  venueLocation: string;
  serviceType: "full" | "dropoff" | "buffet" | "plated";
  additionalServices: string[];
  message: string;
  referralSource: string;
  heardAboutUs: string;
}

// Data
const eventTypes: EventType[] = [
  {
    id: "corporate",
    name: "Corporate Event",
    description: "Office lunches, meetings, conferences, and company parties",
    icon: "💼",
    recommendedPackages: ["basic", "premium"],
    averageGuests: "25-100"
  },
  {
    id: "wedding",
    name: "Wedding",
    description: "Wedding receptions, bridal showers, and engagement parties",
    icon: "💒",
    recommendedPackages: ["deluxe", "premium"],
    averageGuests: "50-200"
  },
  {
    id: "birthday",
    name: "Birthday Party",
    description: "Birthday celebrations of all ages",
    icon: "🎂",
    recommendedPackages: ["basic", "premium"],
    averageGuests: "15-50"
  },
  {
    id: "private",
    name: "Private Dinner",
    description: "Intimate gatherings, family reunions, anniversaries",
    icon: "🏠",
    recommendedPackages: ["basic", "premium"],
    averageGuests: "10-30"
  },
  {
    id: "holiday",
    name: "Holiday Party",
    description: "Christmas, New Year's, Thanksgiving, and other celebrations",
    icon: "🎄",
    recommendedPackages: ["premium", "deluxe"],
    averageGuests: "20-80"
  },
  {
    id: "fundraiser",
    name: "Fundraiser / Gala",
    description: "Charity events, galas, and non-profit gatherings",
    icon: "🤝",
    recommendedPackages: ["deluxe"],
    averageGuests: "75-300"
  }
];

const cateringPackages: CateringPackage[] = [
  {
    id: "basic",
    name: "Garden Gathering",
    description: "Perfect for small corporate meetings and intimate gatherings",
    price: 185,
    serves: "10-25 guests",
    minGuests: 10,
    maxGuests: 25,
    popular: false,
    features: [
      { name: "3 Main Course Options", included: true },
      { name: "2 Side Dishes", included: true },
      { name: "Fresh Garden Salad", included: true },
      { name: "Assorted Beverages (Soft Drinks)", included: true },
      { name: "Basic Setup & Serveware", included: true },
      { name: "Delivery within 15km", included: true },
      { name: "Serving Staff", included: false },
      { name: "Custom Menu Planning", included: false },
      { name: "Dessert Station", included: false },
      { name: "Premium Beverages", included: false }
    ],
    image: "/images/catering/basic-package.jpg",
    cuisineOptions: ["Mediterranean", "Classic American", "Asian Fusion"]
  },
  {
    id: "premium",
    name: "Harvest Celebration",
    description: "Ideal for weddings, corporate events, and mid-sized parties",
    price: 295,
    serves: "25-75 guests",
    minGuests: 25,
    maxGuests: 75,
    popular: true,
    features: [
      { name: "5 Main Course Options", included: true },
      { name: "4 Side Dishes", included: true },
      { name: "Gourmet Appetizers (4 varieties)", included: true },
      { name: "Artisan Bread & Spreads", included: true },
      { name: "Full Beverage Service (Soft Drinks & Juices)", included: true },
      { name: "Professional Setup & Decor", included: true },
      { name: "2 Serving Staff Included", included: true },
      { name: "Delivery within 30km", included: true },
      { name: "Custom Menu Planning", included: true },
      { name: "Dessert Station", included: false },
      { name: "Bar Service", included: false }
    ],
    image: "/images/catering/premium-package.jpg",
    cuisineOptions: ["Mediterranean", "Classic American", "Asian Fusion", "South African"]
  },
  {
    id: "deluxe",
    name: "Grand Feast",
    description: "Ultimate catering experience for large events and weddings",
    price: 395,
    serves: "75-200 guests",
    minGuests: 75,
    maxGuests: 200,
    popular: false,
    features: [
      { name: "8 Main Course Options", included: true },
      { name: "6 Side Dishes", included: true },
      { name: "Premium Appetizer Station", included: true },
      { name: "Interactive Food Stations", included: true },
      { name: "Full Premium Beverage Package", included: true },
      { name: "Custom Bar Service", included: true },
      { name: "Gourmet Dessert Station", included: true },
      { name: "Professional Event Staff (4+ servers)", included: true },
      { name: "Full Event Coordination", included: true },
      { name: "Custom Menu Design", included: true },
      { name: "Delivery Anywhere in Cape Town", included: true },
      { name: "Premium Tableware & Linens", included: true }
    ],
    image: "/images/catering/deluxe-package.jpg",
    cuisineOptions: ["Mediterranean", "Asian Fusion", "South African", "International Fusion"]
  }
];

const addOns: AddOn[] = [
  { id: "bar", name: "Full Bar Service", description: "Professional bartender + premium alcohol selection", price: 2500, priceType: "flat", category: "beverage" },
  { id: "mocktail", name: "Mocktail Station", description: "3 signature non-alcoholic cocktails", price: 350, priceType: "perPerson", category: "beverage" },
  { id: "dessert", name: "Dessert Table", description: "Assorted mini desserts and cake", price: 180, priceType: "perPerson", category: "food" },
  { id: "cheese", name: "Artisan Cheese Board", description: "Local cheeses, crackers, and fruits", price: 450, priceType: "flat", category: "appetizer" },
  { id: "staff", name: "Additional Server", description: "Extra serving staff (per server)", price: 2500, priceType: "flat", category: "service" },
  { id: "photobooth", name: "Photo Booth", description: "Photo booth with props and prints", price: 3500, priceType: "flat", category: "entertainment" },
  { id: "flowers", name: "Floral Centerpieces", description: "Table floral arrangements", price: 450, priceType: "flat", category: "decor" },
  { id: "linens", name: "Premium Linens", description: "Upgraded tablecloths and napkins", price: 250, priceType: "flat", category: "decor" },
];

const cuisineOptions = [
  "Mediterranean", "Asian Fusion", "Classic American", "South African", 
  "Italian", "Indian", "Mexican", "Middle Eastern", "Japanese", "Vegan/Plant-Based"
];

const dietaryOptions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", 
  "Kosher", "Halal", "Low-Carb", "Diabetic-Friendly"
];

const serviceTypes = [
  { id: "full", name: "Full Service", description: "Setup, serving, cleanup & staff included" },
  { id: "buffet", name: "Buffet Style", description: "Setup included, self-service" },
  { id: "plated", name: "Plated Dinner", description: "Sit-down served dinner" },
  { id: "dropoff", name: "Drop-off", description: "Delivery only, no staff" }
];

const referralSources = [
  "Google Search", "Social Media", "Word of Mouth", "Event Venue", 
  "Previous Client", "Wedding Fair", "Advertisement", "Other"
];

export default function CateringPage() {
  const [formData, setFormData] = useState<CateringFormData>({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    eventDate: "",
    eventTime: "",
    eventType: "",
    guests: 30,
    package: "premium",
    cuisinePreferences: [],
    dietaryRestrictions: "",
    budget: "",
    venueLocation: "",
    serviceType: "full",
    additionalServices: [],
    message: "",
    referralSource: "",
    heardAboutUs: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"packages" | "custom">("packages");
  const [showQuote, setShowQuote] = useState(false);
  const [filteredPackages, setFilteredPackages] = useState(cateringPackages);

  // Filter packages based on guest count
  useEffect(() => {
    if (formData.guests) {
      const filtered = cateringPackages.filter(
        pkg => formData.guests >= pkg.minGuests && formData.guests <= pkg.maxGuests
      );
      setFilteredPackages(filtered.length > 0 ? filtered : cateringPackages);
      
      // Auto-select appropriate package if current selection doesn't fit
      if (filtered.length > 0 && !filtered.some(p => p.id === formData.package)) {
        setFormData(prev => ({ ...prev, package: filtered[0].id }));
      }
    }
  }, [formData.guests]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 0 : value
    }));
  };

  const handleCuisineToggle = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences.includes(cuisine)
        ? prev.cuisinePreferences.filter(c => c !== cuisine)
        : [...prev.cuisinePreferences, cuisine]
    }));
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const calculateTotal = () => {
    const selectedPkg = cateringPackages.find(p => p.id === formData.package);
    if (!selectedPkg) return 0;
    
    let total = selectedPkg.price * formData.guests;
    
    selectedAddOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) {
        total += addOn.priceType === "perPerson" 
          ? addOn.price * formData.guests 
          : addOn.price;
      }
    });
    
    return total;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save catering inquiry to Firestore with enhanced data
      await addDoc(collection(db, "cateringInquiries"), {
        ...formData,
        selectedAddOns,
        totalEstimate: calculateTotal(),
        submittedAt: serverTimestamp(),
        status: "pending",
        source: "website"
      });

      setSubmitted(true);
      
      // Optional: Send email notification (would need backend API)
      // await fetch('/api/catering-notification', { method: 'POST', body: JSON.stringify(formData) });
      
    } catch (error: unknown) {
      console.error("Error submitting catering inquiry:", error);
      alert("There was an error submitting your inquiry. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPackage = cateringPackages.find(pkg => pkg.id === formData.package);
  const totalEstimate = calculateTotal();

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your catering inquiry has been received. Our catering specialist will contact you within <strong>24 hours</strong> to discuss your event details and create a custom proposal.
            </p>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center">📞 We'll call to confirm your event details</li>
                <li className="flex items-center">🍽️ We'll discuss menu customization options</li>
                <li className="flex items-center">📄 We'll send a detailed proposal within 48 hours</li>
                <li className="flex items-center">✍️ Finalize and book your date</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Submit Another Inquiry
              </button>
              <Link
                href="/menu"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Browse Our Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative bg-[#1E4259] text-white py-20">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F4A261] rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#94aa4d] rounded-full"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Exceptional Catering for <span className="text-[#F4A261]">Every Occasion</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              From intimate gatherings to grand celebrations, let Garden & Grains bring 
              fresh, healthy, and delicious food to your next event.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#F4A261] text-white px-8 py-3 rounded-lg hover:bg-[#e68e42] transition font-medium"
              >
                View Packages
              </button>
              <button
                onClick={() => document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg hover:bg-white/30 transition font-medium border border-white/50"
              >
                Get a Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Perfect for Any Event</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            No matter the occasion, we have catering solutions tailored to your needs
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {eventTypes.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  setFormData(prev => ({ ...prev, eventType: event.id }));
                  document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`text-center p-4 rounded-xl cursor-pointer transition-all ${
                  formData.eventType === event.id
                    ? 'bg-green-100 ring-2 ring-green-500'
                    : 'bg-gray-50 hover:bg-green-50'
                }`}
              >
                <div className="text-3xl mb-2">{event.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{event.name}</h3>
                <p className="text-xs text-gray-500">{event.averageGuests} guests</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <div id="packages" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Catering Packages</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose from our carefully crafted packages, or let us create a custom menu for your event
          </p>

          {/* Guest Count Filter */}
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <input
              type="range"
              min="10"
              max="300"
              value={formData.guests}
              onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{formData.guests} guests</span>
              {filteredPackages.length > 0 && (
                <span className="text-green-600">
                  {filteredPackages.length} package{filteredPackages.length > 1 ? 's' : ''} available
                </span>
              )}
            </div>
          </div>

          {/* Package Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cateringPackages.map((pkg) => {
              const isAvailable = formData.guests >= pkg.minGuests && formData.guests <= pkg.maxGuests;
              
              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                    !isAvailable ? 'opacity-60' : ''
                  } ${
                    formData.package === pkg.id ? 'ring-4 ring-green-500 scale-105' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="bg-[#F4A261] text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="relative h-48 w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <span className="text-white text-4xl">🍽️</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-green-600">R {pkg.price}</span>
                      <span className="text-gray-500 text-sm"> /person</span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">Recommended for {pkg.serves}</p>
                    
                    <div className="space-y-2 mb-6">
                      {pkg.features.slice(0, 5).map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <svg className={`w-5 h-5 mr-2 flex-shrink-0 ${
                            feature.included ? 'text-green-500' : 'text-gray-300'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {feature.included ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                          </svg>
                          <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, package: pkg.id }))}
                      disabled={!isAvailable}
                      className={`w-full py-3 rounded-lg transition font-medium ${
                        formData.package === pkg.id
                          ? 'bg-green-600 text-white'
                          : isAvailable
                            ? 'bg-gray-100 text-gray-700 hover:bg-green-600 hover:text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {formData.package === pkg.id ? 'Selected' : 'Select Package'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div id="inquiry" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Request a Quote</h2>
          <p className="text-center text-gray-600 mb-12">
            Tell us about your event and we'll create a custom catering proposal
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">1</span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Optional"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="your.email@example.com"
                  />
                </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">2</span>
                Event Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Time *
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(event => (
                      <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                    min="10"
                    max="500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label htmlFor="venueLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Venue/Location *
                  </label>
                  <input
                    type="text"
                    id="venueLocation"
                    name="venueLocation"
                    value={formData.venueLocation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Event venue address"
                  />
                </div>
                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    {serviceTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Menu Preferences */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">3</span>
                Menu Preferences
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cuisine Preferences (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => handleCuisineToggle(cuisine)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        formData.cuisinePreferences.includes(cuisine)
                          ? 'bg-green-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:border-green-500'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Restrictions / Allergies
                </label>
                <textarea
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Please list any dietary restrictions, allergies, or special requirements..."
                />
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">4</span>
                Add-ons & Upgrades
              </h3>
              <p className="text-gray-600 mb-4">Enhance your catering experience with these options</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addOns.map((addOn) => (
                  <div
                    key={addOn.id}
                    onClick={() => handleAddOnToggle(addOn.id)}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedAddOns.includes(addOn.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{addOn.name}</h4>
                      <span className="text-green-600 font-medium">
                        R {addOn.price} {addOn.priceType === 'perPerson' ? '/person' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{addOn.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget & Additional Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">5</span>
                Additional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Budget Range (R)
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="e.g., 5000-10000"
                  />
                </div>
                <div>
                  <label htmlFor="heardAboutUs" className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about us? *
                  </label>
                  <select
                    id="heardAboutUs"
                    name="heardAboutUs"
                    value={formData.heardAboutUs}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="">Select source</option>
                    {referralSources.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments or Special Requests
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Tell us more about your event, theme, or any special requests..."
                />
              </div>
            </div>

            {/* Quote Summary */}
            {selectedPackage && (
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Quote Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Package: {selectedPackage.name}</span>
                    <span className="font-bold">R {selectedPackage.price}/person</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Guests</span>
                    <span>{formData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>R {(selectedPackage.price * formData.guests).toFixed(2)}</span>
                  </div>
                  {selectedAddOns.length > 0 && (
                    <>
                      <div className="border-t border-white/20 pt-2">
                        <span className="font-semibold">Add-ons:</span>
                      </div>
                      {selectedAddOns.map(addOnId => {
                        const addOn = addOns.find(a => a.id === addOnId);
                        return addOn ? (
                          <div key={addOnId} className="flex justify-between text-sm">
                            <span>{addOn.name}</span>
                            <span>R {addOn.priceType === 'perPerson' 
                              ? (addOn.price * formData.guests).toFixed(2)
                              : addOn.price.toFixed(2)}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </>
                  )}
                  <div className="border-t border-white/20 pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Estimated Total</span>
                      <span>R {totalEstimate.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-green-100 mt-2">
                      *Final quote may vary based on menu customization and seasonal availability
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {loading ? "Submitting Inquiry..." : "Request Catering Quote"}
            </button>

            <p className="text-center text-sm text-gray-500">
              By submitting this form, you agree to our privacy policy and terms of service.
              We'll respond within 24 hours.
            </p>
          </form>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Garden & Grains Catering</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Farm Fresh</h3>
              <p className="text-gray-600 text-sm">Locally sourced, seasonal ingredients from Cape Town farms</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Expert Chefs</h3>
              <p className="text-gray-600 text-sm">Professional culinary team with years of event experience</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">♻️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600 text-sm">Sustainable practices and biodegradable packaging</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Customizable</h3>
              <p className="text-gray-600 text-sm">Fully tailored menus to match your event theme</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions? Let's Chat</h3>
          <p className="text-gray-600 mb-8">
            Our catering specialists are ready to help plan your perfect event
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📞</span>
              <span className="text-gray-700">+27 69 376 5574</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📧</span>
              <span className="text-gray-700">catering@gardengrains.co.za</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span className="text-gray-700">WhatsApp: +27 69 376 5574</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}