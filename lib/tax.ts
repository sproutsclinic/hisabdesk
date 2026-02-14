// ==========================================================
// HisabDesk — Tax Engine (India • Enterprise Grade)
// Deterministic • Auditable • Slab-driven • Cess aware
// Production safe for fintech use
// ==========================================================

/* ==========================================================
   CONSTANTS
========================================================== */

const CESS_RATE = 0.04 // 4% health & education cess


/* ==========================================================
   UTILS
========================================================== */

function normalize(value: number): number {
  if (!value || value < 0) return 0
  return Math.round(value)
}

function roundTax(value: number): number {
  return Math.round(value)
}

function addCess(tax: number): number {
  return roundTax(tax + tax * CESS_RATE)
}


/* ==========================================================
   TYPES
========================================================== */

type Slab = {
  limit: number | null // null = infinity
  rate: number
}

export type TaxResult = {
  label: string
  taxable: number
  tax: number
}


/* ==========================================================
   GENERIC SLAB ENGINE
========================================================== */

function calculateFromSlabs(income: number, slabs: Slab[]): number {
  let remaining = normalize(income)
  let tax = 0

  for (const slab of slabs) {
    if (remaining <= 0) break

    const taxable =
      slab.limit === null
        ? remaining
        : Math.min(remaining, slab.limit)

    tax += taxable * slab.rate
    remaining -= taxable
  }

  return roundTax(tax)
}


/* ==========================================================
   OLD REGIME
========================================================== */

export function calculateOldRegimeTax(income: number): number {
  const slabs: Slab[] = [
    { limit: 250000, rate: 0 },
    { limit: 250000, rate: 0.05 },
    { limit: 500000, rate: 0.2 },
    { limit: null, rate: 0.3 },
  ]

  const baseTax = calculateFromSlabs(income, slabs)

  return addCess(baseTax)
}


/* ==========================================================
   NEW REGIME (2023+ structure)
   Includes 87A rebate logic
========================================================== */

export function calculateNewRegimeTax(income: number): number {
  const taxable = normalize(income)

  const slabs: Slab[] = [
    { limit: 300000, rate: 0 },
    { limit: 300000, rate: 0.05 },
    { limit: 300000, rate: 0.1 },
    { limit: 300000, rate: 0.15 },
    { limit: 300000, rate: 0.2 },
    { limit: null, rate: 0.3 },
  ]

  let tax = calculateFromSlabs(taxable, slabs)

  /* ===== 87A rebate (≤ 7L ⇒ zero tax) ===== */
  if (taxable <= 700000) tax = 0

  return addCess(tax)
}


/* ==========================================================
   SECTION 44ADA
   50% deemed profit for professionals
========================================================== */

export function calculate44ADA(income: number): number {
  return normalize(income) * 0.5
}


/* ==========================================================
   BEST OPTION (BACKWARD COMPATIBLE)
   returns smallest tax number
========================================================== */

export function getBestTaxOption(
  oldTax: number,
  newTax: number,
  adaTax: number
) {
  const values = [
    { label: "Old Regime", value: oldTax },
    { label: "New Regime", value: newTax },
    { label: "44ADA", value: adaTax },
  ]

  return values.reduce((min, curr) =>
    curr.value < min.value ? curr : min
  )
}


/* ==========================================================
   ENTERPRISE HELPER (NEW)
   returns structured result for dashboards
========================================================== */

export function compareTaxOptions(income: number): TaxResult {
  const taxable = normalize(income)

  const oldTax = calculateOldRegimeTax(taxable)
  const newTax = calculateNewRegimeTax(taxable)
  const adaTax = calculateOldRegimeTax(calculate44ADA(taxable))

  const options: TaxResult[] = [
    { label: "Old Regime", taxable, tax: oldTax },
    { label: "New Regime", taxable, tax: newTax },
    { label: "44ADA", taxable: calculate44ADA(taxable), tax: adaTax },
  ]

  return options.reduce((min, curr) =>
    curr.tax < min.tax ? curr : min
  )
}
