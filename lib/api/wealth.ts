ï»¿"use server"

// ==========================================================
// Wealth Goals API (Supabase)
// Uses your existing lib/supabase.ts
// ==========================================================

import { getSupabaseServer } from "@/lib/supabase"

const TABLE = "wealth_goals"


// ==========================================================
// GET ALL
// ==========================================================

export async function getGoals() {
  const supabase = getSupabaseServer()

  const { data } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: true })

  return data || []
}


// ==========================================================
// CREATE
// ==========================================================

export async function createGoal(payload: any) {
  const supabase = getSupabaseServer()

  await supabase.from(TABLE).insert(payload)
}


// ==========================================================
// UPDATE
// ==========================================================

export async function updateGoal(id: string, payload: any) {
  const supabase = getSupabaseServer()

  await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
}


// ==========================================================
// ACHIEVED
// ==========================================================

export async function markGoalAchieved(id: string) {
  const supabase = getSupabaseServer()

  await supabase
    .from(TABLE)
    .update({ achieved: true })
    .eq("id", id)
}
