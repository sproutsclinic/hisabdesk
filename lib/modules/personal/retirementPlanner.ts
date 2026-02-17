ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Retirement Planner (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Retirement corpus planning + monthly SIP requirement
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
//
// Used by:
//   - wealth-planner page
//   - dashboard retirement preview
//   - AI planner advice
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface RetirementInput {
  currentAge: number
  retirementAge: number
  lifeExpectancy: number

  currentSavings: number
  monthlyInvestment: number

  currentMonthlyExpense: number
  inflationRate: number // annual %
  expectedReturnRate: number // annual %
}

export interface RetirementResult {
  retirementCorpusRequired: number
  projectedCorpus: number

  monthlyInvestmentRequired: number
  shortfall: number

  yearsLeft: number
  monthsLeft: number

  ready: boolean
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
  annualRate: number,
  months: number
) {
  const r = monthlyRate(annualRate)

  if (r === 0) return principal + monthlyContribution * months

  const fvPrincipal = principal * Math.pow(1 + r, months)

  const fvContribution =
    monthlyContribution *
    ((Math.pow(1 + r, months) - 1) / r)

  return fvPrincipal + fvContribution
}

function inflate(
  value: number,
  inflationRate: number,
  years: number
) {
  return value * Math.pow(1 + inflationRate / 100, years)
}

function round(n: number) {
  return Math.round(n)
}

// ==========================================================
// CORE CALCULATION
// ==========================================================

export function calculateRetirementPlan(
  input: RetirementInput
): RetirementResult {
  const yearsLeft = Math.max(
    0,
    input.retirementAge - input.currentAge
  )

  const monthsLeft = yearsLeft * 12

  // Expense at retirement (inflation adjusted)
  const inflatedMonthlyExpense = inflate(
    input.currentMonthlyExpense,
    input.inflationRate,
    yearsLeft
  )

  const retirementYears =
    input.lifeExpectancy - input.retirementAge

  const retirementMonths = retirementYears * 12

  // Required corpus at retirement
  // simple rule: present value of monthly withdrawals
  const r = monthlyRate(input.expectedReturnRate)

  let retirementCorpusRequired = 0

  if (r === 0) {
    retirementCorpusRequired =
      inflatedMonthlyExpense * retirementMonths
  } else {
    retirementCorpusRequired =
      inflatedMonthlyExpense *
      ((1 - Math.pow(1 + r, -retirementMonths)) / r)
  }

  // projected corpus from current SIP
  const projectedCorpus = futureValue(
    input.currentSavings,
    input.monthlyInvestment,
    input.expectedReturnRate,
    monthsLeft
  )

  const shortfall = Math.max(
    0,
    retirementCorpusRequired - projectedCorpus
  )

  let monthlyInvestmentRequired = input.monthlyInvestment

  if (shortfall > 0 && monthsLeft > 0) {
    const rm = monthlyRate(input.expectedReturnRate)

    if (rm === 0) {
      monthlyInvestmentRequired = shortfall / monthsLeft
    } else {
      monthlyInvestmentRequired =
        (shortfall * rm) /
        (Math.pow(1 + rm, monthsLeft) - 1)
    }
  }

  return {
    retirementCorpusRequired: round(retirementCorpusRequired),
    projectedCorpus: round(projectedCorpus),
    monthlyInvestmentRequired: round(monthlyInvestmentRequired),
    shortfall: round(shortfall),
    yearsLeft,
    monthsLeft,
    ready: projectedCorpus >= retirementCorpusRequired,
  }
}
