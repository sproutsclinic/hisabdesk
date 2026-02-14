// ==========================================================
// Detect recurring expenses and convert to Bills
// Called automatically after expense insert
// ==========================================================

import { createClient } from "@/lib/supabase/server"

const KEYWORDS = [
  "rent",
  "netflix",
  "prime",
  "airtel",
  "jio",
  "electricity",
  "water",
  "wifi",
  "subscription",
  "emi",
  "loan",
  "insurance",
]

export async function detectRecurringBills(
  userId: string,
  expense: {
    id: string
    amount: number
    date: string
    notes?: string
    category?: string
  }
) {
  const supabase = createClient()

  const text = (expense.notes || "").toLowerCase()

  // --------------------------------------------------------
  // Rule 1 → keyword match
  // --------------------------------------------------------

  const matched = KEYWORDS.some((k) => text.includes(k))

  if (!matched) return

  // --------------------------------------------------------
  // Rule 2 → avoid duplicates
  // --------------------------------------------------------

  const { data: existing } = await supabase
    .from("bills")
    .select("id")
    .eq("user_id", userId)
    .ilike("name", `%${expense.notes}%`)
    .limit(1)

  if (existing && existing.length > 0) return

  // --------------------------------------------------------
  // Create Bill automatically
  // --------------------------------------------------------

  await supabase.from("bills").insert({
    user_id: userId,
    name: expense.notes || "Recurring Bill",
    amount: expense.amount,
    next_due_date: expense.date,
    frequency: "monthly",
    source: "auto-detected",
  })
}