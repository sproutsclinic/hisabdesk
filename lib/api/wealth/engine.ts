ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Wealth Engine (PURE DOMAIN ENGINE)
   ---------------------------------------------------------
   Deterministic financial projection engine.

   PURPOSE
   - Long-term wealth forecasting
   - SIP growth simulation
   - Retirement corpus estimation
   - Goal feasibility checks

   RULES
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Pure functions only
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ No DB / network / AI calls
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ No floating point drift (scaled math)
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Fully testable
   ========================================================= */

import type {
  WealthInput,
  WealthProjectionPoint,
  WealthProjectionResult,
  RetirementResult,
} from "./types"

/* =========================================================
   Precision Utilities (ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ safe arithmetic)
   ========================================================= */

const SCALE = 100

function toPaise(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.round(value * SCALE)
}

function fromPaise(value: number): number {
  return Number((value / SCALE).toFixed(2))
}

function monthlyRate(annualRatePct: number): number {
  return annualRatePct / 100 / 12
}

/* =========================================================
   SIP Future Value (Compounded Monthly)
   FV = P * [((1+r)^n - 1) / r]
   ========================================================= */

export function computeSIPFutureValue(
  monthlyInvestment: number,
  annualReturnPct: number,
  years: number,
): number {
  const P = toPaise(monthlyInvestment)
  const r = monthlyRate(annualReturnPct)
  const n = years * 12

  if (r === 0) return fromPaise(P * n)

  const factor = (Math.pow(1 + r, n) - 1) / r

  const futureValue = P * factor

  return fromPaise(Math.round(futureValue))
}

/* =========================================================
   Lump Sum Growth
   FV = PV * (1+r)^n
   ========================================================= */

export function computeLumpSumFutureValue(
  principal: number,
  annualReturnPct: number,
  years: number,
): number {
  const PV = toPaise(principal)
  const r = annualReturnPct / 100
  const n = years

  const fv = PV * Math.pow(1 + r, n)

  return fromPaise(Math.round(fv))
}

/* =========================================================
   Year-by-Year Wealth Projection
   Used for charts / AI interpretation
   ========================================================= */

export function projectWealthPath(input: WealthInput): WealthProjectionResult {
  const {
    currentSavings,
    monthlyInvestment,
    expectedReturnPct,
    years,
  } = input

  const points: WealthProjectionPoint[] = []

  let accumulated = toPaise(currentSavings)

  for (let year = 1; year <= years; year++) {
    const yearlyFV = computeSIPFutureValue(
      monthlyInvestment,
      expectedReturnPct,
      1,
    )

    const grownExisting = computeLumpSumFutureValue(
      fromPaise(accumulated),
      expectedReturnPct,
      1,
    )

    accumulated = toPaise(grownExisting + yearlyFV)

    points.push({
      year,
      value: fromPaise(accumulated),
    })
  }

  return {
    finalValue: fromPaise(accumulated),
    timeline: points,
  }
}

/* =========================================================
   Retirement Corpus Estimation (4% Rule Approximation)
   Required corpus = Annual Expense ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â 25
   ========================================================= */

export function estimateRetirementNeeds(
  currentMonthlyExpense: number,
  inflationPct: number,
  yearsToRetirement: number,
): RetirementResult {
  const annualExpenseToday = currentMonthlyExpense * 12

  const inflatedExpense =
    annualExpenseToday *
    Math.pow(1 + inflationPct / 100, yearsToRetirement)

  const requiredCorpus = inflatedExpense * 25

  return {
    inflationAdjustedAnnualExpense: Number(inflatedExpense.toFixed(2)),
    requiredCorpus: Number(requiredCorpus.toFixed(2)),
  }
}

/* =========================================================
   Goal Feasibility Check
   ========================================================= */

export function evaluateGoalReadiness(
  projectedWealth: number,
  requiredCorpus: number,
) {
  if (requiredCorpus === 0) {
    return {
      fundedRatio: 0,
      status: "insufficient" as const,
    }
  }

  const ratio = projectedWealth / requiredCorpus

  let status: "underfunded" | "on-track" | "surplus"

  if (ratio < 0.75) status = "underfunded"
  else if (ratio <= 1.25) status = "on-track"
  else status = "surplus"

  return {
    fundedRatio: Number(ratio.toFixed(2)),
    status,
  }
}
