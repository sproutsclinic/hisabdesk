/* =========================================================
   HisabDesk — Tax Validators
   ---------------------------------------------------------
   PURPOSE
   - Central validation + sanitization for Tax inputs
   - Used ONLY on server side (API layer / services)
   - Prevents:
       ✓ negative numbers
       ✓ NaN
       ✓ malformed payloads
       ✓ client tampering

   ARCHITECTURE
     route → validators → service → engine

   RULES
   ✅ Pure functions only
   ✅ No DB
   ✅ No AI
   ✅ No side effects
   ✅ Deterministic

   NEVER validate inside components or hooks

   ========================================================= */

import type {
  TaxProfileInput,
  IncomeInput,
  DeductionInput,
} from "./types"

/* =========================================================
   HELPERS
   ========================================================= */

function toNumber(value: unknown): number {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return n
}

function nonNegative(value: unknown): number {
  return Math.max(0, Math.floor(toNumber(value)))
}

function clampAge(age: unknown): number {
  const n = nonNegative(age)

  if (n < 18) return 18
  if (n > 120) return 120

  return n
}

/* =========================================================
   INCOME
   ========================================================= */

export function sanitizeIncome(input: Partial<IncomeInput> = {}): IncomeInput {
  return {
    salary: nonNegative(input.salary),
    business: nonNegative(input.business),
    capitalGains: nonNegative(input.capitalGains),
    other: nonNegative(input.other),
  }
}

/* =========================================================
   DEDUCTIONS
   ========================================================= */

export function sanitizeDeductions(
  input: Partial<DeductionInput> = {},
): DeductionInput {
  return {
    section80C: nonNegative(input.section80C),
    section80D: nonNegative(input.section80D),
    section80CCD: nonNegative(input.section80CCD),
    hra: nonNegative(input.hra),
    homeLoanInterest: nonNegative(input.homeLoanInterest),
    other: nonNegative(input.other),
  }
}

/* =========================================================
   FULL PROFILE INPUT
   ========================================================= */

export function sanitizeTaxProfileInput(
  input: Partial<TaxProfileInput>,
): TaxProfileInput {
  return {
    age: clampAge(input.age),
    filingStatus: input.filingStatus ?? "individual",
    income: sanitizeIncome(input.income),
    deductions: sanitizeDeductions(input.deductions),
  }
}

/* =========================================================
   LIGHT VALIDATION (optional guards)
   ========================================================= */

export function hasIncome(i: IncomeInput): boolean {
  return (
    i.salary > 0 ||
    i.business > 0 ||
    i.capitalGains > 0 ||
    i.other > 0
  )
}

export function hasDeductions(d: DeductionInput): boolean {
  return (
    d.section80C > 0 ||
    d.section80D > 0 ||
    d.section80CCD > 0 ||
    d.hra > 0 ||
    d.homeLoanInterest > 0 ||
    d.other > 0
  )
}
