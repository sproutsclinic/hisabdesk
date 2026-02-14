/* =========================================================
   HisabDesk — Automation Types
   ---------------------------------------------------------
   DOMAIN TYPES ONLY

   PURPOSE
   - Single source of truth for Automation module
   - Shared by:
       ✓ API routes
       ✓ service
       ✓ engine
       ✓ hooks
       ✓ UI

   AUTOMATION CONCEPT
   - Recurring rules
   - Generates transactions automatically
   - Works on top of SINGLE SOURCE OF TRUTH:
       → transactions table

   RULES
   ✅ types only
   ❌ no logic
   ❌ no DB
   ❌ no calculations
   ❌ no AI

   ========================================================= */

/* =========================================================
   CORE
   ========================================================= */

export type AutomationType = "income" | "expense"

export type AutomationFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"

/* =========================================================
   DB ROW
   ========================================================= */

export interface AutomationRuleRow {
  id: string
  user_id: string

  name: string
  type: AutomationType

  amount: number
  category: string

  frequency: AutomationFrequency

  start_date: string
  last_run_at: string | null

  active: boolean

  created_at: string
}

/* =========================================================
   REQUESTS
   ========================================================= */

export interface CreateAutomationRuleRequest {
  name: string
  type: AutomationType

  amount: number
  category: string

  frequency: AutomationFrequency
  start_date: string
}

export interface UpdateAutomationRuleRequest {
  id: string

  name?: string
  type?: AutomationType

  amount?: number
  category?: string

  frequency?: AutomationFrequency
  start_date?: string

  active?: boolean
}

/* =========================================================
   COMPUTED (engine output)
   ========================================================= */

export interface AutomationRuleComputed
  extends AutomationRuleRow {
  nextRunAt: string
}

/* =========================================================
   OVERVIEW
   ========================================================= */

export interface AutomationOverview {
  rules: AutomationRuleComputed[]

  summary: {
    activeRules: number
    monthlyIncome: number
    monthlyExpense: number
    netMonthlyImpact: number
  }
}
