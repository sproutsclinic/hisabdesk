"use client"

// ==========================================================
// HisabDesk — Dashboard Grid Layout
// ----------------------------------------------------------
// PURPOSE
//   Central layout compositor for dashboard widgets
//
//   Why this exists:
//     ✓ keeps page.tsx clean
//     ✓ prevents UI clutter
//     ✓ easy reorder of cards
//     ✓ scalable (future widgets plug-in)
//
//   This is ONLY layout logic.
//   No fetching, no business logic.
//
//   Usage:
//
//     <DashboardGrid>
//        <AlertsCard />
//        <AIInsightsCard />
//        <SavingsRateCard />
//        ...
//     </DashboardGrid>
//
// ==========================================================

import { ReactNode } from "react"

// ==========================================================
// TYPES
// ==========================================================

interface Props {
  children: ReactNode
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function DashboardGrid({
  children,
}: Props) {
  return (
    <div
      className="
        grid
        gap-4

        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {children}
    </div>
  )
}
