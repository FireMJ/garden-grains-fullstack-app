import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { FirebaseProvider } from "@/components/FirebaseProvider";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garden Grains - Farm to Table Restaurant",
  description: "Fresh, locally sourced ingredients prepared with passion in Constantia, Cape Town",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="min-h-screen pt-0">
                {children}
              </main>
            </CartProvider>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
