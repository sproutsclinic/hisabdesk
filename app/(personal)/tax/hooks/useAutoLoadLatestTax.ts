/* =========================================================
   HisabDesk — useAutoLoadLatestTax
   ---------------------------------------------------------
   CLIENT HOOK ONLY

   PURPOSE
   - Automatically load latest tax calculation on page open
   - Improves UX (no manual click needed)
   - Keeps page thin
   - ZERO business logic
   - ZERO calculations
   - ZERO DB

   ARCHITECTURE
     page → hook → useTax.fetchLatest()

   FLOW
     mount
       → call fetchLatest()
       → populate result if exists

   RULES
   ✅ only orchestration
   ✅ no math
   ✅ no supabase
   ✅ no AI
   ✅ thin wrapper only

   ========================================================= */

"use client"

import { useEffect } from "react"

interface Props {
  fetchLatest: () => Promise<any>
  enabled?: boolean
}

/* =========================================================
   HOOK
   ========================================================= */

export default function useAutoLoadLatestTax({
  fetchLatest,
  enabled = true,
}: Props) {
  useEffect(() => {
    if (!enabled) return

    /* fire once on mount */
    fetchLatest()
  }, [enabled, fetchLatest])
}
