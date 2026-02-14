/* =========================================================
   HisabDesk — usePortfolioAI Hook
   ---------------------------------------------------------
   CLIENT SIDE ONLY

   PURPOSE
   - Fetch AI rebalance advice
   - Call server AI route only
   - Manage loading + text state
   - ZERO business logic
   - ZERO calculations
   - ZERO OpenAI on client

   ARCHITECTURE
     Component → hook → /api/ai/portfolio/rebalance → AI

   RULES
   ✅ thin client
   ✅ fetch only
   ❌ no math
   ❌ no DB
   ❌ no OpenAI

   ========================================================= */

"use client"

import { useCallback, useState } from "react"

/* =========================================================
   STATE
   ========================================================= */

interface UsePortfolioAIState {
  loading: boolean
  error: string | null
  text: string | null
}

/* =========================================================
   HOOK
   ========================================================= */

export function usePortfolioAI() {
  const [state, setState] = useState<UsePortfolioAIState>({
    loading: false,
    error: null,
    text: null,
  })

  /* -------------------------------------------------------
     HELPERS
     ------------------------------------------------------- */

  const setLoading = (loading: boolean) =>
    setState((s) => ({ ...s, loading }))

  const setError = (error: string | null) =>
    setState((s) => ({ ...s, error }))

  const setText = (text: string | null) =>
    setState((s) => ({ ...s, text }))

  /* =======================================================
     FETCH AI ADVICE
     ======================================================= */

  const getAdvice = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(
        "/api/ai/portfolio/rebalance",
        {
          method: "POST",
        },
      )

      if (!res.ok) throw new Error("AI request failed")

      const data = await res.json()

      setText(data.text ?? "No advice available")

      return data.text
    } catch (err: any) {
      setError(err.message || "AI unavailable")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /* =======================================================
     EXPORT
     ======================================================= */

  return {
    ...state,
    getAdvice,
  }
}
