import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { PaymentProvider } from "@/context/PaymentContext";
import { DriverProvider } from "@/context/DriverContext";
import MainHeader from "@/components/MainHeader";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garden & Grains - Fresh Farm Dining",
  description: "Organic meals crafted with love at Uitsig Wine Farm. Experience farm-to-table dining with delivery & pickup available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        suppressHydrationWarning={true}
      >
        <GoogleAnalytics />
        <AuthProvider>
          <CartProvider>
            <PaymentProvider>
              <DriverProvider>
                <MainHeader />
                <main className="pt-16">
                  {children}
                </main>
              </DriverProvider>
            </PaymentProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
