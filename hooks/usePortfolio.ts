ï»¿/* =========================================================
   HisabDesk ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â usePortfolioAI Hook
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
     Component ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ hook ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ /api/ai/portfolio/rebalance ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ AI

   RULES
   ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ thin client
   ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ fetch only
   ÃƒÂ¢Ã‚ÂÃ…â€™ no math
   ÃƒÂ¢Ã‚ÂÃ…â€™ no DB
   ÃƒÂ¢Ã‚ÂÃ…â€™ no OpenAI

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
