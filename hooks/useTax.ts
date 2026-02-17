ï»¿/* =========================================================
   HisabDesk ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â useTaxAI Hook
   ---------------------------------------------------------
   CLIENT SIDE ONLY

   PURPOSE
   - Calls AI Tax Advisor endpoint
   - Fetches personalized tax suggestions
   - ZERO business logic
   - ZERO calculations
   - ZERO OpenAI
   - ZERO Supabase

   Architecture:
     Component ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ useTaxAI ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ /api/ai/tax ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ safeRunAI ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ GPT-4

   WHY SEPARATE FROM useTax?
   - clear separation of concerns
   - calculation ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â  AI advice
   - independent loading states
   - avoids re-render coupling

   ========================================================= */

"use client"

import { useCallback, useState } from "react"

/* =========================================================
   TYPES
   ========================================================= */

interface UseTaxAIState {
  loading: boolean
  error: string | null
  message: string | null
}

/* =========================================================
   HOOK
   ========================================================= */

export function useTaxAI(financialYear = "2024-25") {
  const [state, setState] = useState<UseTaxAIState>({
    loading: false,
    error: null,
    message: null,
  })

  /* =======================================================
     HELPERS
     ======================================================= */

  const setLoading = (loading: boolean) =>
    setState((s) => ({ ...s, loading }))

  const setError = (error: string | null) =>
    setState((s) => ({ ...s, error }))

  /* =======================================================
     GET AI ADVICE
     ======================================================= */

  const getAdvice = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/ai/tax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          financialYear,
        }),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "AI advisor failed")
      }

      const data = await res.json()

      setState((s) => ({
        ...s,
        message: data.message ?? null,
      }))

      return data.message as string
    } catch (err: any) {
      setError(err.message || "AI request failed")
      return null
    } finally {
      setLoading(false)
    }
  }, [financialYear])

  /* =======================================================
     RESET (optional utility)
     ======================================================= */

  const reset = () =>
    setState({
      loading: false,
      error: null,
      message: null,
    })

  /* =======================================================
     EXPORT
     ======================================================= */

  return {
    ...state,
    getAdvice,
    reset,
  }
}
