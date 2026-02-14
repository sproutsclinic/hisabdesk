// ==========================================================
// HisabDesk — Personal Dashboard Layout
// ----------------------------------------------------------
// PURPOSE
//   Dedicated layout wrapper ONLY for dashboard routes
//
//   Why:
//     ✓ isolates dashboard UI
//     ✓ clean separation from other personal pages
//     ✓ auto-mount AI globally for dashboard
//     ✓ future: filters / date range / header tools
//
//   Responsibilities:
//     ✓ mount global AI assistant
//     ✓ consistent padding/container
//     ✓ section spacing
//
//   RULES
//     ✓ NO business logic
//     ✓ NO fetching
//     ✓ layout only
//
// ==========================================================

import { ReactNode } from "react"

// ✅ global AI always available on dashboard
import { AIAssistantFAB } from "@/components/ai"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  children: ReactNode
}

// ==========================================================
// LAYOUT
// ==========================================================

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="relative">

      {/* -------------------------------------------------- */}
      {/* Main Container */}
      {/* -------------------------------------------------- */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          py-6
        "
      >
        {children}
      </section>

      {/* -------------------------------------------------- */}
      {/* Global Floating AI (always present) */}
      {/* -------------------------------------------------- */}

      <AIAssistantFAB />

    </div>
  )
}
