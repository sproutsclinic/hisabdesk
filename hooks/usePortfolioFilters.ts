/* =========================================================
   HisabDesk — usePortfolioFilters
   ---------------------------------------------------------
   CLIENT SIDE ONLY

   PURPOSE
   - Local filtering of portfolio rows
   - Pure UI filtering
   - ZERO business logic
   - ZERO calculations affecting finance
   - ZERO DB

   WHAT THIS DOES
   - search by name
   - filter by type
   - returns filtered rows

   NOTE
   This is ONLY presentation filtering,
   not financial computation.

   ARCHITECTURE
     page
       → usePortfolio()
       → usePortfolioFilters(rows)

   RULES
   ✅ UI convenience only
   ❌ no fetch
   ❌ no supabase
   ❌ no AI
   ❌ no calculations

   ========================================================= */

"use client"

import { useMemo, useState } from "react"

import type {
  AssetType,
  PortfolioAssetComputed,
} from "@/lib/api/portfolio/types"

/* =========================================================
   TYPES
   ========================================================= */

interface Filters {
  search: string
  type: AssetType | "all"
}

/* =========================================================
   HOOK
   ========================================================= */

export function usePortfolioFilters(
  rows: PortfolioAssetComputed[],
) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "all",
  })

  /* -------------------------------------------------------
     FILTER LOGIC (UI only)
     ------------------------------------------------------- */

  const filteredRows = useMemo(() => {
    if (!rows?.length) return []

    return rows.filter((r) => {
      /* search by name */
      const matchesSearch =
        !filters.search ||
        r.name
          .toLowerCase()
          .includes(filters.search.toLowerCase())

      /* filter by type */
      const matchesType =
        filters.type === "all" || r.type === filters.type

      return matchesSearch && matchesType
    })
  }, [rows, filters])

  /* -------------------------------------------------------
     EXPORT
     ------------------------------------------------------- */

  return {
    filters,
    setFilters,
    rows: filteredRows,
  }
}
