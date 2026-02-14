"use client"

// ==========================================================
// HisabDesk — usePageAIContext Hook
// ----------------------------------------------------------
// PURPOSE
//   Sends current page financial metrics to AI context cache
//
//   Why:
//     ✓ reduces prompt size
//     ✓ improves AI answers
//     ✓ avoids sending large payloads every request
//
//   Flow:
//     Page metrics → POST /api/ai/context-log → cached
//     Later → AI routes auto-inject this context
//
//   Usage (example inside dashboard page):
//
//     usePageAIContext({
//       summary: "income=50k expense=30k savingsRate=40%",
//       numbers: { income: 50000, expense: 30000 }
//     })
//
//   RULE:
//     Call once per page render when metrics change
//
// ==========================================================

import { useEffect } from "react"

// ==========================================================
// TYPES
// ==========================================================

interface ContextPayload {
  summary: string
  numbers?: Record<string, number | string>
}

// ==========================================================
// HOOK
// ==========================================================

export function usePageAIContext(payload: ContextPayload) {
  useEffect(() => {
    if (!payload?.summary) return

    // fire-and-forget (non-blocking)
    fetch("/api/ai/context-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).catch(() => {
      // silent failure — never break UI
    })
  }, [payload.summary])
}
