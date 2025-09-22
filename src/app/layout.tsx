// app/layout.tsx
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import CartUIWrapper from "@/components/CartUIWrapper"

export const metadata = {
  title: "Garden & Grains",
  description: "Fresh, healthy, plant-based meals",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#FAF7F2] min-h-screen text-gray-900 flex flex-col">
        <CartProvider>
          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Floating cart UI */}
          <CartUIWrapper />
        </CartProvider>
      </body>
    </html>
  )
}
