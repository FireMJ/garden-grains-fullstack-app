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
              With vibrant salads, jam-packed bowls, hearty soups, and everyday favorites 
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
              We're committed to eco-friendly packaging and minimizing food waste.
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Location</h3>
              <p className="text-gray-600 mb-2 font-semibold">
                Uitsig Wine Farm
              </p>
              <p className="text-gray-600 mb-1">
                Spaanschemat River Rd
              </p>
              <p className="text-gray-600 mb-4">
                Fir Grove, Cape Town, 7806
              </p>
              <p className="text-gray-600 mb-4 italic">
                Nestled in the heart of the Constantia Wine Valley
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">🕒</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Opening Hours</h4>
                    <p className="text-gray-600">Sunday - Wednesday: 9:00 AM - 5:30 PM</p>
                    <p className="text-gray-600">Thursday - Saturday: 9:00 AM - 9:00 PM</p>
                    <p className="text-gray-500 text-sm mt-1">Closed daily 4:00 PM - 5:00 PM for dinner prep</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">📞</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Contact</h4>
                    <p className="text-gray-600">Phone: +27 69 376 5574</p>
                    <p className="text-gray-600">WhatsApp: +27 69 376 5574</p>
                    <p className="text-gray-600">Email: info@gardengrains.co.za</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-green-600 mr-3 text-xl">📍</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Get Directions</h4>
                    <div className="flex gap-3 mt-2">
                      <a 
                        href="https://maps.google.com/?q=Uitsig+Wine+Farm+Spaanschemat+River+Rd+Fir+Grove+Cape+Town" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm inline-block"
                      >
                        Google Maps
                      </a>
                      <a 
                        href="https://waze.com/ul?q=Uitsig%20Wine%20Farm%20Cape%20Town" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm inline-block"
                      >
                        Waze
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interactive Map */}
            <div className="h-80 rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.694312890505!2d18.4167!3d-34.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc676b7c8f8b8f%3A0x8f8b8f8b8f8b8f8b!2sUitsig%20Wine%20Farm!5e0!3m2!1sen!2sza!4v1234567890" 
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
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚗</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Parking Information</h4>
                <p className="text-gray-600">
                  Ample parking available on the farm, with just an entry fee of R30 if you stay for over 30 minutes. Follow the signs to the restaurant area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}