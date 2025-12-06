"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState("2024");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="bg-[#264653] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#E9C46A] mb-4">
              Garden & Grains
            </h3>
            <p className="text-gray-300">
              Fresh, healthy meals delivered to your door in Cape Town.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-[#F4A261]">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#F4A261]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#F4A261]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-[#F4A261]">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Cape Town, South Africa</li>
              <li>Open: 8am - 10pm Daily</li>
              <li>Phone: +27 12 345 6789</li>
              <li>Email: hello@gardengrains.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#F4A261]">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-[#F4A261]">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-[#F4A261]">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {currentYear} Garden & Grains • Cape Town • Plant-Based Excellence
          </p>
          <p className="mt-2 text-sm">
            All prices in South African Rands (ZAR)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
