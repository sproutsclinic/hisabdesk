ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Automation Engine
   ---------------------------------------------------------
   PURE BUSINESS LOGIC (DETERMINISTIC)

   PURPOSE
   - Compute next run dates
   - Compute monthly impact
   - Prepare overview
   - ZERO DB
   - ZERO AI
   - ZERO side effects

   SAFE TO IMPORT IN
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ service
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ cron jobs
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ server routes

   NEVER
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ client
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ UI
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Supabase

   ========================================================= */

import type {
  AutomationRuleRow,
  AutomationRuleComputed,
  AutomationOverview,
  AutomationFrequency,
} from "./types"

/* =========================================================
   DATE HELPERS
   ========================================================= */

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function addYears(date: Date, years: number) {
  const d = new Date(date)
  d.setFullYear(d.getFullYear() + years)
  return d
}

/* =========================================================
   NEXT RUN CALC
   ========================================================= */

export function computeNextRunDate(
  lastRunAt: string | null,
  startDate: string,
  frequency: AutomationFrequency,
): string {
  const base = new Date(lastRunAt || startDate)

  let next: Date

  switch (frequency) {
    case "daily":
      next = addDays(base, 1)
      break

    case "weekly":
      next = addDays(base, 7)
      break

    case "monthly":
      next = addMonths(base, 1)
      break

    case "yearly":
      next = addYears(base, 1)
      break

    default:
      next = base
  }

  return next.toISOString()
}

/* =========================================================
   MONTHLY NORMALIZATION
   (for dashboard impact math)
   ========================================================= */

function monthlyMultiplier(freq: AutomationFrequency): number {
  switch (freq) {
    case "daily":
      return 30
    case "weekly":
      return 4
    case "monthly":
      return 1
    case "yearly":
      return 1 / 12
    default:
      return 1
  }
}

/* =========================================================
   COMPUTED RULE
   ========================================================= */

export function computeRule(
  rule: AutomationRuleRow,
): AutomationRuleComputed {
  return {
    ...rule,
    nextRunAt: computeNextRunDate(
      rule.last_run_at,
      rule.start_date,
      rule.frequency,
    ),
  }
}

/* =========================================================
   OVERVIEW
   ========================================================= */

export function buildAutomationOverview(
  rows: AutomationRuleRow[],
): AutomationOverview {
  const rules = rows.map(computeRule)

  let monthlyIncome = 0
  let monthlyExpense = 0
  let activeRules = 0

  for (const r of rules) {
    if (!r.active) continue

    activeRules++

    const monthlyValue =
      r.amount * monthlyMultiplier(r.frequency)

    if (r.type === "income") {
      monthlyIncome += monthlyValue
    } else {
      monthlyExpense += monthlyValue
    }
  }

  return {
    rules,
    summary: {
      activeRules,
      monthlyIncome,
      monthlyExpense,
      netMonthlyImpact: monthlyIncome - monthlyExpense,
    },
  }
}
