/* =========================================================
   HisabDesk — Tax Calculation Engine (Server Only)
   ---------------------------------------------------------
   PURE BUSINESS LOGIC
   ❌ No Supabase
   ❌ No OpenAI
   ❌ No client code
   ❌ No side effects

   Safe to import inside:
   - app/api/tax/*
   - lib/api/tax/*
   - AI routes

   Single responsibility:
   → deterministic Indian income-tax computation

   ========================================================= */

/* =========================================================
   IMPORT CONSTANTS (NEW — single source of truth)
   ========================================================= */

import {
  TAX_CESS_RATE,
  OLD_REGIME_SLABS,
  NEW_REGIME_SLABS,
} from "./constants"

export type TaxRegime = "old" | "new"

/* =========================================================
   INPUT MODELS
   ========================================================= */

export interface IncomeInput {
  salary: number
  business: number
  capitalGains: number
  other: number
}

export interface DeductionInput {
  section80C: number
  section80D: number
  section80CCD: number
  hra: number
  homeLoanInterest: number
  other: number
}

export interface TaxProfileInput {
  age: number
  income: IncomeInput
  deductions: DeductionInput
}

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

export interface TaxComputationResult {
  oldRegime: TaxBreakdown
  newRegime: TaxBreakdown
  recommended: TaxRegime
  savings: number
}

/* =========================================================
   HELPERS
   ========================================================= */

function clamp(n: number): number {
  return Math.max(0, Math.floor(n || 0))
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + clamp(b), 0)
}

function computeSlabTax(
  income: number,
  slabs: { upto: number; rate: number }[],
) {
  let remaining = income
  let previousLimit = 0
  let tax = 0

  for (const slab of slabs) {
    const slabWidth = slab.upto - previousLimit
    const taxable = Math.min(remaining, slabWidth)

    if (taxable <= 0) break

    tax += taxable * slab.rate
    remaining -= taxable
    previousLimit = slab.upto
  }

  return tax
}

/* =========================================================
   DEDUCTION LOGIC
   ========================================================= */

function computeOldRegimeDeductions(d: DeductionInput): number {
  return sum([
    Math.min(clamp(d.section80C), 150_000),
    Math.min(clamp(d.section80D), 25_000),
    Math.min(clamp(d.section80CCD), 50_000),
    clamp(d.hra),
    clamp(d.homeLoanInterest),
    clamp(d.other),
  ])
}

/*
   New regime:
   most deductions removed
   keep minimal for now (future proof)
*/
function computeNewRegimeDeductions(): number {
  return 0
}

/* =========================================================
   CORE ENGINE
   ========================================================= */

function computeBreakdown(
  regime: TaxRegime,
  grossIncome: number,
  deductions: number,
  slabs: { upto: number; rate: number }[],
): TaxBreakdown {
  const taxableIncome = Math.max(0, grossIncome - deductions)

  const taxBeforeCess = computeSlabTax(taxableIncome, slabs)

  const cess = taxBeforeCess * TAX_CESS_RATE

  const totalTax = taxBeforeCess + cess

  const effectiveRate =
    grossIncome > 0 ? Number((totalTax / grossIncome).toFixed(4)) : 0

  return {
    regime,
    grossIncome,
    taxableIncome,
    totalDeductions: deductions,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveRate,
  }
}

/* =========================================================
   PUBLIC API
   ========================================================= */

export function calculateTax(
  input: TaxProfileInput,
): TaxComputationResult {
  const grossIncome = sum([
    input.income.salary,
    input.income.business,
    input.income.capitalGains,
    input.income.other,
  ])

  /* ---------- OLD ---------- */
  const oldDeductions = computeOldRegimeDeductions(input.deductions)

  const oldBreakdown = computeBreakdown(
    "old",
    grossIncome,
    oldDeductions,
    OLD_REGIME_SLABS,
  )

  /* ---------- NEW ---------- */
  const newDeductions = computeNewRegimeDeductions()

  const newBreakdown = computeBreakdown(
    "new",
    grossIncome,
    newDeductions,
    NEW_REGIME_SLABS,
  )

  /* ---------- RECOMMEND ---------- */
  const recommended =
    oldBreakdown.totalTax <= newBreakdown.totalTax ? "old" : "new"

  const savings = Math.abs(
    oldBreakdown.totalTax - newBreakdown.totalTax,
  )

  return {
    oldRegime: oldBreakdown,
    newRegime: newBreakdown,
    recommended,
    savings,
  }
}

/* =========================================================
   UTILITIES (for API/UI convenience)
   ========================================================= */

export function formatCurrency(value: number): number {
  return Math.round(value)
}

export function percentage(value: number): number {
  return Number((value * 100).toFixed(2))
}
