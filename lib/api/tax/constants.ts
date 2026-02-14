/* =========================================================
   HisabDesk — Tax Constants (Single Source of Truth)
   ---------------------------------------------------------
   PURPOSE
   - Central place for:
       ✓ slabs
       ✓ limits
       ✓ cess
       ✓ financial years
   - Prevent magic numbers in engine/services
   - Easy yearly updates

   RULES
   ✅ constants only
   ❌ no logic
   ❌ no DB
   ❌ no AI
   ❌ no side effects

   Used by:
     calcEngine.ts
     UI labels
     reports
     future planners

   ========================================================= */

/* =========================================================
   GLOBAL
   ========================================================= */

export const TAX_CESS_RATE = 0.04

export const DEFAULT_FINANCIAL_YEAR = "2024-25"



/* =========================================================
   DEDUCTION LIMITS (Old Regime)
   ========================================================= */

export const LIMIT_80C = 150_000
export const LIMIT_80D = 25_000
export const LIMIT_80CCD = 50_000



/* =========================================================
   TAX SLABS
   ---------------------------------------------------------
   Format:
     { upto: number; rate: number }
   ========================================================= */

export interface TaxSlab {
  upto: number
  rate: number
}



/* =========================================================
   OLD REGIME SLABS
   ========================================================= */

export const OLD_REGIME_SLABS: TaxSlab[] = [
  { upto: 250_000, rate: 0 },
  { upto: 500_000, rate: 0.05 },
  { upto: 1_000_000, rate: 0.2 },
  { upto: Infinity, rate: 0.3 },
]



/* =========================================================
   NEW REGIME SLABS
   ========================================================= */

export const NEW_REGIME_SLABS: TaxSlab[] = [
  { upto: 300_000, rate: 0 },
  { upto: 600_000, rate: 0.05 },
  { upto: 900_000, rate: 0.1 },
  { upto: 1_200_000, rate: 0.15 },
  { upto: 1_500_000, rate: 0.2 },
  { upto: Infinity, rate: 0.3 },
]



/* =========================================================
   SUPPORTED EXPORT TYPES
   ========================================================= */

export const TAX_EXPORT_TYPES = {
  CSV: "csv",
  PDF: "pdf",
} as const

export type TaxExportType =
  (typeof TAX_EXPORT_TYPES)[keyof typeof TAX_EXPORT_TYPES]
