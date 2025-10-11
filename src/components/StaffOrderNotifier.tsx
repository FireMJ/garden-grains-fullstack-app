"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function StaffOrderNotifier() {
  const { data: session } = useSession()
  const [audio] = useState(
    typeof Audio !== "undefined" ? new Audio("/sounds/new-order.mp3") : null
  )

  useEffect(() => {
    // 🚫 Only STAFF or ADMIN should get live order alerts
    const role = (session?.user as any)?.role
    if (!role || (role !== "STAFF" && role !== "ADMIN")) return

    const eventSource = new EventSource("/api/orders/stream")

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      // Play ringtone for pending orders
      if (data.some((o: any) => o.status === "PENDING")) {
        audio?.play().catch(() => {
          console.warn("Autoplay blocked until user interaction.")
        })

        toast.success("🔔 New order received!", {
          description: "Check Staff Dashboard to manage it.",
          duration: 5000,
        })
      }
    }

    eventSource.onerror = (err) => {
      console.error("SSE error:", err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [session, audio])

  return null
}
