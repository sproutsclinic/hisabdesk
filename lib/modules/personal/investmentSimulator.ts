ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Investment Simulator (Personal Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   What-if investment growth projections
//
//   Answers:
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ How much will my SIP grow?
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ How long to reach X corpus?
//     ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Lump sum vs SIP comparison
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
//
// Used by:
//   - wealth planner
//   - portfolio page
//   - AI planner advice
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface SIPInput {
  initialInvestment: number
  monthlyInvestment: number
  annualReturnRate: number
  years: number
}

export interface GrowthPoint {
  year: number
  value: number
}

export interface SimulationResult {
  finalValue: number
  investedAmount: number
  gains: number
  yearlyBreakdown: GrowthPoint[]
}

// ==========================================================
// HELPERS
// ==========================================================

function monthlyRate(annualRate: number) {
  return annualRate / 12 / 100
}

function round(n: number) {
  return Math.round(n)
}

// ==========================================================
// SIP FUTURE VALUE
// ==========================================================

export function simulateSIP(
  input: SIPInput
): SimulationResult {
  const months = input.years * 12
  const r = monthlyRate(input.annualReturnRate)

  let corpus = input.initialInvestment
  const yearlyBreakdown: GrowthPoint[] = []

  for (let m = 1; m <= months; m++) {
    corpus = corpus * (1 + r) + input.monthlyInvestment

    if (m % 12 === 0) {
      yearlyBreakdown.push({
        year: m / 12,
        value: round(corpus),
      })
    }
  }

  const investedAmount =
    input.initialInvestment +
    input.monthlyInvestment * months

  const gains = corpus - investedAmount

  return {
    finalValue: round(corpus),
    investedAmount: round(investedAmount),
    gains: round(gains),
    yearlyBreakdown,
  }
}

// ==========================================================
// LUMPSUM FUTURE VALUE
// ==========================================================

export function simulateLumpsum(
  amount: number,
  annualReturnRate: number,
  years: number
) {
  const value =
    amount *
    Math.pow(1 + annualReturnRate / 100, years)

  return round(value)
}

// ==========================================================
// TARGET TIME ESTIMATION
// ==========================================================

export function monthsToTarget(
  initial: number,
  monthlyInvestment: number,
  annualReturnRate: number,
  target: number
) {
  const r = monthlyRate(annualReturnRate)

  let corpus = initial
  let months = 0

  while (corpus < target && months < 1200) {
    corpus = corpus * (1 + r) + monthlyInvestment
    months++
  }

  return months
}
