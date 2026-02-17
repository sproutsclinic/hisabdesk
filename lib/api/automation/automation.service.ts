ï»¿// ==========================================================
// Automation Service (Server only)
// Layer: API ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Service ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Engine ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ DB
//
// PURPOSE
// Executes recurring automation rules:
//
// Examples:
// - monthly salary auto income
// - rent auto expense
// - SIP investments
// - subscriptions
//
// RULES
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ DB orchestration only
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ delegates logic to engine
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ NO HTTP
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ NO UI
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ NO calculations here
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import {
  evaluateDueRules,
  buildTransactionsFromRules,
  type AutomationRule,
} from "./automation.engine"

/* =========================================================
Public Runner (called by cron)
========================================================= */

export async function runRecurringAutomation(): Promise<number> {
  const supabase = getSupabaseAdmin()

  const todayISO = new Date().toISOString().slice(0, 10)

  // -------------------------------------------------------
  // 1. Fetch active rules
  // -------------------------------------------------------

  const { data: rules, error } = await supabase
    .from("automation_rules")
    .select(
      `
        id,
        user_id,
        type,
        amount,
        category,
        frequency,
        last_run_at,
        next_run_at,
        is_active
      `
    )
    .eq("is_active", true)
    .lte("next_run_at", todayISO)

  if (error) {
    throw new Error(error.message)
  }

  if (!rules || rules.length === 0) return 0

  // -------------------------------------------------------
  // 2. Engine decides what should run
  // -------------------------------------------------------

  const dueRules: AutomationRule[] = evaluateDueRules(rules, todayISO)

  if (dueRules.length === 0) return 0

  // -------------------------------------------------------
  // 3. Engine builds transaction rows
  // -------------------------------------------------------

  const transactions = buildTransactionsFromRules(dueRules, todayISO)

  // -------------------------------------------------------
  // 4. Insert transactions (single source of truth)
  // -------------------------------------------------------

  const { error: insertError } = await supabase
    .from("transactions")
    .insert(transactions)

  if (insertError) {
    throw new Error(insertError.message)
  }

  // -------------------------------------------------------
  // 5. Update rule next_run_at / last_run_at
  // -------------------------------------------------------

  for (const rule of dueRules) {
    await supabase
      .from("automation_rules")
      .update({
        last_run_at: todayISO,
        next_run_at: rule.next_run_at,
      })
      .eq("id", rule.id)
  }

  // -------------------------------------------------------
  // return count executed
  // -------------------------------------------------------

  return transactions.length
}
