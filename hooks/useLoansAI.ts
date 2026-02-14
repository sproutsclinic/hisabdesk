/* =========================================================
   HisabDesk — useLoansAI Hook
   ---------------------------------------------------------
   CLIENT SIDE ONLY

   PURPOSE
   - Fetch AI payoff advice
   - Call server route only
   - Manage loading/state
   - ZERO business logic
   - ZERO calculations
   - ZERO OpenAI calls

   ARCHITECTURE
     Component → hook → /api/ai/loans → server → OpenAI

   RULES
   ✅ thin client
   ✅ fetch only
   ❌ no math
   ❌ no DB
   ❌ no OpenAI
   ❌ no prompt logic

   ========================================================= */

"use client"

import { useCallback, useState } from "react"

/* =========================================================
   STATE
   ========================================================= */

interface UseLoansAIState {
  loading: boolean
  text: string | null
  error: string | null
}

/* =========================================================
   HOOK
   ========================================================= */

export function useLoansAI() {
  const [state, setState] = useState<UseLoansAIState>({
    loading: false,
    text: null,
    error: null,
  })

  /* =======================================================
     RUN AI
     ======================================================= */

  const run = useCallback(async () => {
    try {
      setState({
        loading: true,
        text: null,
        error: null,
      })

      const res = await fetch("/api/ai/loans", {
        method: "POST",
      })

      if (!res.ok) throw new Error("AI request failed")

      const data = await res.json()

      setState({
        loading: false,
        text: data.text,
        error: null,
      })

      return data.text as string
    } catch (err: any) {
      setState({
        loading: false,
        text: null,
        error: err.message || "AI failed",
      })

      return null
    }
  }, [])

  /* =======================================================
     EXPORT
     ======================================================= */

  return {
    ...state,
    run,
  }
}
