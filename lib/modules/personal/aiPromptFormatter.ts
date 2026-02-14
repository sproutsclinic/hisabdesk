// ==========================================================
// HisabDesk — AI Prompt Formatter (Personal → AI Bridge)
// ----------------------------------------------------------
// PURPOSE
//   Convert structured financial data → ultra-compact prompt text
//
//   This is the LAST step before calling OpenAI.
//
//   Why this file exists:
//   - reduce tokens
//   - standardize prompts
//   - avoid verbose context
//   - keep AI cost low
//
//   Flow:
//     advisors → contextBuilder → promptFormatter → /api/ai → OpenAI
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No OpenAI
//   ❌ No UI
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface PromptMetrics {
  income?: number
  expense?: number
  savingsRate?: number

  networth?: number
  networthTrend?: "up" | "down" | "flat"

  burnRisk?: string
  runwayMonths?: number

  alerts?: number
  goalsBehind?: number
}

export interface PromptResult {
  prompt: string
}

// ==========================================================
// HELPERS
// ==========================================================

function num(n?: number) {
  return typeof n === "number" ? Math.round(n) : undefined
}

// ==========================================================
// CORE FORMATTER
// ==========================================================
//
// IMPORTANT:
//   - extremely short
//   - numbers only
//   - no sentences
//   - token efficient
//
// Example output:
//
//   Metrics:
//   income=90000 expense=62000 savingsRate=31
//   networth=1250000 trend=up
//   runway=5 burn=medium alerts=2
//
//   Give 4 short bullet insights.
//
// ==========================================================

export function formatDashboardPrompt(
  m: PromptMetrics
): PromptResult {
  const lines: string[] = []

  lines.push("Metrics:")

  const parts1 = [
    `income=${num(m.income) ?? 0}`,
    `expense=${num(m.expense) ?? 0}`,
    `savingsRate=${num(m.savingsRate) ?? 0}`,
  ]

  lines.push(parts1.join(" "))

  const parts2 = [
    `networth=${num(m.networth) ?? 0}`,
    `trend=${m.networthTrend ?? "flat"}`,
  ]

  lines.push(parts2.join(" "))

  const parts3 = [
    `runway=${num(m.runwayMonths) ?? 0}`,
    `burn=${m.burnRisk ?? "low"}`,
    `alerts=${num(m.alerts) ?? 0}`,
    `goalsBehind=${num(m.goalsBehind) ?? 0}`,
  ]

  lines.push(parts3.join(" "))

  lines.push("")
  lines.push(
    "Give 4 short bullet financial insights only."
  )

  return {
    prompt: lines.join("\n"),
  }
}
