/* =========================================================
   HisabDesk — Tax Module Public Exports (Barrel)
   ---------------------------------------------------------
   PURPOSE
   - Single entry point for all Tax server/domain imports
   - Cleaner imports across project
   - Prevents deep relative paths
   - Enterprise modular boundary

   WHY
   Before:
     import { calculateTax } from "@/lib/api/tax/calcEngine"
     import { buildTaxCSV } from "@/lib/api/tax/report"
     import { sanitizeTaxProfileInput } from "@/lib/api/tax/validators"

   After:
     import { calculateTax, buildTaxCSV, sanitizeTaxProfileInput }
       from "@/lib/api/tax"

   RULES
   ✅ exports only
   ❌ no logic
   ❌ no side effects
   ❌ no DB

   ARCHITECTURE LAYER
     lib/api/tax/*
       ↑
     this file (public surface)

   ========================================================= */

/* =========================================================
   TYPES
   ========================================================= */

export * from "./types"

/* =========================================================
   ENGINE (pure computation)
   ========================================================= */

export * from "./calcEngine"

/* =========================================================
   SERVICE (DB layer)
   ========================================================= */

export * from "./service"

/* =========================================================
   REPORT / EXPORT
   ========================================================= */

export * from "./report"
export * from "./pdf"

/* =========================================================
   VALIDATORS
   ========================================================= */

export * from "./validators"
