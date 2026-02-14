// ==========================================================
// HisabDesk — Automation Advisor (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Detect patterns → suggest automation rules
//   (recurring expenses, subscriptions, salaries, EMIs)
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
//
// Used by:
//   - automation page suggestions
//   - AI automation hints
//
// Converts raw transactions → rule recommendations
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface Tx {
  description?: string | null
  amount: number
  category_id?: string | null
  date: string // YYYY-MM-DD
  type: "income" | "expense"
}

export interface AutomationSuggestion {
  description: string
  amount: number
  category_id?: string | null
  frequency: "monthly" | "weekly"
  confidence: number // 0–100
}

// ==========================================================
// HELPERS
// ==========================================================

function monthKey(date: string) {
  return date.slice(0, 7)
}

function daysBetween(a: Date, b: Date) {
  const diff = Math.abs(a.getTime() - b.getTime())
  return diff / (1000 * 60 * 60 * 24)
}

function round(n: number) {
  return Math.round(n)
}

// ==========================================================
// CORE DETECTION LOGIC
// ==========================================================

export function detectAutomationSuggestions(
  transactions: Tx[]
): AutomationSuggestion[] {
  if (!transactions.length) return []

  // group by description + amount
  const groups: Record<string, Tx[]> = {}

  for (const t of transactions) {
    const key = `${t.description || "unknown"}-${t.amount}`

    if (!groups[key]) groups[key] = []
    groups[key].push(t)
  }

  const suggestions: AutomationSuggestion[] = []

  for (const group of Object.values(groups)) {
    if (group.length < 3) continue // need pattern

    const sorted = [...group].sort((a, b) =>
      a.date.localeCompare(b.date)
    )

    const intervals: number[] = []

    for (let i = 1; i < sorted.length; i++) {
      const d1 = new Date(sorted[i - 1].date)
      const d2 = new Date(sorted[i].date)
      intervals.push(daysBetween(d1, d2))
    }

    const avgInterval =
      intervals.reduce((a, b) => a + b, 0) /
      intervals.length

    let frequency: "monthly" | "weekly" | null = null

    if (avgInterval >= 25 && avgInterval <= 35)
      frequency = "monthly"
    else if (avgInterval >= 6 && avgInterval <= 8)
      frequency = "weekly"

    if (!frequency) continue

    const confidence =
      group.length >= 6 ? 95 : group.length >= 4 ? 80 : 65

    suggestions.push({
      description: sorted[0].description || "Recurring",
      amount: round(sorted[0].amount),
      category_id: sorted[0].category_id,
      frequency,
      confidence,
    })
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence)
}
