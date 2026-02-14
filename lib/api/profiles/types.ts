/* =========================================================
   HisabDesk — Profile Types
   ---------------------------------------------------------
   DOMAIN TYPES ONLY

   PURPOSE
   - Single source of truth for Profile module
   - Shared by:
       ✓ API routes
       ✓ service
       ✓ hooks
       ✓ UI

   PROFILE CONCEPT
   - User preferences
   - Risk appetite
   - Dependents
   - Goals
   - Used by AI + planning modules

   RULES
   ✅ types only
   ❌ no logic
   ❌ no DB
   ❌ no calculations
   ❌ no AI

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
   DB ROW
   ========================================================= */

export interface ProfileRow {
  user_id: string

  full_name: string | null
  age: number | null

  risk_appetite: RiskAppetite
  income_stability: IncomeStability

  monthly_income: number
  monthly_expense: number

  dependents: number

  financial_goal: string | null

  created_at: string
  updated_at: string
}

/* =========================================================
   REQUESTS
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
}

/* =========================================================
   RESPONSE MODEL
   ========================================================= */

export interface ProfileOverview {
  profile: ProfileRow
}
