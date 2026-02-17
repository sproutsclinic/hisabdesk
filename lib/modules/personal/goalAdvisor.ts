ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Goal Advisor (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Convert goal targets ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ actionable monthly plan
//   Answers:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Am I on track?
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ How much more SIP needed?
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Which goals are risky?
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
//
// Used by:
//   - wealth-planner page
//   - dashboard goal alerts
//   - AI context builder
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface GoalInput {
  id: string
  name: string

  targetAmount: number
  currentAmount: number

  targetDate: string // YYYY-MM-DD
  monthlyContribution?: number
}

export interface GoalAdvice {
  id: string
  name: string

  remainingAmount: number
  monthsLeft: number

  requiredMonthly: number
  currentMonthly: number

  gap: number
  status: "on_track" | "at_risk" | "behind"
}

export interface GoalsSummary {
  totalTarget: number
  totalCurrent: number
  totalRequiredMonthly: number
  advices: GoalAdvice[]
}

// ==========================================================
// HELPERS
// ==========================================================

function monthsBetween(from: Date, to: Date) {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  )
}

function round(n: number) {
  return Math.round(n)
}

// ==========================================================
// CORE ANALYZER
// ==========================================================

export function analyzeGoals(
  goals: GoalInput[],
  today = new Date()
): GoalsSummary {
  const advices: GoalAdvice[] = []

  let totalTarget = 0
  let totalCurrent = 0
  let totalRequiredMonthly = 0

  for (const g of goals) {
    totalTarget += g.targetAmount
    totalCurrent += g.currentAmount

    const remainingAmount = Math.max(
      0,
      g.targetAmount - g.currentAmount
    )

    const monthsLeft = Math.max(
      1,
      monthsBetween(today, new Date(g.targetDate))
    )

    const requiredMonthly = remainingAmount / monthsLeft
    const currentMonthly = g.monthlyContribution || 0

    const gap = Math.max(
      0,
      requiredMonthly - currentMonthly
    )

    let status: GoalAdvice["status"] = "on_track"

    if (gap > requiredMonthly * 0.3) status = "behind"
    else if (gap > 0) status = "at_risk"

    totalRequiredMonthly += requiredMonthly

    advices.push({
      id: g.id,
      name: g.name,

      remainingAmount: round(remainingAmount),
      monthsLeft,

      requiredMonthly: round(requiredMonthly),
      currentMonthly: round(currentMonthly),

      gap: round(gap),
      status,
    })
  }

  return {
    totalTarget: round(totalTarget),
    totalCurrent: round(totalCurrent),
    totalRequiredMonthly: round(totalRequiredMonthly),
    advices,
  }
}
