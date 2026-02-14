/* =========================================================
   HisabDesk — Loans Types
   ---------------------------------------------------------
   DOMAIN TYPES ONLY

   PURPOSE
   - Single source of truth for Loans module
   - Shared between:
       ✓ API routes
       ✓ service
       ✓ engine
       ✓ hooks
       ✓ UI

   RULES
   ✅ types only
   ❌ no logic
   ❌ no DB
   ❌ no AI
   ❌ no calculations

   ARCHITECTURE
     page → hook → route → service → engine → types (THIS FILE)

   ========================================================= */

/* =========================================================
   CORE
   ========================================================= */

export type LoanType =
  | "home"
  | "car"
  | "education"
  | "personal"
  | "credit_card"
  | "business"
  | "other"

/* =========================================================
   DB ROW
   ========================================================= */

export interface LoanRow {
  id: string
  user_id: string

  name: string
  type: LoanType

  principal: number
  interest_rate: number // annual %
  tenure_months: number

  start_date: string

  emi: number

  created_at: string
}

/* =========================================================
   REQUESTS
   ========================================================= */

export interface CreateLoanRequest {
  name: string
  type: LoanType

  principal: number
  interest_rate: number
  tenure_months: number

  start_date?: string
}

export interface UpdateLoanRequest {
  id: string

  name?: string
  type?: LoanType

  principal?: number
  interest_rate?: number
  tenure_months?: number

  start_date?: string
}

/* =========================================================
   COMPUTED (engine output)
   ========================================================= */

export interface LoanComputed {
  id: string
  name: string
  type: LoanType

  principal: number
  interestRate: number
  tenureMonths: number

  emi: number

  totalPayable: number
  totalInterest: number

  paidMonths: number
  remainingMonths: number

  outstandingPrincipal: number
}

/* =========================================================
   OVERVIEW
   ========================================================= */

export interface LoanSummary {
  totalOutstanding: number
  totalEMI: number
  totalInterestLeft: number
  activeLoans: number
}

export interface LoanOverview {
  loans: LoanComputed[]
  summary: LoanSummary
}

/* =========================================================
   EMI SIMULATION
   ========================================================= */

export interface PrepaymentSimulationInput {
  loanId: string
  extraPayment: number // monthly extra
}

export interface PrepaymentSimulationResult {
  newTenureMonths: number
  interestSaved: number
  timeSavedMonths: number
}
