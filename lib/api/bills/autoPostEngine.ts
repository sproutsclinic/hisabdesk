ï»¿import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// ==========================================================
// AUTO POST ENGINE (CRON SAFE)
// ----------------------------------------------------------
// Runs without user context.
// Finds due bills and posts transactions automatically.
// ==========================================================

export async function autoPostBills() {
  const today = new Date().toISOString().slice(0, 10)

  // --------------------------------------------------------
  // 1. Load all active bills
  // --------------------------------------------------------

  const { data: bills, error } = await supabase
    .from("bills")
    .select("*")
    .eq("is_active", true)

  if (error) throw error

  let postedCount = 0

  // --------------------------------------------------------
  // 2. Post due bills
  // --------------------------------------------------------

  for (const b of bills ?? []) {
    if (!b.next_due_date) continue

    if (b.next_due_date.startsWith(today)) {
      await supabase.from("transactions").insert({
        user_id: b.user_id,
        type: "expense",
        amount: b.amount,
        category: b.category,
        description: `Auto Bill: ${b.name}`,
      })

      postedCount++
    }
  }

  // --------------------------------------------------------
  // 3. Return stats (used by cron route)
  // --------------------------------------------------------

  return { posted: postedCount }
}
