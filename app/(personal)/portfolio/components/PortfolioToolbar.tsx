/* =========================================================
   HisabDesk — PortfolioToolbar
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Top toolbar for Portfolio page
   - Combines:
       ✓ Filters
       ✓ Quick stats slot
       ✓ Future actions (export, refresh, etc.)
   - Pure composition
   - ZERO business logic
   - ZERO DB
   - ZERO calculations

   ARCHITECTURE
     page → Toolbar → Filters → Table

   RULES
   ✅ UI only
   ❌ no fetch
   ❌ no AI
   ❌ no math
   ❌ no supabase

   ========================================================= */

"use client"

import type { ReactNode } from "react"
import type { AssetType } from "@/lib/api/portfolio/types"

import PortfolioFilters from "./PortfolioFilters"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  types: AssetType[]
  onFilterChange: (filters: {
    search: string
    type: AssetType | "all"
  }) => void

  rightSlot?: ReactNode
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioToolbar({
  types,
  onFilterChange,
  rightSlot,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
      {/* -----------------------------------------------------
         LEFT → FILTERS
         ----------------------------------------------------- */}
      <PortfolioFilters
        types={types}
        onChange={onFilterChange}
      />

      {/* -----------------------------------------------------
         RIGHT → OPTIONAL ACTIONS
         (export, buttons, etc.)
         ----------------------------------------------------- */}
      {rightSlot && (
        <div className="flex gap-2 items-center">
          {rightSlot}
        </div>
      )}
    </div>
  )
}
