import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import LiveVisitCounter from '@/components/LiveVisitCounter';
import NewUserDiscount from '@/components/NewUserDiscount';
import VisitTracker from '@/components/VisitTracker';

export const metadata: Metadata = {
  title: "Garden & Grains - Farm to Table",
  description: "Fresh, organic, farm-to-table meals delivered to your door",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <LiveVisitCounter />
            <NewUserDiscount />
            <VisitTracker />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
