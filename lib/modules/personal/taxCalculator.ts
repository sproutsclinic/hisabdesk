// ==========================================================
// HisabDesk — Personal Tax Calculator (Business Logic ONLY)
// ----------------------------------------------------------
// PURPOSE
//   Pure Indian income-tax calculations
//   NO database
//   NO Supabase
//   NO AI
//   NO UI
//
// Used by:
//   - tax page
//   - AI tax optimizer
//   - dashboard preview
//
// This file MUST stay pure + deterministic
// ==========================================================

// ==========================================================
// TYPES
// ==========================================================

export type TaxRegime = "old" | "new"

export interface TaxInput {
  annualIncome: number
  deductions80C?: number
  deductions80D?: number
  hraExemption?: number
  homeLoanInterest?: number
  otherDeductions?: number
}

export interface TaxResult {
  taxableIncome: number
  taxBeforeCess: number
  cess: number
  totalTax: number
  effectiveRate: number
}

// ==========================================================
// CONSTANTS (India FY slabs — can update yearly)
// ==========================================================

// ---------- OLD REGIME ----------
const OLD_SLABS = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 0.05 },
  { upto: 1000000, rate: 0.2 },
  { upto: Infinity, rate: 0.3 },
]

// ---------- NEW REGIME (modern slabs) ----------
const NEW_SLABS = [
  { upto: 300000, rate: 0 },
  { upto: 600000, rate: 0.05 },
  { upto: 900000, rate: 0.1 },
  { upto: 1200000, rate: 0.15 },
  { upto: 1500000, rate: 0.2 },
  { upto: Infinity, rate: 0.3 },
]

const CESS_RATE = 0.04

// ==========================================================
// HELPERS
// ==========================================================

function applySlabs(income: number, slabs: typeof OLD_SLABS) {
  let remaining = income
  let prevLimit = 0
  let tax = 0

  for (const slab of slabs) {
    const slabAmount = Math.min(remaining, slab.upto - prevLimit)

    if (slabAmount <= 0) break

    tax += slabAmount * slab.rate

    remaining -= slabAmount
    prevLimit = slab.upto
  }

  return tax
}

function clamp(value: number) {
  return Math.max(0, value)
}

// ==========================================================
// OLD REGIME CALCULATION
// ==========================================================

export function calculateOldRegimeTax(input: TaxInput): TaxResult {
  const deductions =
    (input.deductions80C || 0) +
    (input.deductions80D || 0) +
    (input.hraExemption || 0) +
    (input.homeLoanInterest || 0) +
    (input.otherDeductions || 0)

  const taxableIncome = clamp(input.annualIncome - deductions)

  const taxBeforeCess = applySlabs(taxableIncome, OLD_SLABS)

  const cess = taxBeforeCess * CESS_RATE
  const totalTax = taxBeforeCess + cess

  return {
    taxableIncome,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveRate:
      input.annualIncome > 0
        ? (totalTax / input.annualIncome) * 100
        : 0,
  }
}

// ==========================================================
// NEW REGIME CALCULATION
// ==========================================================

export function calculateNewRegimeTax(input: TaxInput): TaxResult {
  // New regime usually ignores deductions
  const taxableIncome = clamp(input.annualIncome)

  const taxBeforeCess = applySlabs(taxableIncome, NEW_SLABS)

  const cess = taxBeforeCess * CESS_RATE
  const totalTax = taxBeforeCess + cess

  return {
    taxableIncome,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveRate:
      input.annualIncome > 0
        ? (totalTax / input.annualIncome) * 100
        : 0,
  }
}

// ==========================================================
// COMPARE BOTH REGIMES
// ==========================================================

export function compareTaxRegimes(input: TaxInput) {
  const oldResult = calculateOldRegimeTax(input)
  const newResult = calculateNewRegimeTax(input)

  const better: TaxRegime =
    oldResult.totalTax <= newResult.totalTax ? "old" : "new"

  const savings = Math.abs(
    oldResult.totalTax - newResult.totalTax
  )

  return {
    old: oldResult,
    new: newResult,
    better,
    savings,
  }
}
