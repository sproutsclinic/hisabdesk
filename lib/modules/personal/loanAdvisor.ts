ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Loan Advisor (Personal Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   EMI math + payoff planning + prepayment savings analysis
//
// PURE LOGIC
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No DB
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No Supabase
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No AI
//   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ No UI
//
// Used by:
//   - loans page
//   - dashboard alerts
//   - AI loan advice context
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export interface LoanInput {
  principal: number
  annualRate: number // %
  tenureMonths: number
  emi?: number
}

export interface LoanSummary {
  emi: number
  totalPayment: number
  totalInterest: number
}

export interface PrepaymentResult {
  newTenureMonths: number
  interestSaved: number
  monthsSaved: number
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
// EMI CALCULATION
// ==========================================================

export function calculateEMI(
  principal: number,
  annualRate: number,
  months: number
) {
  const r = monthlyRate(annualRate)

  if (r === 0) return principal / months

  const emi =
    (principal * r * Math.pow(1 + r, months)) /
    (Math.pow(1 + r, months) - 1)

  return emi
}

// ==========================================================
// LOAN SUMMARY
// ==========================================================

export function summarizeLoan(input: LoanInput): LoanSummary {
  const emi =
    input.emi ??
    calculateEMI(
      input.principal,
      input.annualRate,
      input.tenureMonths
    )

  const totalPayment = emi * input.tenureMonths
  const totalInterest = totalPayment - input.principal

  return {
    emi: round(emi),
    totalPayment: round(totalPayment),
    totalInterest: round(totalInterest),
  }
}

// ==========================================================
// PREPAYMENT ANALYSIS
// Extra monthly amount ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ how much time + interest saved
// ==========================================================

export function analyzePrepayment(
  input: LoanInput,
  extraMonthlyPayment: number
): PrepaymentResult {
  const baseEMI =
    input.emi ??
    calculateEMI(
      input.principal,
      input.annualRate,
      input.tenureMonths
    )

  const newEMI = baseEMI + extraMonthlyPayment

  const r = monthlyRate(input.annualRate)

  let balance = input.principal
  let months = 0
  let totalPaid = 0

  while (balance > 0 && months < 1000) {
    const interest = balance * r
    const principalPaid = newEMI - interest

    balance -= principalPaid
    totalPaid += newEMI
    months++
  }

  const original = summarizeLoan(input)

  const newInterest = totalPaid - input.principal

  return {
    newTenureMonths: months,
    monthsSaved: input.tenureMonths - months,
    interestSaved: round(original.totalInterest - newInterest),
  }
}

// ==========================================================
// QUICK PAYOFF ESTIMATE
// ==========================================================

export function monthsToCloseLoan(
  principal: number,
  annualRate: number,
  monthlyPayment: number
) {
  const r = monthlyRate(annualRate)

  let balance = principal
  let months = 0

  while (balance > 0 && months < 1000) {
    const interest = balance * r
    const principalPaid = monthlyPayment - interest

    if (principalPaid <= 0) break

    balance -= principalPaid
    months++
  }

  return months
}
