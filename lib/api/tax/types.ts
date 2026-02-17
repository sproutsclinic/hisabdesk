ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Tax Domain Types
   ---------------------------------------------------------
   CENTRAL SOURCE OF TRUTH FOR TAX TYPES

   Rules:
   - Pure types only
   - No logic
   - Shared across:
       lib/api/tax/*
       app/api/tax/*
       hooks/*
       AI routes
   - Prevents duplication between server + client

   ========================================================= */

/* =========================================================
   ENUMS
   ========================================================= */

export type TaxRegime = "old" | "new"

export type FilingStatus = "individual" | "business" | "freelancer"

/* =========================================================
   INCOME MODELS
   ========================================================= */

export interface IncomeInput {
  salary: number
  business: number
  capitalGains: number
  other: number
}

/* =========================================================
   DEDUCTIONS (Old regime primarily)
   ========================================================= */

export interface DeductionInput {
  section80C: number
  section80D: number
  section80CCD: number
  hra: number
  homeLoanInterest: number
  other: number
}

/* =========================================================
   PROFILE INPUT (from UI/forms)
   ========================================================= */

export interface TaxProfileInput {
  age: number
  filingStatus: FilingStatus
  income: IncomeInput
  deductions: DeductionInput
}

/* =========================================================
   BREAKDOWN STRUCTURES
   ========================================================= */

export interface TaxBreakdown {
  regime: TaxRegime
  grossIncome: number
  taxableIncome: number
  totalDeductions: number
  taxBeforeCess: number
  cess: number
  totalTax: number
  effectiveRate: number
}

/* =========================================================
   ENGINE OUTPUT
   ========================================================= */

export interface TaxComputationResult {
  oldRegime: TaxBreakdown
  newRegime: TaxBreakdown
  recommended: TaxRegime
  savings: number
}

/* =========================================================
   DB MODELS (Supabase tables)
   ========================================================= */

/*
   tax_profiles
   -------------
   One per user
*/

export interface TaxProfileRow {
  id: string
  user_id: string

  age: number
  filing_status: FilingStatus

  created_at: string
  updated_at: string
}

/*
   tax_calculations
   ----------------
   History of runs (auditable)
*/

export interface TaxCalculationRow {
  id: string
  user_id: string

  financial_year: string

  income: IncomeInput
  deductions: DeductionInput

  result: TaxComputationResult

  recommended_regime: TaxRegime
  total_tax: number

  created_at: string
}

/* =========================================================
   API REQUEST / RESPONSE SHAPES
   ========================================================= */

export interface CalculateTaxRequest {
  income: IncomeInput
  deductions: DeductionInput
  age: number
  filingStatus: FilingStatus
  financialYear: string
}

export interface CalculateTaxResponse {
  result: TaxComputationResult
}

/* =========================================================
   EXPORT HELPERS (reports)
   ========================================================= */

export interface TaxReportRow {
  label: string
  value: number | string
}
