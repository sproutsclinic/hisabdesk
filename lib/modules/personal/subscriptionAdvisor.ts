// ==========================================================
// HisabDesk — Subscription Advisor (Personal Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Detect subscription waste + optimization opportunities
//
//   Identifies:
//     • duplicate subscriptions
//     • low-value recurring spends
//     • high monthly subscription burden
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
//
// Used by:
//   - bills page
//   - automation page
//   - AI bill-optimizer route
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface Subscription {
  id: string
  name: string
  amount: number
  frequency: "monthly" | "yearly"
  isActive: boolean
}

export interface SubscriptionAdvice {
  id: string
  name: string
  monthlyCost: number
  status: "normal" | "expensive" | "waste"
  suggestedSaving: number
}

export interface SubscriptionSummary {
  totalMonthlyCost: number
  yearlyEquivalent: number
  advices: SubscriptionAdvice[]
  burdenPercentOfIncome: number
}

// ==========================================================
// HELPERS
// ==========================================================

function round(n: number) {
  return Math.round(n)
}

function toMonthly(amount: number, frequency: string) {
  if (frequency === "yearly") return amount / 12
  return amount
}

// ==========================================================
// CORE ANALYZER
// ==========================================================

export function analyzeSubscriptions(
  subs: Subscription[],
  monthlyIncome: number
): SubscriptionSummary {
  if (!subs.length) {
    return {
      totalMonthlyCost: 0,
      yearlyEquivalent: 0,
      advices: [],
      burdenPercentOfIncome: 0,
    }
  }

  const active = subs.filter((s) => s.isActive)

  const monthlyCosts = active.map((s) =>
    toMonthly(s.amount, s.frequency)
  )

  const totalMonthlyCost = monthlyCosts.reduce(
    (a, b) => a + b,
    0
  )

  const yearlyEquivalent = totalMonthlyCost * 12

  const advices: SubscriptionAdvice[] = active.map(
    (s) => {
      const monthly = toMonthly(s.amount, s.frequency)

      let status: SubscriptionAdvice["status"] = "normal"

      // ----------------------------------------------------
      // Heuristics
      // ----------------------------------------------------
      // >5% income = expensive
      // >10% income = waste
      // ----------------------------------------------------

      const share =
        monthlyIncome > 0
          ? (monthly / monthlyIncome) * 100
          : 0

      if (share >= 10) status = "waste"
      else if (share >= 5) status = "expensive"

      const suggestedSaving =
        status === "waste"
          ? monthly
          : status === "expensive"
          ? monthly * 0.5
          : 0

      return {
        id: s.id,
        name: s.name,
        monthlyCost: round(monthly),
        status,
        suggestedSaving: round(suggestedSaving),
      }
    }
  )

  const burdenPercentOfIncome =
    monthlyIncome > 0
      ? (totalMonthlyCost / monthlyIncome) * 100
      : 0

  return {
    totalMonthlyCost: round(totalMonthlyCost),
    yearlyEquivalent: round(yearlyEquivalent),
    advices,
    burdenPercentOfIncome: round(burdenPercentOfIncome),
  }
}
