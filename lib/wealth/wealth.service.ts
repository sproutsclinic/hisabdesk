ï»¿import { getSupabaseClient } from "@/lib/supabase"

const TABLE = "wealth_goals"


// ==========================================================
// GET ALL GOALS
// ==========================================================

export async function getGoals(userId: string) {
  const supabase = getSupabaseClient()

  return supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
}


// ==========================================================
// CREATE
// ==========================================================

export async function createGoal(payload: any) {
  const supabase = getSupabaseClient()

  return supabase
    .from(TABLE)
    .insert(payload)
}


// ==========================================================
// UPDATE
// ==========================================================

export async function updateGoal(id: string, payload: any) {
  const supabase = getSupabaseClient()

  return supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
}


// ==========================================================
// DELETE
// ==========================================================

export async function deleteGoalById(id: string) {
  const supabase = getSupabaseClient()

  return supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
}
