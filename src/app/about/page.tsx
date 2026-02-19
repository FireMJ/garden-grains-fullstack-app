// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Garden & Grains</h1>
          <p className="text-lg text-gray-600">Our Story, Our Passion</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              <strong>Established in 2024</strong>, Garden & Grains is a fresh chapter in wholesome dining 
              with a simple promise: good food, grown right, served with heart.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              With vibrant salads, jam-packed bowls, hearty soups, and everyday favourites 
              made from locally sourced produce. Every dish is thoughtfully created to 
              nourish and celebrate the abundance of the earth.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              At Garden & Grains accessibility meets intention. Whether you're grabbing a 
              breakfast, settling in for lunch, or picking up dinner after a long day, there 
              is something on the menu just right for you.
            </p>
            
            <p className="text-lg text-gray-700">
              In every season, Garden & Grains remains rooted in its purpose to honour the 
              land and serve food that feels good and does good.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-green-50 rounded-lg p-6">
            <div className="text-3xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fresh & Local</h3>
            <p className="text-gray-600">
              We source ingredients from local farms to ensure freshness and support our community.
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="text-3xl mb-4">❤️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Made with Love</h3>
            <p className="text-gray-600">
              Every dish is prepared with care and attention to detail by our passionate chefs.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="text-3xl mb-4">♻️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sustainable Practices</h3>
            <p className="text-gray-600">
              WeWe'reapos;re committed to eco-friendly packaging and minimizing food waste.
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Location</h3>
              <p className="text-gray-600 mb-2">
                Uitsig Wine Farm, Stellenbosch
              </p>
              <p className="text-gray-600 mb-4">
                Nestled in the heart of the Cape Winelands
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-green-600 mr-3">🕒</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Opening Hours</h4>
                    <p className="text-gray-600">Monday - Sunday: 7:00 AM - 8:30 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 mr-3">📞</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Contact</h4>
                    <p className="text-gray-600">+27 21 887 8765</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Map Location Here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}