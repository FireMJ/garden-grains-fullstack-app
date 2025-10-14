import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartUIWrapper from "@/components/CartUIWrapper";
import { Toaster } from "sonner";
import StaffOrderNotifier from "@/components/StaffOrderNotifier";
import FirebaseAuthProvider from "./providers/FirebaseAuthProvider";

export const metadata = {
  title: "Garden & Grains",
  description: "Fresh, healthy, plant-based meals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#FAF7F2] min-h-screen text-gray-900 flex flex-col"
      >
        <FirebaseAuthProvider>
          <CartProvider>
            {children}
            <CartUIWrapper />
          </CartProvider>
          <StaffOrderNotifier />
        </FirebaseAuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
