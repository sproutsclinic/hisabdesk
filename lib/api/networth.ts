ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Net Worth Service Layer
// Aggregates assets + liabilities + accounts
// Used by: dashboard, wealth planner, insights
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = getSupabaseAdmin()

// ==========================================================
// TYPES
// ==========================================================

export interface NetWorthSummary {
  accounts: number
  assets: number
  liabilities: number
  netWorth: number
}

export interface NetWorthSnapshotInput {
  date: string
  value: number
}

// ==========================================================
// INTERNAL HELPERS
// ==========================================================

async function getAccountsTotal(userId: string) {
  const { data, error } = await supabase
    .from("accounts")
    .select("balance")
    .eq("user_id", userId)
    .eq("is_active", true)

  if (error) throw error

  return (data || []).reduce(
    (sum, row) => sum + (row.balance || 0),
    0
  )
}

async function getAssetsTotal(userId: string) {
  const { data, error } = await supabase
    .from("assets")
    .select("value")
    .eq("user_id", userId)

  if (error) throw error

  return (data || []).reduce(
    (sum, row) => sum + (row.value || 0),
    0
  )
}

async function getLiabilitiesTotal(userId: string) {
  const { data, error } = await supabase
    .from("liabilities")
    .select("outstanding")
    .eq("user_id", userId)

  if (error) throw error

  return (data || []).reduce(
    (sum, row) => sum + (row.outstanding || 0),
    0
  )
}

// ==========================================================
// MAIN SUMMARY
// ==========================================================

export async function getNetWorthSummary(
  userId: string
): Promise<NetWorthSummary> {
  const [accounts, assets, liabilities] = await Promise.all([
    getAccountsTotal(userId),
    getAssetsTotal(userId),
    getLiabilitiesTotal(userId),
  ])

  const netWorth = accounts + assets - liabilities

  return {
    accounts,
    assets,
    liabilities,
    netWorth,
  }
}

// ==========================================================
// SNAPSHOT SAVE
// Used daily/monthly history tracking
// Table: networth_snapshots
// ==========================================================

export async function saveNetWorthSnapshot(
  userId: string,
  input: NetWorthSnapshotInput
) {
  const { data, error } = await supabase
    .from("networth_snapshots")
    .insert({
      user_id: userId,
      date: input.date,
      value: input.value,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// LIST SNAPSHOTS
// Used for chart history
// ==========================================================

export async function listNetWorthSnapshots(
  userId: string,
  from?: string,
  to?: string
) {
  let query = supabase
    .from("networth_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true })

  if (from) query = query.gte("date", from)
  if (to) query = query.lte("date", to)

  const { data, error } = await query

  if (error) throw error

  return data || []
}

// ==========================================================
// AUTO SNAPSHOT (helper)
// ==========================================================

export async function captureCurrentNetWorth(
  userId: string
) {
  const summary = await getNetWorthSummary(userId)

  return saveNetWorthSnapshot(userId, {
    date: new Date().toISOString().split("T")[0],
    value: summary.netWorth,
  })
}
