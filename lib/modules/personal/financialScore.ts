ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Financial Score Engine (Personal Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Produce ONE simple financial health score (0ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“100)
//
//   This becomes:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Dashboard health score
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Quick AI context
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Gamification metric
//
//   Combines:
//     savings
//     runway
//     debt risk
//     goals
//     spending
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
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
  score: number                // 0ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“100
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
  // Savings score (0ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“35)
  // --------------------------------------------------------

  const savingsScore = clamp(
    (input.savingsRate / 40) * 35,
    0,
    35
  )

  // --------------------------------------------------------
  // Safety score (runway months) (0ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“25)
  // --------------------------------------------------------

  const safetyScore = clamp(
    (input.runwayMonths / 6) * 25,
    0,
    25
  )

  // --------------------------------------------------------
  // Debt score (lower is better) (0ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“20)
  // debtRatio < 0.3 excellent
  // --------------------------------------------------------

  const debtScore = clamp(
    (1 - input.debtRatio) * 20,
    0,
    20
  )

  // --------------------------------------------------------
  // Discipline score (overspending + goals) (0ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“20)
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
