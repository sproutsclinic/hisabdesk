"use client"

// ==========================================================
// HisabDesk — Personal Not Found
// Location: app/personal/not-found.tsx
//
// PURPOSE
// Handles all unknown routes under /personal/*
//
// Examples:
//   /personal/xyz
//   deleted pages
//   bad links
//
// Next.js:
// special file → auto 404 boundary
//
// RULES
// ✅ UI only
// ✅ no logic
// ❌ no DB
// ❌ no fetch
// ❌ no business logic
// ==========================================================

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/* =========================================================
Page
========================================================= */

export default function PersonalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <Card className="max-w-md w-full p-8 rounded-2xl text-center space-y-5">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Page not found</h1>

          <p className="text-sm text-muted-foreground">
            The page you’re looking for doesn’t exist or may have been moved.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Link href="/personal/dashboard">
            <Button>
              Go to Dashboard
            </Button>
          </Link>

          <Link href="/personal">
            <Button variant="outline">
              Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
