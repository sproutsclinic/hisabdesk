"use client"

// ==========================================================
// HisabDesk — useAutoAIContext (Smart Context Saver)
// ----------------------------------------------------------
// PURPOSE
//   Automatically pushes page financial metrics to AI context
//
//   This is the FINAL ergonomic layer.
//
//   Instead of manually building summary strings:
//
//     usePageAIContext({ summary: "...", numbers })
//
//   You simply:
//
//     useAutoAIContext({
//       income,
//       expense,
//       networth,
//       savingsRate,
//       alerts
//     })
//
//   It:
//     ✓ builds compact summary
//     ✓ sends to /api/ai/context-log
//     ✓ keeps prompts small
//     ✓ improves AI answers
//
//   Used by:
//     Dashboard
//     Insights
//     Wealth planner
//     Any page with numbers
//
// ==========================================================

import { useEffect, useMemo } from "react"

// ==========================================================
// TYPES
// ==========================================================

interface Params {
  income?: number
  expense?: number
  savingsRate?: number
  networth?: number
  runwayMonths?: number
  burnRisk?: string
  goalsBehind?: number
  alerts?: number
}

// ==========================================================
// BUILD SUMMARY (token efficient)
// ==========================================================

function buildSummary(p: Params) {
  const parts: string[] = []

  if (p.income != null) parts.push(`income=${p.income}`)
  if (p.expense != null) parts.push(`expense=${p.expense}`)
  if (p.savingsRate != null)
    parts.push(`saveRate=${p.savingsRate}`)
  if (p.networth != null)
    parts.push(`networth=${p.networth}`)
  if (p.runwayMonths != null)
    parts.push(`runway=${p.runwayMonths}`)
  if (p.burnRisk) parts.push(`risk=${p.burnRisk}`)
  if (p.goalsBehind != null)
    parts.push(`goalsBehind=${p.goalsBehind}`)
  if (p.alerts != null)
    parts.push(`alerts=${p.alerts}`)

  // ultra-compact single line
  return parts.join(" ")
}

// ==========================================================
// HOOK
// ==========================================================

export function useAutoAIContext(params: Params) {
  const summary = useMemo(
    () => buildSummary(params),
    [
      params.income,
      params.expense,
      params.savingsRate,
      params.networth,
      params.runwayMonths,
      params.burnRisk,
      params.goalsBehind,
      params.alerts,
    ]
  )

  useEffect(() => {
    if (!summary) return

    // fire-and-forget
    fetch("/api/ai/context-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary,
        numbers: params,
      }),
    }).catch(() => {})
  }, [summary])
}
