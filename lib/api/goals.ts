// ==========================================================
// HisabDesk — Goals API Layer
// Wealth Planner (Goals, Retirement, FIRE targets)
// Used by: wealth-planner, dashboard, insights
// ==========================================================

import { createClient } from "@/lib/supabase"

const supabase = createClient()

// ==========================================================
// TYPES
// ==========================================================

export type GoalType =
  | "savings"
  | "retirement"
  | "fire"
  | "purchase"
  | "education"
  | "other"

export interface GoalInput {
  name: string
  type: GoalType
  target_amount: number
  current_amount?: number
  target_date?: string | null
  monthly_contribution?: number | null
  notes?: string | null
}

export interface GoalProgress {
  id: string
  name: string
  target: number
  current: number
  remaining: number
  percent: number
  monthsLeft: number | null
}

// ==========================================================
// CREATE
// ==========================================================

export async function createGoal(
  userId: string,
  input: GoalInput
) {
  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: userId,
      name: input.name,
      type: input.type,
      target_amount: input.target_amount,
      current_amount: input.current_amount ?? 0,
      target_date: input.target_date ?? null,
      monthly_contribution: input.monthly_contribution ?? null,
      notes: input.notes ?? null,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// UPDATE
// ==========================================================

export async function updateGoal(
  id: string,
  userId: string,
  input: Partial<GoalInput>
) {
  const { data, error } = await supabase
    .from("goals")
    .update(input)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// DELETE
// ==========================================================

export async function deleteGoal(id: string, userId: string) {
  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error

  return true
}

// ==========================================================
// GET SINGLE
// ==========================================================

export async function getGoal(id: string, userId: string) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// LIST
// ==========================================================

export async function listGoals(userId: string) {
  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data || []
}

// ==========================================================
// ADD PROGRESS (manual deposit)
// ==========================================================

export async function addGoalContribution(
  id: string,
  userId: string,
  amount: number
) {
  const goal = await getGoal(id, userId)

  const newAmount = (goal.current_amount || 0) + amount

  const { data, error } = await supabase
    .from("goals")
    .update({ current_amount: newAmount })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// PROGRESS CALCULATION
// ==========================================================

export async function getGoalProgress(
  userId: string
): Promise<GoalProgress[]> {
  const goals = await listGoals(userId)

  const today = new Date()

  return goals.map((g) => {
    const current = g.current_amount || 0
    const target = g.target_amount || 0

    const remaining = Math.max(0, target - current)

    const percent =
      target > 0 ? (current / target) * 100 : 0

    let monthsLeft: number | null = null

    if (g.target_date) {
      const targetDate = new Date(g.target_date)
      const diffMonths =
        (targetDate.getFullYear() - today.getFullYear()) * 12 +
        (targetDate.getMonth() - today.getMonth())

      monthsLeft = Math.max(0, diffMonths)
    }

    return {
      id: g.id,
      name: g.name,
      target,
      current,
      remaining,
      percent,
      monthsLeft,
    }
  })
}

// ==========================================================
// TOTAL GOALS SUMMARY
// Used by dashboard
// ==========================================================

export async function getGoalsSummary(userId: string) {
  const progress = await getGoalProgress(userId)

  let totalTarget = 0
  let totalCurrent = 0

  for (const g of progress) {
    totalTarget += g.target
    totalCurrent += g.current
  }

  return {
    totalTarget,
    totalCurrent,
    remaining: totalTarget - totalCurrent,
    percent:
      totalTarget > 0
        ? (totalCurrent / totalTarget) * 100
        : 0,
  }
}
