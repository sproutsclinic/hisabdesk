"use client"

// ==========================================================
// HisabDesk — Dashboard Error UI (Error Boundary)
// ----------------------------------------------------------
// PURPOSE
//   Graceful failure screen for dashboard route
//
//   Triggered automatically by Next.js App Router
//   when any server component throws
//
//   Why:
//     ✓ prevents white screen
//     ✓ user-friendly recovery
//     ✓ retry support
//
//   RULES
//     ✓ UI only
//     ✓ no business logic
//     ✓ lightweight
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
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="p-8 max-w-md w-full text-center space-y-4">

        {/* Title */}
        <h2 className="text-lg font-semibold">
          Something went wrong
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-500">
          We couldn’t load your dashboard data.
          Please try again.
        </p>

        {/* Retry */}
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
