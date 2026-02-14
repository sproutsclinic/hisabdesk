"use client"

// ==========================================================
// HisabDesk — useAIReady
// ----------------------------------------------------------
// PURPOSE
//   Small system-health hook for AI availability
//
//   Checks:
//     ✓ monthly budget remaining
//     ✓ AI allowed or blocked
//
//   Why:
//     ✓ disable assistant when limit reached
//     ✓ show warnings
//     ✓ prevent unnecessary API calls
//
//   Uses:
//     /api/ai/health (cheap endpoint)
//
//   Example:
//
//     const { ready, remaining } = useAIReady()
//     if (!ready) disable AI buttons
//
// ==========================================================

import { useEffect, useState } from "react"

// ==========================================================
// TYPES
// ==========================================================

interface State {
  ready: boolean
  remaining: number
  loading: boolean
}

// ==========================================================
// HOOK
// ==========================================================

export function useAIReady() {
  const [state, setState] = useState<State>({
    ready: true,
    remaining: 0,
    loading: true,
  })

  useEffect(() => {
    let mounted = true

    async function check() {
      try {
        const res = await fetch("/api/ai/health")

        if (!res.ok) return

        const json = await res.json()

        if (!mounted) return

        setState({
          ready: json.remainingBudget > 0,
          remaining: json.remainingBudget,
          loading: false,
        })
      } catch {
        if (!mounted) return

        setState((s) => ({
          ...s,
          loading: false,
        }))
      }
    }

    check()

    return () => {
      mounted = false
    }
  }, [])

  return state
}
