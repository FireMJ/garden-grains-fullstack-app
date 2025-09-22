// app/layout.tsx
import "./globals.css";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <CartProvider>
            {children}
            <CartDrawer /> {/* Always mounted, visibility controlled by context */}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
