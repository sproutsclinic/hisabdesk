// ==========================================================
// HisabDesk — Financial Score Engine (Personal Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Produce ONE simple financial health score (0–100)
//
//   This becomes:
//     • Dashboard health score
//     • Quick AI context
//     • Gamification metric
//
//   Combines:
//     savings
//     runway
//     debt risk
//     goals
//     spending
//
// PURE LOGIC
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface FinancialScoreInput {
  savingsRate: number           // %
  runwayMonths: number          // months
  debtRatio: number             // liabilities/assets
  goalsBehind: number           // count
  overspendCategories: number   // count
}

export interface FinancialScoreResult {
  score: number                // 0–100
  grade: "A" | "B" | "C" | "D" | "E"
  breakdown: {
    savings: number
    safety: number
    debt: number
    discipline: number
  }
}

// ==========================================================
// HELPERS
// ==========================================================

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

function grade(score: number): FinancialScoreResult["grade"] {
  if (score >= 85) return "A"
  if (score >= 70) return "B"
  if (score >= 55) return "C"
  if (score >= 40) return "D"
  return "E"
}

// ==========================================================
// CORE ENGINE
// ==========================================================
//
// Weighted scoring:
//   savings     35
//   safety      25
//   debt        20
//   discipline  20
//
// Total = 100
// ==========================================================

export function calculateFinancialScore(
  input: FinancialScoreInput
): FinancialScoreResult {
  // --------------------------------------------------------
  // Savings score (0–35)
  // --------------------------------------------------------

  const savingsScore = clamp(
    (input.savingsRate / 40) * 35,
    0,
    35
  )

  // --------------------------------------------------------
  // Safety score (runway months) (0–25)
  // --------------------------------------------------------

  const safetyScore = clamp(
    (input.runwayMonths / 6) * 25,
    0,
    25
  )

  // --------------------------------------------------------
  // Debt score (lower is better) (0–20)
  // debtRatio < 0.3 excellent
  // --------------------------------------------------------

  const debtScore = clamp(
    (1 - input.debtRatio) * 20,
    0,
    20
  )

  // --------------------------------------------------------
  // Discipline score (overspending + goals) (0–20)
  // --------------------------------------------------------

  const penalty =
    input.goalsBehind * 3 +
    input.overspendCategories * 2

  const disciplineScore = clamp(20 - penalty, 0, 20)

  // --------------------------------------------------------
  // Final
  // --------------------------------------------------------

  const total =
    savingsScore +
    safetyScore +
    debtScore +
    disciplineScore

  const score = Math.round(clamp(total, 0, 100))

  return {
    score,
    grade: grade(score),
    breakdown: {
      savings: Math.round(savingsScore),
      safety: Math.round(safetyScore),
      debt: Math.round(debtScore),
      discipline: Math.round(disciplineScore),
    },
  }
}
