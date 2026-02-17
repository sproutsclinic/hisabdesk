ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Tax Module Public Exports (ARCHITECTURE SAFE)
   ---------------------------------------------------------
   This file preserves DOMAIN NAMING expected by services
   while mapping to Supabase-generated DB types.

   DO NOT remove aliases ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â they are the boundary between:
     Domain Language  ?  Database Language
   ========================================================= */

/* =======================
   TYPES (DB ? DOMAIN ALIAS)
   ======================= */

export type {
  DeductionInput,
  TaxComputationResult
} from "./types"

/*
  Supabase renamed TaxProfile ? TaxProfileRow.
  We expose the DOMAIN name expected by architecture.
*/
export type { TaxProfileRow as TaxProfile } from "./types"


/* =======================
   ENGINE (pure computation)
   ======================= */

export * from "./calcEngine"


/* =======================
   SERVICE (DB layer)
   ======================= */

export * from "./service"


/* =======================
   REPORT / EXPORT
   ======================= */

export * from "./report"
export * from "./pdf"


/* =======================
   VALIDATORS
   ======================= */

export * from "./validators"
