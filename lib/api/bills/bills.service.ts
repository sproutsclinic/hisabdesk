ï»¿// ==========================================================
// Bills Service ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â PFOS Aligned
// Layer: Service (DB only)
// No business logic here.
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import type {
  BillRow,
  CreateBillRequest,
  UpdateBillRequest,
} from "./types"

/* =========================================================
GET OVERVIEW
========================================================= */

export async function getBillsOverview(userId: string): Promise<BillRow[]> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", userId)
    .order("due_day", { ascending: true })

  if (error) throw new Error(error.message)

  return data ?? []
}

/* =========================================================
CREATE
========================================================= */

export async function createBill(
  userId: string,
  body: CreateBillRequest
): Promise<BillRow> {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from("bills")
    .insert({
      ...body,
      user_id: userId,
      active: true,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

/* =========================================================
UPDATE
========================================================= */

export async function updateBill(
  userId: string,
  body: UpdateBillRequest
): Promise<BillRow> {
  const supabase = getSupabaseAdmin()

  const { id, ...updates } = body

  const { data, error } = await supabase
    .from("bills")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

/* =========================================================
DELETE
========================================================= */

export async function deleteBill(
  userId: string,
  id: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from("bills")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) throw new Error(error.message)

  return true
}

/* =========================================================
CRON PLACEHOLDER
========================================================= */

export async function runBillsReminders(): Promise<number> {
  return 0
}
