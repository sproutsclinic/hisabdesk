/* =========================================================
   HisabDesk — PortfolioFilters
   ---------------------------------------------------------
   UI ONLY COMPONENT

   PURPOSE
   - Filter/search portfolio holdings
   - Pure UI state
   - Parent receives filtered values
   - ZERO business logic
   - ZERO DB
   - ZERO calculations

   ARCHITECTURE
     page → filters → table

   RULES
   ✅ presentational + local UI state
   ❌ no fetch
   ❌ no supabase
   ❌ no AI
   ❌ no math logic

   ========================================================= */

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

import type { AssetType } from "@/lib/api/portfolio/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Props {
  types: AssetType[]
  onChange: (filters: {
    search: string
    type: AssetType | "all"
  }) => void
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function PortfolioFilters({
  types,
  onChange,
}: Props) {
  const [search, setSearch] = useState("")
  const [type, setType] = useState<AssetType | "all">("all")

  /* -------------------------------------------------------
     notify parent (UI only)
     ------------------------------------------------------- */
  useEffect(() => {
    onChange({ search, type })
  }, [search, type, onChange])

  return (
    <Card className="p-4 rounded-2xl flex flex-col md:flex-row gap-3 md:items-center">
      {/* -----------------------------------------------------
         SEARCH
         ----------------------------------------------------- */}
      <input
        placeholder="Search asset name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 text-sm w-full md:w-64"
      />

      {/* -----------------------------------------------------
         TYPE FILTER
         ----------------------------------------------------- */}
      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value as AssetType | "all")
        }
        className="border rounded px-3 py-2 text-sm w-full md:w-44"
      >
        <option value="all">All Types</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </Card>
  )
}
