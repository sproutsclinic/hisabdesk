/* =========================================================
   HisabDesk — Loans Calculation Engine (Server Only)
   ---------------------------------------------------------
   PURE BUSINESS LOGIC

   PURPOSE
   - EMI math
   - amortization
   - outstanding balance
   - prepayment simulation
   - summary metrics

   USED BY
     ✓ service
     ✓ API routes
     ✓ AI advisor

   RULES
   ✅ deterministic
   ✅ pure functions only
   ✅ no DB
   ✅ no OpenAI
   ❌ no side effects

   ========================================================= */

import type {
  LoanRow,
  LoanComputed,
  LoanOverview,
  LoanSummary,
  PrepaymentSimulationResult,
} from "./types"

/* =========================================================
   HELPERS
   ========================================================= */

function clamp(n: number) {
  return Math.max(0, Number(n || 0))
}

function round(n: number) {
  return Math.round(n)
}

/* =========================================================
   EMI FORMULA
   ---------------------------------------------------------
   EMI = P * r * (1+r)^n / ((1+r)^n - 1)
   r = monthly rate
   ========================================================= */

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number,
): number {
  principal = clamp(principal)
  annualRate = clamp(annualRate)
  tenureMonths = clamp(tenureMonths)

  if (!principal || !tenureMonths) return 0

  const r = annualRate / 12 / 100

  if (r === 0) return principal / tenureMonths

  const numerator = principal * r * Math.pow(1 + r, tenureMonths)
  const denominator = Math.pow(1 + r, tenureMonths) - 1

  return numerator / denominator
}

/* =========================================================
   TOTAL PAYABLE
   ========================================================= */

function totalPayable(emi: number, months: number) {
  return emi * months
}

/* =========================================================
   OUTSTANDING PRINCIPAL
   ---------------------------------------------------------
   Using amortization formula
   ========================================================= */

function outstandingPrincipal(
  principal: number,
  annualRate: number,
  emi: number,
  paidMonths: number,
) {
  const r = annualRate / 12 / 100

  if (r === 0) {
    return principal - emi * paidMonths
  }

  const pow = Math.pow(1 + r, paidMonths)

  const balance =
    principal * pow - (emi * (pow - 1)) / r

  return clamp(balance)
}

/* =========================================================
   COMPUTE SINGLE LOAN
   ========================================================= */

export function computeLoan(row: LoanRow): LoanComputed {
  const principal = clamp(row.principal)
  const rate = clamp(row.interest_rate)
  const tenure = clamp(row.tenure_months)

  const emi = row.emi || calculateEMI(principal, rate, tenure)

  const total = totalPayable(emi, tenure)
  const interest = total - principal

  /* simplistic: assume from start date to today */
  const start = new Date(row.start_date)
  const now = new Date()

  const diffMonths =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth())

  const paidMonths = Math.min(Math.max(diffMonths, 0), tenure)

  const remainingMonths = tenure - paidMonths

  const outstanding = outstandingPrincipal(
    principal,
    rate,
    emi,
    paidMonths,
  )

  return {
    id: row.id,
    name: row.name,
    type: row.type,

    principal: round(principal),
    interestRate: rate,
    tenureMonths: tenure,

    emi: round(emi),

    totalPayable: round(total),
    totalInterest: round(interest),

    paidMonths,
    remainingMonths,

    outstandingPrincipal: round(outstanding),
  }
}

/* =========================================================
   OVERVIEW SUMMARY
   ========================================================= */

export function buildLoanOverview(
  rows: LoanRow[],
): LoanOverview {
  const loans = rows.map(computeLoan)

  const summary: LoanSummary = {
    totalOutstanding: 0,
    totalEMI: 0,
    totalInterestLeft: 0,
    activeLoans: loans.length,
  }

  for (const l of loans) {
    summary.totalOutstanding += l.outstandingPrincipal
    summary.totalEMI += l.emi
    summary.totalInterestLeft +=
      l.totalInterest *
      (l.remainingMonths / l.tenureMonths)
  }

  return {
    loans,
    summary: {
      totalOutstanding: round(summary.totalOutstanding),
      totalEMI: round(summary.totalEMI),
      totalInterestLeft: round(summary.totalInterestLeft),
      activeLoans: summary.activeLoans,
    },
  }
}

/* =========================================================
   PREPAYMENT SIMULATION
   ========================================================= */

export function simulatePrepayment(
  loan: LoanComputed,
  extraPayment: number,
): PrepaymentSimulationResult {
  extraPayment = clamp(extraPayment)

  if (!extraPayment) {
    return {
      newTenureMonths: loan.remainingMonths,
      interestSaved: 0,
      timeSavedMonths: 0,
    }
  }

  const monthlyPay = loan.emi + extraPayment

  let balance = loan.outstandingPrincipal
  let months = 0

  const r = loan.interestRate / 12 / 100

  let interestPaid = 0

  while (balance > 0 && months < 1000) {
    const interest = balance * r
    const principalPay = monthlyPay - interest

    balance -= principalPay
    interestPaid += interest

    months++
  }

  const originalInterestLeft =
    loan.totalInterest *
    (loan.remainingMonths / loan.tenureMonths)

  const interestSaved = originalInterestLeft - interestPaid

  return {
    newTenureMonths: months,
    interestSaved: round(interestSaved),
    timeSavedMonths: loan.remainingMonths - months,
  }
}
