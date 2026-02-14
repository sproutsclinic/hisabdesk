/* =========================================================
   HisabDesk — Automation Service
   ---------------------------------------------------------
   SERVER ONLY

   PURPOSE
   - DB access only
   - Call engine for computed values
   - NO business math here
   - NO AI
   - NO route logic

   ARCHITECTURE
     route → service (THIS FILE) → engine

   RULES
   ✅ DB queries only
   ✅ orchestration only
   ❌ no calculations
   ❌ no AI
   ❌ no client logic

   ========================================================= */

import { createClient } from "@supabase/supabase-js"

import type {
  AutomationRuleRow,
  CreateAutomationRuleRequest,
  UpdateAutomationRuleRequest,
  AutomationOverview,
} from "./types"

import { buildAutomationOverview } from "./engine"

/* =========================================================
   SERVER CLIENT (service role)
   ========================================================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

/* =========================================================
   HELPERS
   ========================================================= */

function clamp(n: unknown) {
  return Math.max(0, Number(n ?? 0))
}

/* =========================================================
   FETCH
   ========================================================= */

export async function listRules(
  userId: string,
): Promise<AutomationRuleRow[]> {
  const { data, error } = await supabase
    .from("automation_rules")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data || []) as AutomationRuleRow[]
}

export async function getAutomationOverview(
  userId: string,
): Promise<AutomationOverview> {
  const rows = await listRules(userId)

  return buildAutomationOverview(rows)
}

/* =========================================================
   CREATE
   ========================================================= */

export async function createRule(
  userId: string,
  payload: CreateAutomationRuleRequest,
) {
  const { data, error } = await supabase
    .from("automation_rules")
    .insert([
      {
        user_id: userId,

        name: payload.name,
        type: payload.type,

        amount: clamp(payload.amount),
        category: payload.category,

        frequency: payload.frequency,
        start_date: payload.start_date,

        active: true,
        last_run_at: null,
      },
    ])
    .select()
    .single()

  if (error) throw error

  return data
}

/* =========================================================
   UPDATE
   ========================================================= */

export async function updateRule(
  userId: string,
  payload: UpdateAutomationRuleRequest,
) {
  const { id, ...rest } = payload

  const { data, error } = await supabase
    .from("automation_rules")
    .update({
      ...rest,
      amount:
        rest.amount !== undefined
          ? clamp(rest.amount)
          : undefined,
    })
    .eq("user_id", userId)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error

  return data
}

/* =========================================================
   DELETE
   ========================================================= */

export async function deleteRule(
  userId: string,
  id: string,
) {
  const { error } = await supabase
    .from("automation_rules")
    .delete()
    .eq("user_id", userId)
    .eq("id", id)

  if (error) throw error
}
