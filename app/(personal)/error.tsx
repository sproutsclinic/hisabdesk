"use client"

// ==========================================================
// HisabDesk — Personal Error Boundary
// Location: app/personal/error.tsx
//
// PURPOSE
// Global crash safety for ALL personal routes
//
// Covers automatically:
//   /personal/*
//
// BEHAVIOR
// - prevents white screen
// - shows friendly fallback UI
// - allows retry
// - logs error
//
// ARCHITECTURE RULES
// ✅ UI only
// ✅ no business logic
// ✅ no DB
// ✅ no Supabase
// ❌ no calculations
//
// Next.js:
// Special file → automatic Error Boundary
// ==========================================================

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

/* =========================================================
Props (Next.js provided)
========================================================= */

export default function PersonalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  /* -------------------------------------------------------
  Log once (observability)
  ------------------------------------------------------- */

  useEffect(() => {
    console.error("[PERSONAL_ERROR_BOUNDARY]", error)
  }, [error])

  /* =======================================================
  UI
  ======================================================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <Card className="max-w-md w-full p-8 rounded-2xl text-center space-y-5">
        <h2 className="text-xl font-semibold">Something went wrong</h2>

        <p className="text-sm text-muted-foreground">
          We hit an unexpected error while loading this page.
          Please try again.
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>
            Retry
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/personal/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </Card>
    </div>
  )
}
