// ==========================================================
// HisabDesk — Assets API Layer
// Handles investments + owned assets
// Used by: portfolio, net worth, dashboard
// ==========================================================

import { createClient } from "@/lib/supabase"

const supabase = createClient()

// ==========================================================
// TYPES
// ==========================================================

export type AssetType =
  | "stock"
  | "mutual_fund"
  | "gold"
  | "real_estate"
  | "crypto"
  | "fd"
  | "pf"
  | "other"

export interface AssetInput {
  name: string
  type: AssetType
  quantity?: number
  buy_price?: number
  current_price?: number
  value?: number // manual override (for real estate etc.)
  notes?: string | null
}

// ==========================================================
// HELPERS
// ==========================================================

function computeValue(input: AssetInput) {
  if (input.value !== undefined) return input.value

  if (
    input.quantity !== undefined &&
    input.current_price !== undefined
  ) {
    return input.quantity * input.current_price
  }

  return 0
}

// ==========================================================
// CREATE
// ==========================================================

export async function createAsset(
  userId: string,
  input: AssetInput
) {
  const value = computeValue(input)

  const { data, error } = await supabase
    .from("assets")
    .insert({
      user_id: userId,
      ...input,
      value,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

// ==========================================================
// UPDATE
// ==========================================================

export async function updateAsset(
  id: string,
  userId: string,
  input: Partial<AssetInput>
) {
  const existing = await getAsset(id, userId)

  const merged = { ...existing, ...input }
  const value = computeValue(merged)

  const { data, error } = await supabase
    .from("assets")
    .update({
      ...input,
      value,
    })
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

export async function deleteAsset(id: string, userId: string) {
  const { error } = await supabase
    .from("assets")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw error

  return true
}

// ==========================================================
// GET SINGLE
// ==========================================================

export async function getAsset(id: string, userId: string) {
  const { data, error } = await supabase
    .from("assets")
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

export async function listAssets(userId: string) {
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data || []
}

// ==========================================================
// TOTAL VALUE (portfolio summary)
// ==========================================================

export async function getTotalAssetValue(userId: string) {
  const { data, error } = await supabase
    .from("assets")
    .select("value")
    .eq("user_id", userId)

  if (error) throw error

  const total =
    (data || []).reduce((sum, row) => sum + (row.value || 0), 0)

  return total
}

// ==========================================================
// PERFORMANCE SUMMARY
// Used for portfolio gains calculation
// ==========================================================

export async function getAssetPerformance(userId: string) {
  const { data, error } = await supabase
    .from("assets")
    .select("quantity,buy_price,current_price,value")
    .eq("user_id", userId)

  if (error) throw error

  let invested = 0
  let current = 0

  for (const a of data || []) {
    if (a.quantity && a.buy_price) {
      invested += a.quantity * a.buy_price
    }
    current += a.value || 0
  }

  const gain = current - invested
  const gainPercent =
    invested > 0 ? (gain / invested) * 100 : 0

  return {
    invested,
    current,
    gain,
    gainPercent,
  }
}
