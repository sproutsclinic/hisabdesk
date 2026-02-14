/* =========================================================
   HisabDesk — Bills Types
   ---------------------------------------------------------
   DOMAIN TYPES ONLY
   Single source of truth for Bills module

   Used by:
   ✓ API
   ✓ service
   ✓ engine
   ✓ hooks
   ✓ UI

   ❌ no logic
   ========================================================= */

export type BillFrequency =
  | "monthly"
  | "quarterly"
  | "yearly"

export type BillCategory =
  | "rent"
  | "utilities"
  | "internet"
  | "insurance"
  | "subscription"
  | "emi"
  | "other"

/* =========================================================
   DB ROW
   ========================================================= */

export interface BillRow {
  id: string
  user_id: string

  name: string
  amount: number
  category: BillCategory

  frequency: BillFrequency

  due_day: number            // 1–31
  auto_pay: boolean

  active: boolean

  created_at: string
}

/* =========================================================
   REQUESTS
   ========================================================= */

export interface CreateBillRequest {
  name: string
  amount: number
  category: BillCategory
  frequency: BillFrequency
  due_day: number
  auto_pay: boolean
}

export interface UpdateBillRequest {
  id: string

  name?: string
  amount?: number
  category?: BillCategory
  frequency?: BillFrequency
  due_day?: number
  auto_pay?: boolean
  active?: boolean
}

/* =========================================================
   COMPUTED (engine output)
   ========================================================= */

export interface BillComputed extends BillRow {
  nextDueDate: string
  daysLeft: number
}

/* =========================================================
   OVERVIEW
   ========================================================= */

export interface BillsOverview {
  bills: BillComputed[]

  summary: {
    totalMonthly: number
    upcomingThisMonth: number
    autoPayCount: number
    activeBills: number
  }
}
