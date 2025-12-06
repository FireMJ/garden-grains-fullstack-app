import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Import the correct Header component
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "Garden Grains | Healthy Bowls & Salads",
  description: "Fresh, healthy bowls and salads delivered to your door",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            {/* SINGLE HEADER - no duplication */}
            <Header />
            <main className="pt-16 md:pt-20">
              {children}
            </main>
            <SpeedInsights />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
