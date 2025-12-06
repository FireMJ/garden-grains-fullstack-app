import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garden Grains | Healthy Bowls & Salads",
  description: "Fresh, healthy bowls and salads delivered to your door",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              {/* Single Header */}
              <Header />
              
              {/* Main Content */}
              <main className="flex-grow">
                {children}
              </main>
              
              {/* Footer */}
              <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <h3 className="text-xl font-bold mb-4">Garden Grains</h3>
                      <p className="text-gray-400">
                        Fresh, healthy bowls and salads delivered to your door.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-4">Quick Links</h4>
                      <ul className="space-y-2">
                        <li><a href="/menu" className="text-gray-400 hover:text-white">Menu</a></li>
                        <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-4">Legal</h4>
                      <ul className="space-y-2">
                        <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                        <li><a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold mb-4">Contact</h4>
                      <ul className="space-y-2 text-gray-400">
                        <li>hello@gardengrains.co.za</li>
                        <li>+27 123 456 789</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Garden Grains. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
