"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const cateringOptions = [
  {
    id: "corporate",
    title: "Corporate Catering",
    description: "Professional catering for offices, meetings, and corporate events",
    image: "/images/catering/corporate.jpg",
    features: ["Customizable menus", "Dietary accommodations", "Professional setup", "Timely delivery"],
    startingPrice: 1500
  },
  {
    id: "events",
    title: "Events & Parties",
    description: "Delicious food for birthdays, celebrations, and special occasions",
    image: "/images/catering/events.jpg",
    features: ["Theme-based menus", "Beverage packages", "Serving staff available", "Decor options"],
    startingPrice: 2000
  },
  {
    id: "wellness",
    title: "Wellness Programs",
    description: "Healthy meal plans for fitness centers, yoga studios, and wellness retreats",
    image: "/images/catering/wellness.jpg",
    features: ["Nutritionist approved", "Calorie counted", "Weekly plans", "Fresh ingredients"],
    startingPrice: 1200
  }
];

const menuPackages = [
  {
    name: "Basic Package",
    price: 1500,
    serves: 10,
    includes: [
      "2 Main Course Options",
      "2 Side Dishes", 
      "1 Salad",
      "Water & Juices"
    ]
  },
  {
    name: "Standard Package",
    price: 2500,
    serves: 20,
    includes: [
      "3 Main Course Options",
      "3 Side Dishes",
      "2 Salads",
      "Assorted Beverages",
      "Dessert Selection"
    ]
  },
  {
    name: "Premium Package",
    price: 4000,
    serves: 30,
    includes: [
      "4 Main Course Options",
      "4 Side Dishes",
      "3 Salads",
      "Premium Beverages",
      "Dessert Station",
      "Setup & Service"
    ]
  }
];

export default function CateringPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    guests: "",
    date: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Catering inquiry submitted! We'll contact you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      guests: "",
      date: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Professional Catering Services</h1>
          <p className="text-xl md:text-2xl mb-8">Fresh, delicious meals for your corporate events, parties, and special occasions</p>
          <button 
            onClick={() => document.getElementById('catering-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Get a Quote
          </button>
        </div>
      </section>

      {/* Catering Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Catering Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cateringOptions.map((option) => (
              <div 
                key={option.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform ${
                  selectedOption === option.id ? 'ring-2 ring-green-500 scale-105' : ''
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white text-4xl">🍽️</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <ul className="space-y-2 mb-4">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold">From R{option.startingPrice}</span>
                    <button className="text-green-600 hover:text-green-700 font-semibold">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Catering Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuPackages.map((pkg, index) => (
              <div 
                key={pkg.name}
                className={`border rounded-lg p-6 text-center ${
                  index === 1 ? 'border-green-500 ring-2 ring-green-500 transform scale-105' : 'border-gray-200'
                }`}
              >
                {index === 1 && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-4">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-green-600">R{pkg.price}</span>
                  <span className="text-gray-600"> / serves {pkg.serves}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.includes.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => document.getElementById('catering-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    index === 1 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  Select Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="catering-form" className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Get a Catering Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+27 12 345 6789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select event type</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell us about your event, dietary requirements, or any special requests..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
              >
                Submit Catering Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
