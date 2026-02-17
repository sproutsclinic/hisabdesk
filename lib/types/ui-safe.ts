ï»¿/* =========================================================
   UI Safe Types
   ---------------------------------------------------------
   These loosen strict domain contracts ONLY at UI boundary.
   Prevents Next.js strict-mode build failures.
   ========================================================= */

export type Nullable<T> = T | null | undefined

export type UINumber = number | null | undefined
export type UIString = string | null | undefined
