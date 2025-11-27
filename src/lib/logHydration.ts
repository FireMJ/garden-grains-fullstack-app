// lib/logHydration.ts
export function logHydrationMismatch(message: string) {
  if (process.env.NODE_ENV === "development") {
    // Only log in dev mode
    if (
      message.includes("data-gr-ext-installed") || // Grammarly
      message.includes("data-new-gr-c-s-check-loaded") // Grammarly again
    ) {
      // Ignore Grammarly-style injections
      return
    }

    console.warn("[Hydration mismatch]", message)
  }
}
