"use client";

import { useState, FormEvent, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

// Types
interface DiningPackage {
  id: string;
  name: string;
  price: number;
  menuHighlights: string[];
  drinks: string;
  notes: string;
  popular?: boolean;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: "perPerson" | "flat";
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
  selectedAddOns: string[];
  dietaryRestrictions: string;
  budget: string;
  venueLocation: string;
  serviceType: "full" | "dropoff" | "buffet" | "plated";
  message: string;
  heardAboutUs: string;
  venueHireType: "exclusive" | "nonexclusive" | "none";
  venueHours: number;
}

// Dining Packages Data
const diningPackages: DiningPackage[] = [
  {
    id: "harvest",
    name: "Harvest Table",
    price: 495,
    popular: true,
    menuHighlights: [
      "Charcuterie boards",
      "Slow‑cooked beef roast",
      "Grilled chicken fillets",
      "Local fish (hake or line fish)",
      "Seasonal salads",
      "Starch (Couscous, Brown rice, Quinoa)",
      "Brownie + ice cream"
    ],
    drinks: "Jugs of freshly squeezed juices",
    notes: "Communal dining style; seasonal salads rotate"
  },
  {
    id: "set-menu",
    name: "Set Menu (3‑Course)",
    price: 550,
    popular: false,
    menuHighlights: [
      "Starter: Charcuterie board",
      "Main: Choice of grilled chicken, beef roast, or local fish",
      "Seasonal salads + starch (Couscous, Brown rice, Quinoa)",
      "Dessert: Brownie + ice cream"
    ],
    drinks: "Bottomless freshly squeezed juices",
    notes: "Formal plated service"
  }
];

// Premium Add-Ons
const addOns: AddOn[] = [
  { 
    id: "karoo-lamb", 
    name: "Karoo Leg of Lamb", 
    description: "Rosemary & garlic, red wine reduction", 
    price: 95, 
    priceType: "perPerson" 
  },
  { 
    id: "norwegian-salmon", 
    name: "Norwegian Salmon", 
    description: "Garlic thyme butter", 
    price: 110, 
    priceType: "perPerson" 
  },
  { 
    id: "extra-salad", 
    name: "Extra Salad/Side", 
    description: "Additional seasonal salad or side dish", 
    price: 45, 
    priceType: "perPerson" 
  },
  { 
    id: "dessert-upgrade", 
    name: "Dessert Upgrade", 
    description: "Brownie + Sorbet Trio", 
    price: 55, 
    priceType: "perPerson" 
  }
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

const eventTypes = [
  { id: "corporate", name: "Corporate Event", icon: "💼" },
  { id: "wedding", name: "Wedding", icon: "💒" },
  { id: "birthday", name: "Birthday Party", icon: "🎂" },
  { id: "private", name: "Private Dinner", icon: "🏠" },
  { id: "holiday", name: "Holiday Party", icon: "🎄" },
  { id: "fundraiser", name: "Fundraiser / Gala", icon: "🤝" }
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
    package: "harvest",
    selectedAddOns: [],
    dietaryRestrictions: "",
    budget: "",
    venueLocation: "",
    serviceType: "full",
    message: "",
    heardAboutUs: "",
    venueHireType: "none",
    venueHours: 0
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [totalEstimate, setTotalEstimate] = useState(0);
  const [venueCost, setVenueCost] = useState(0);

  const VENUE_HOURLY_RATE = 1000;

  const calculateTotal = () => {
    const selectedPkg = diningPackages.find(p => p.id === formData.package);
    if (!selectedPkg) return 0;
    
    let total = selectedPkg.price * formData.guests;
    
    formData.selectedAddOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) {
        total += addOn.priceType === "perPerson" 
          ? addOn.price * formData.guests 
          : addOn.price;
      }
    });
    
    // Add venue hire cost
    if (formData.venueHireType === "exclusive" && formData.venueHours > 0) {
      total += formData.venueHours * VENUE_HOURLY_RATE;
    }
    
    return total;
  };

  useEffect(() => {
    setTotalEstimate(calculateTotal());
    setVenueCost(formData.venueHireType === "exclusive" ? formData.venueHours * VENUE_HOURLY_RATE : 0);
  }, [formData.package, formData.guests, formData.selectedAddOns, formData.venueHireType, formData.venueHours]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' || name === 'venueHours' ? parseInt(value) || 0 : value
    }));
  };

  const handleVenueHireChange = (type: "exclusive" | "nonexclusive" | "none") => {
    setFormData(prev => ({
      ...prev,
      venueHireType: type,
      venueHours: type === "none" ? 0 : prev.venueHours || 0
    }));
  };

  const handleAddOnToggle = (addOnId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(addOnId)
        ? prev.selectedAddOns.filter(id => id !== addOnId)
        : [...prev.selectedAddOns, addOnId]
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate venue hire selection
    if (formData.venueHireType === "exclusive" && formData.venueHours === 0) {
      alert("Please enter the number of hours for exclusive venue hire.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "cateringInquiries"), {
        ...formData,
        totalEstimate: calculateTotal(),
        venueCost: venueCost,
        submittedAt: serverTimestamp(),
        status: "pending",
        source: "website"
      });

      setSubmitted(true);
      
    } catch (error: unknown) {
      console.error("Error submitting catering inquiry:", error);
      alert("There was an error submitting your inquiry. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPackage = diningPackages.find(pkg => pkg.id === formData.package);

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

      {/* Exclusive Venue Hire */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏛️</span>
              <h2 className="text-3xl font-bold text-gray-900">Exclusive Venue Hire</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-bold text-[#1E4259] mb-2">R1,000 <span className="text-lg font-normal text-gray-600">per hour</span></p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Full use of restaurant space</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Professional staff service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Décor flexibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">⚠️</span>
                    <span className="text-sm">Deposit required upfront for estimated hours (non-refundable if cancelled)</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/80 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Perfect For:</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Weddings</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Corporate Events</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Private Parties</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Galas</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Anniversaries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dining Packages */}
      <div id="packages" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">🍽️ Dining Packages</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose from our carefully crafted dining packages for your event
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {diningPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                  formData.package === pkg.id ? 'ring-4 ring-green-500 scale-[1.02]' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-[#F4A261] text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-green-600">R {pkg.price}</span>
                    <span className="text-gray-500 text-sm"> /person</span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Menu Highlights:</h4>
                    <ul className="space-y-1">
                      {pkg.menuHighlights.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-600">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-gray-700">🥤 Drinks:</p>
                    <p className="text-sm text-gray-600">{pkg.drinks}</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-blue-700">📝 Note:</p>
                    <p className="text-sm text-blue-600">{pkg.notes}</p>
                  </div>
                  
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, package: pkg.id }))}
                    className={`w-full py-3 rounded-lg transition font-medium ${
                      formData.package === pkg.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-600 hover:text-white'
                    }`}
                  >
                    {formData.package === pkg.id ? 'Selected' : 'Select Package'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Add-Ons */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">🥩 Premium Add‑Ons</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Enhance your dining experience with these premium upgrades
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addOn) => (
              <div
                key={addOn.id}
                onClick={() => handleAddOnToggle(addOn.id)}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  formData.selectedAddOns.includes(addOn.id)
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{addOn.name}</h4>
                  <span className="text-green-600 font-bold">
                    +R{addOn.price} <span className="text-xs font-normal text-gray-500">pp</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">{addOn.description}</p>
                {formData.selectedAddOns.includes(addOn.id) && (
                  <div className="mt-3 text-xs text-green-600 font-medium">✓ Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Terms */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">💳 Booking Terms</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-bold text-gray-900 mb-2">Deposit</h3>
                <p className="text-gray-600 text-sm">
                  R100 per person <br />
                  <span className="text-xs text-gray-500">(deducted from final bill; non-refundable for no-shows)</span>
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-3">🏛️</div>
                <h3 className="font-bold text-gray-900 mb-2">Exclusive Venue Deposit</h3>
                <p className="text-gray-600 text-sm">
                  Payable upfront for estimated hours of use
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="font-bold text-gray-900 mb-2">Service Charge</h3>
                <p className="text-gray-600 text-sm">
                  10% for tables of 6+ guests
                </p>
              </div>
            </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Time *</label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map(event => (
                      <option key={event.id} value={event.id}>{event.icon} {event.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests *</label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                    min="10"
                    max="500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Venue/Location *</label>
                  <input
                    type="text"
                    name="venueLocation"
                    value={formData.venueLocation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Event venue address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type *</label>
                  <select
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us? *</label>
                  <select
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
            </div>

            {/* Venue Hire Selection */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">3</span>
                Venue Hire Options
              </h3>
              <p className="text-sm text-gray-600 mb-4">Select your venue hire preference (mandatory)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => handleVenueHireChange("exclusive")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.venueHireType === "exclusive"
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🏛️</span>
                    <h4 className="font-semibold text-gray-900">Exclusive</h4>
                  </div>
                  <p className="text-sm text-gray-600">Full venue hire at R1,000/hour</p>
                  {formData.venueHireType === "exclusive" && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours Required *</label>
                      <input
                        type="number"
                        name="venueHours"
                        value={formData.venueHours}
                        onChange={handleInputChange}
                        min="1"
                        max="24"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        placeholder="Enter hours"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>

                <div
                  onClick={() => handleVenueHireChange("nonexclusive")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.venueHireType === "nonexclusive"
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🍽️</span>
                    <h4 className="font-semibold text-gray-900">Non-Exclusive</h4>
                  </div>
                  <p className="text-sm text-gray-600">Shared venue space (no additional cost)</p>
                  {formData.venueHireType === "nonexclusive" && (
                    <div className="mt-3 text-sm text-green-600">✓ Selected</div>
                  )}
                </div>

                <div
                  onClick={() => handleVenueHireChange("none")}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    formData.venueHireType === "none"
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📍</span>
                    <h4 className="font-semibold text-gray-900">No Venue Hire</h4>
                  </div>
                  <p className="text-sm text-gray-600">I have my own venue</p>
                  {formData.venueHireType === "none" && (
                    <div className="mt-3 text-sm text-green-600">✓ Selected</div>
                  )}
                </div>
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">4</span>
                Dietary Requirements
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Restrictions / Allergies
                </label>
                <textarea
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Please list any dietary restrictions, allergies, or special requirements..."
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2">5</span>
                Additional Information
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Budget Range (R)
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="e.g., 5000-10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments or Special Requests
                </label>
                <textarea
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
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">💰 Quote Summary</h3>
              <div className="space-y-3">
                {selectedPackage && (
                  <>
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
                  </>
                )}
                
                {formData.selectedAddOns.length > 0 && (
                  <>
                    <div className="border-t border-white/20 pt-2">
                      <span className="font-semibold">Add-ons:</span>
                    </div>
                    {formData.selectedAddOns.map(addOnId => {
                      const addOn = addOns.find(a => a.id === addOnId);
                      return addOn ? (
                        <div key={addOnId} className="flex justify-between text-sm">
                          <span>{addOn.name}</span>
                          <span>R {(addOn.price * formData.guests).toFixed(2)}</span>
                        </div>
                      ) : null;
                    })}
                  </>
                )}
                
                {formData.venueHireType === "exclusive" && formData.venueHours > 0 && (
                  <>
                    <div className="border-t border-white/20 pt-2">
                      <span className="font-semibold">Venue Hire:</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Exclusive Venue ({formData.venueHours} hour{formData.venueHours > 1 ? 's' : ''})</span>
                      <span>R {venueCost.toFixed(2)}</span>
                    </div>
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
