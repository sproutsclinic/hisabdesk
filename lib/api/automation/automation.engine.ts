ï»¿// ==========================================================
// Automation Engine (PURE LOGIC ONLY)
// Layer: Engine
//
// PURPOSE
// - determine which rules are due
// - compute next_run_at
// - build transaction rows
//
// RULES
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ pure functions only
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no DB
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no network
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no Supabase
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ no side effects
//
// This is the ONLY place with date math
// ==========================================================

/* =========================================================
Types
========================================================= */

export type AutomationFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"

export type TransactionType = "income" | "expense"

export interface AutomationRule {
  id: string
  user_id: string

  type: TransactionType
  amount: number
  category: string | null

  frequency: AutomationFrequency

  last_run_at: string | null
  next_run_at: string // ISO yyyy-mm-dd

  is_active: boolean
}

export interface TransactionInsert {
  user_id: string
  type: TransactionType
  amount: number
  category: string | null
  date: string
  source: string
}

/* =========================================================
Public API
========================================================= */

/**
 * Returns only rules that must run today
 * Also computes updated next_run_at
 */
export function evaluateDueRules(
  rules: AutomationRule[],
  todayISO: string
): AutomationRule[] {
  const today = toDate(todayISO)

  const due: AutomationRule[] = []

  for (const rule of rules) {
    const nextRun = toDate(rule.next_run_at)

    if (nextRun <= today) {
      const updatedNext = computeNextRun(nextRun, rule.frequency)

      due.push({
        ...rule,
        next_run_at: toISO(updatedNext),
      })
    }
  }

  return due
}

/**
 * Builds transactions rows to insert
 */
export function buildTransactionsFromRules(
  rules: AutomationRule[],
  todayISO: string
): TransactionInsert[] {
  return rules.map((rule) => ({
    user_id: rule.user_id,
    type: rule.type,
    amount: rule.amount,
    category: rule.category,
    date: todayISO,
    source: "automation",
  }))
}

/* =========================================================
Date Math Helpers (pure)
========================================================= */

function computeNextRun(date: Date, frequency: AutomationFrequency): Date {
  const next = new Date(date)

  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1)
      break

    case "weekly":
      next.setDate(next.getDate() + 7)
      break

    case "monthly":
      next.setMonth(next.getMonth() + 1)
      break

    case "yearly":
      next.setFullYear(next.getFullYear() + 1)
      break
  }

  return next
}

function toDate(iso: string) {
  return new Date(iso)
}

function toISO(d: Date) {
  return d.toISOString().slice(0, 10)
}
