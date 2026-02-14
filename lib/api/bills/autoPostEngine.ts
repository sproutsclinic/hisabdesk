import { createClient } from "@supabase/supabase-js"
import type { BillComputed } from "./types"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function autoPostBills(
  userId: string,
  rows: BillComputed[],
) {
  const today = new Date().toISOString().slice(0, 10)

  for (const b of rows) {
    if (b.nextDueDate.startsWith(today)) {
      await supabase.from("transactions").insert({
        user_id: userId,
        type: "expense",
        amount: b.amount,
        category: b.category,
        description: `Auto Bill: ${b.name}`,
      })
    }
  }
}
