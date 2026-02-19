import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear().toString();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Garden Grains</h3>
            <p className="text-gray-400">
              Fresh, healthy, and delicious meals made with love.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/menu" className="text-gray-400 hover:text-white transition">Menu</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              <li><Link href="/reviews" className="text-gray-400 hover:text-white transition">Reviews</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>123 Health Street</li>
              <li>Cape Town, South Africa</li>
              <li>Tel: +27 21 123 4567</li>
              <li>Email: info@gardengrains.com</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Hours</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Mon-Fri: 7am - 8pm</li>
              <li>Sat: 8am - 9pm</li>
              <li>Sun: 8am - 3pm</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Garden Grains. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
