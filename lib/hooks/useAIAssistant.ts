"use client"

// ==========================================================
// HisabDesk — useAIAssistant Hook
// ----------------------------------------------------------
// PURPOSE
//   Central reusable hook for AI chat interactions
//
//   Replaces:
//     ❌ manual fetch logic inside components
//
//   Used by:
//     ✓ Floating Assistant (FAB)
//     ✓ future inline assistants
//     ✓ page-level help panels
//
//   Benefits:
//     ✓ single fetch logic
//     ✓ loading state
//     ✓ error handling
//     ✓ reusable everywhere
//
//   Usage:
//
//     const { ask, loading, reply } = useAIAssistant()
//     await ask("How to reduce expenses?")
//
// ==========================================================

import { useState } from "react"

// ==========================================================
// TYPES
// ==========================================================

interface AskOptions {
  context?: {
    income?: number
    expense?: number
    savingsRate?: number
    networth?: number
    runwayMonths?: number
    burnRisk?: "low" | "medium" | "high"
    goalsBehind?: number
    alerts?: number
  }
}

// ==========================================================
// HOOK
// ==========================================================

export function useAIAssistant() {
  const [loading, setLoading] = useState(false)
  const [reply, setReply] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  // --------------------------------------------------------
  // ASK
  // --------------------------------------------------------

  async function ask(
    message: string,
    options?: AskOptions
  ) {
    if (!message?.trim()) return ""

    try {
      setLoading(true)
      setError(null)
      setReply("")

      const res = await fetch("/api/ai/page-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          context: options?.context,
        }),
      })

      if (!res.ok) {
        throw new Error("AI request failed")
      }

      const json = await res.json()

      const text = json.reply || ""

      setReply(text)

      return text
    } catch (e: any) {
      setError(e.message)
      return ""
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------------
  // RESET
  // --------------------------------------------------------

  function reset() {
    setReply("")
    setError(null)
  }

  // --------------------------------------------------------
  // RETURN
  // --------------------------------------------------------

  return {
    ask,
    reply,
    loading,
    error,
    reset,
  }
}
