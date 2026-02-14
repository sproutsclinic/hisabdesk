"use client"

// ==========================================================
// HisabDesk — Vault Error Boundary
// ----------------------------------------------------------
// PURPOSE
//   Graceful fallback when Vault fails to load
//
//   Handles:
//     ✓ server errors
//     ✓ storage issues
//     ✓ network failures
//
//   UX:
//     ✓ friendly message
//     ✓ retry button
//
//   RULES
//     ✓ client component
//     ✓ UI only
//     ✓ no business logic
//
// ==========================================================

import { useEffect } from "react"
import { Card } from "@/components/ui/card"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error("Vault error:", error)
  }, [error])

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">

      <Card className="p-8 max-w-md w-full text-center space-y-4">

        <h2 className="text-lg font-semibold">
          Vault unavailable
        </h2>

        <p className="text-sm text-gray-500">
          We couldn’t load your documents right now.
          Please try again.
        </p>

        <button
          onClick={reset}
          className="
            w-full
            bg-primary
            text-white
            rounded
            py-2
            text-sm
          "
        >
          Retry
        </button>

      </Card>

    </main>
  )
}
