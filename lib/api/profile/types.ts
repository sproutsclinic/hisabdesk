ï»¿/* =========================================================
   HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Profile Types
   DOMAIN MODEL (Financial Identity + Preferences)
   ========================================================= */

/* =========================================================
   ENUMS
   ========================================================= */

export type RiskAppetite = "low" | "medium" | "high"

export type IncomeStability =
  | "salaried"
  | "business"
  | "freelancer"
  | "mixed"

/* =========================================================
   DB ROW (User Financial Identity)
   ========================================================= */

export interface ProfileRow {
  user_id: string

  /* ---------- Identity ---------- */

  full_name: string | null
  age: number | null

  /* ---------- Financial Behaviour ---------- */

  risk_appetite: RiskAppetite
  income_stability: IncomeStability

  monthly_income: number
  monthly_expense: number

  dependents: number

  /* ---------- Financial Goals ---------- */

  financial_goal: string | null
  income_goal: number | null
  savings_goal: number | null

  /* ---------- Preferences ---------- */

  currency: string                // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â FIXED (used in PreferencesCard)
  locale: string | null           // future-ready (en-IN etc.)

  notifications_enabled: boolean
  ai_enabled: boolean

  /* ---------- System ---------- */

  created_at: string
  updated_at: string
}

/* =========================================================
   UPDATE REQUEST
   ========================================================= */

export interface UpdateProfileRequest {
  full_name?: string
  age?: number

  risk_appetite?: RiskAppetite
  income_stability?: IncomeStability

  monthly_income?: number
  monthly_expense?: number

  dependents?: number

  financial_goal?: string
  income_goal?: number
  savings_goal?: number

  currency?: string
  locale?: string

  notifications_enabled?: boolean
  ai_enabled?: boolean
}

/* =========================================================
   RESPONSE MODEL
   ========================================================= */

export interface ProfileOverview {
  profile: ProfileRow
}
