/* =========================================================
   HisabDesk — PortfolioHeader
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Standard header for Portfolio page
   - Title + subtitle
   - Optional right-side actions (export, buttons, etc.)
   - Pure presentation

   ARCHITECTURE
     page → Header

   RULES
   ✅ UI only
   ❌ no hooks
   ❌ no fetch
   ❌ no DB
   ❌ no AI
   ❌ no calculations

   ========================================================= */

"use client"

import type { ReactNode } from "react"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  title?: string
  subtitle?: string
  rightSlot?: ReactNode
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioHeader({
  title = "Portfolio",
  subtitle = "Track assets, allocation and returns",
  rightSlot,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* -----------------------------------------------------
         LEFT
         ----------------------------------------------------- */}
      <div>
        <h1 className="text-2xl font-semibold">
          {title}
        </h1>

        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>

      {/* -----------------------------------------------------
         RIGHT (optional actions)
         ----------------------------------------------------- */}
      {rightSlot && (
        <div className="flex items-center gap-2">
          {rightSlot}
        </div>
      )}
    </div>
  )
}
