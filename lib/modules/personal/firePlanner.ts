// ==========================================================
// HisabDesk — FIRE Planner (Personal Business Logic ONLY)
// ----------------------------------------------------------
// FIRE = Financial Independence Retire Early
//
// PURE LOGIC FILE
//   ❌ No DB
//   ❌ No Supabase
//   ❌ No AI
//   ❌ No UI
//
// Used by:
//   - wealth-planner page
//   - dashboard projections
//   - AI planner advice
//
// Deterministic math only
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface FIREInput {
  currentAge: number
  retirementAge: number

  currentSavings: number
  monthlyInvestment: number

  expectedReturnRate: number // annual % (ex: 10)
  annualExpenses: number

  withdrawalRate?: number // default 4%
}

export interface FIREResult {
  fireNumber: number
  yearsToRetire: number
  monthsToRetire: number

  projectedCorpus: number
  monthlyInvestmentRequired: number

  shortfall: number
  canRetireOnTime: boolean
}

// ==========================================================
// HELPERS
// ==========================================================

function monthlyRate(annualRate: number) {
  return annualRate / 12 / 100
}

function futureValue(
  principal: number,
  monthlyContribution: number,
  rate: number,
  months: number
) {
  const r = monthlyRate(rate)

  if (r === 0) {
    return principal + monthlyContribution * months
  }

  const fvPrincipal = principal * Math.pow(1 + r, months)

  const fvContribution =
    monthlyContribution *
    ((Math.pow(1 + r, months) - 1) / r)

  return fvPrincipal + fvContribution
}

function round(n: number) {
  return Math.round(n)
}

// ==========================================================
// FIRE NUMBER
// Rule: expenses / withdrawal rate
// Example: 4% rule → 25x expenses
// ==========================================================

export function calculateFireNumber(
  annualExpenses: number,
  withdrawalRate = 4
) {
  return annualExpenses / (withdrawalRate / 100)
}

// ==========================================================
// MAIN FIRE CALCULATION
// ==========================================================

export function calculateFIRE(input: FIREInput): FIREResult {
  const withdrawalRate = input.withdrawalRate ?? 4

  const fireNumber = calculateFireNumber(
    input.annualExpenses,
    withdrawalRate
  )

  const yearsToRetire = Math.max(
    0,
    input.retirementAge - input.currentAge
  )

  const monthsToRetire = yearsToRetire * 12

  const projectedCorpus = futureValue(
    input.currentSavings,
    input.monthlyInvestment,
    input.expectedReturnRate,
    monthsToRetire
  )

  const shortfall = Math.max(0, fireNumber - projectedCorpus)

  // required SIP if shortfall exists
  let monthlyInvestmentRequired = input.monthlyInvestment

  if (shortfall > 0 && monthsToRetire > 0) {
    const r = monthlyRate(input.expectedReturnRate)

    if (r === 0) {
      monthlyInvestmentRequired =
        shortfall / monthsToRetire
    } else {
      monthlyInvestmentRequired =
        (shortfall * r) /
        (Math.pow(1 + r, monthsToRetire) - 1)
    }
  }

  return {
    fireNumber: round(fireNumber),
    yearsToRetire,
    monthsToRetire,
    projectedCorpus: round(projectedCorpus),
    monthlyInvestmentRequired: round(monthlyInvestmentRequired),
    shortfall: round(shortfall),
    canRetireOnTime: projectedCorpus >= fireNumber,
  }
}

// ==========================================================
// TIME TO FIRE (given current SIP)
// ==========================================================

export function estimateMonthsToFire(
  currentSavings: number,
  monthlyInvestment: number,
  annualReturnRate: number,
  targetCorpus: number
) {
  const r = monthlyRate(annualReturnRate)

  let months = 0
  let corpus = currentSavings

  while (corpus < targetCorpus && months < 1200) {
    corpus = futureValue(corpus, monthlyInvestment, annualReturnRate, 1)
    months++
  }

  return months
}
