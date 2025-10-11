// app/layout.tsx
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import CartUIWrapper from "@/components/CartUIWrapper"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import SessionProvider from "./providers/SessionProvider"
import { Toaster } from "sonner"
import StaffOrderNotifier from "@/components/StaffOrderNotifier"

if (process.env.NODE_ENV === "development") {
  const origError = console.error
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Hydration failed")) {
      // Use our custom logger
      import("@/lib/logHydration").then(({ logHydrationMismatch }) => {
        logHydrationMismatch(args[0])
      })
    } else {
      origError(...args)
    }
  }
}

export const metadata = {
  title: "Garden & Grains",
  description: "Fresh, healthy, plant-based meals",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch session on the server
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#FAF7F2] min-h-screen text-gray-900 flex flex-col"
      >
        {/* Wrap everything with SessionProvider */}
        <SessionProvider session={session}>
          <CartProvider>
            {/* Main content */}
            <main className="flex-1">{children}</main>

            {/* Floating cart UI */}
            <CartUIWrapper />
          </CartProvider>

          {/* 🔔 Staff order listener always running */}
          <StaffOrderNotifier />
        </SessionProvider>

        {/* Toast notifications */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
