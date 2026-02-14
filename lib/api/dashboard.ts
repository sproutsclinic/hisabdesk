// ==========================================================
// HisabDesk — Dashboard Service Layer (FINAL STABLE)
// Next 16 safe
// No cookies() usage here
// Uses service client only
// Phase 3 — Production hardening + performance
// ==========================================================

import { createClient } from "@supabase/supabase-js"

/* ==========================================================
   SERVER SUPABASE (NO cookies, NO auth dependency)
========================================================== */

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false, // ✅ additive: no memory/session overhead on server
        autoRefreshToken: false,
      },
      global: {
        headers: {
          "x-application-name": "hisabdesk-dashboard", // ✅ additive: tracing/debug
        },
      },
    }
  )
}

/* ==========================================================
   PERFORMANCE CONSTANTS (ADDITIVE ONLY — SAFE LIMITS)
   Prevents overfetching + protects dashboard render time
========================================================== */

const MAX_CHART_ROWS = 500 // enough for ~1.5 years daily data
const MAX_VAULT_ROWS = 300 // vault rarely needs more for KPI calc

export async function loadDashboardData(userId: string) {
  const supabase = getSupabase()

  const today = new Date()
  const next7 = new Date()
  next7.setDate(today.getDate() + 7)

  const [
    profileRes,
    inc,
    exp,
    ded,
    remindersRes,
    vaultRes,
  ] = await Promise.all([
    // ======================================================
    // Profile
    // ======================================================
    supabase
      .from("profiles")
      .select("full_name, onboarding_completed")
      .eq("id", userId)
      .limit(1)
      .single(),

    // ======================================================
    // Income (ordered for chart correctness)
    // ✅ column-only select
    // ✅ row limit to avoid huge payloads
    // ======================================================
    supabase
      .from("incomes")
      .select("amount,date", { count: "exact" })
      .eq("user_id", userId)
      .order("date", { ascending: true })
      .limit(MAX_CHART_ROWS),

    // ======================================================
    // Expense (ordered for chart correctness)
    // ✅ column-only select
    // ✅ row limit
    // ======================================================
    supabase
      .from("expenses")
      .select("amount,date", { count: "exact" })
      .eq("user_id", userId)
      .order("date", { ascending: true })
      .limit(MAX_CHART_ROWS),

    // ======================================================
    // Deduction
    // ======================================================
    supabase
      .from("deductions")
      .select("total")
      .eq("user_id", userId)
      .limit(1)
      .single(),

    // ======================================================
    // Reminders (limited for performance)
    // ======================================================
    supabase
      .from("reminders")
      .select("id, reminder_date, type, vault_items(title)")
      .eq("user_id", userId)
      .gte("reminder_date", today.toISOString())
      .lte("reminder_date", next7.toISOString())
      .eq("status", "pending")
      .order("reminder_date", { ascending: true })
      .limit(10),

    // ======================================================
    // Vault (minimal fields only)
    // ✅ capped to prevent heavy metadata loads
    // ======================================================
    supabase
      .from("vault_items")
      .select("category, metadata")
      .eq("user_id", userId)
      .limit(MAX_VAULT_ROWS),
  ])

  // ========================================================
  // Safe returns (never crash UI)
  // ========================================================

  return {
    profile: profileRes.data ?? null,
    incomes: inc.data ?? [],
    expenses: exp.data ?? [],
    deduction: ded.data?.total ?? 0,
    reminders: remindersRes.data ?? [],
    vault: vaultRes.data ?? [],
  }
}
