ï»¿/* =========================================================
   HisabDesk ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â useAutomationAI Hook
   ---------------------------------------------------------
   CLIENT SIDE ONLY

   PURPOSE
   - Call AI advisor endpoint
   - Manage loading/state
   - ZERO business logic
   - ZERO calculations
   - ZERO OpenAI calls here

   ARCHITECTURE
     Component ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ hook ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ /api/ai/automation/advice ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ server ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ OpenAI

   RULES
   ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ thin client
   ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ fetch only
   ÃƒÂ¢Ã‚ÂÃ…â€™ no AI SDK here
   ÃƒÂ¢Ã‚ÂÃ…â€™ no math
   ÃƒÂ¢Ã‚ÂÃ…â€™ no DB

   MODEL
   - GPT-3.5 (server side only)

   ========================================================= */

"use client"

import { useCallback, useState } from "react"

/* =========================================================
   STATE
   ========================================================= */

interface UseAutomationAIState {
  loading: boolean
  error: string | null
  text: string | null
}

/* =========================================================
   HOOK
   ========================================================= */

export function useAutomationAI() {
  const [state, setState] = useState<UseAutomationAIState>({
    loading: false,
    error: null,
    text: null,
  })

  /* ------------------------------------------------------- */
  /* HELPERS */
  /* ------------------------------------------------------- */

  const setLoading = (loading: boolean) =>
    setState((s) => ({ ...s, loading }))

  const setError = (error: string | null) =>
    setState((s) => ({ ...s, error }))

  const setText = (text: string | null) =>
    setState((s) => ({ ...s, text }))

  /* =======================================================
     FETCH ADVICE
     ======================================================= */

  const getAdvice = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/ai/automation/advice", {
        method: "POST",
      })

      if (!res.ok) throw new Error("AI request failed")

      const json = await res.json()

      setText(json.text || "")
    } catch (err: any) {
      setError(err.message || "Failed to fetch advice")
    } finally {
      setLoading(false)
    }
  }, [])

  /* =======================================================
     RESET
     ======================================================= */

  const reset = useCallback(() => {
    setText(null)
    setError(null)
  }, [])

  /* =======================================================
     EXPORT
     ======================================================= */

  return {
    ...state,
    getAdvice,
    reset,
  }
}
