ï»¿// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Scheduler Service
// Central automation runner (cron safe)
// Executes:
//   1) Recurring rules
//   2) Bills auto-pay
//   3) Net worth snapshot
// Called ONLY from server route: /api/cron
// NEVER from client
// ==========================================================

import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import {
  getDueRecurringRules,
  executeRecurringRule,
} from "@/lib/api/recurring"
import {
  getDueBills,
  markBillPaid,
} from "@/lib/api/bills"
import { captureCurrentNetWorth } from "@/lib/api/networth"

const supabase = getSupabaseAdmin()

// ==========================================================
// RUN RECURRING RULES
// ==========================================================

async function runRecurring(userId: string) {
  const rules = await getDueRecurringRules(userId)

  for (const rule of rules) {
    await executeRecurringRule(rule)
  }

  return rules.length
}

// ==========================================================
// RUN BILLS (auto-pay only)
// Creates expense transaction then moves due date
// ==========================================================

async function runBills(userId: string) {
  const bills = await getDueBills(userId)

  let count = 0

  for (const bill of bills) {
    if (!bill.auto_pay) continue

    // create expense transaction
    const today = new Date().toISOString().split("T")[0]

    const { error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        account_id: bill.account_id,
        category_id: bill.category_id ?? null,
        type: "expense",
        amount: bill.amount,
        description: bill.name,
        date: today,
      })

    if (error) throw error

    await markBillPaid(bill.id, userId)

    count++
  }

  return count
}

// ==========================================================
// GET ALL USERS (multi-tenant safe)
// ==========================================================

async function getAllUserIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")

  if (error) throw error

  return (data || []).map((u) => u.id)
}

// ==========================================================
// MAIN SCHEDULER
// Called by cron route
// ==========================================================

export async function runScheduler() {
  const users = await getAllUserIds()

  let recurringCount = 0
  let billsCount = 0

  for (const userId of users) {
    recurringCount += await runRecurring(userId)
    billsCount += await runBills(userId)

    // snapshot once per run
    await captureCurrentNetWorth(userId)
  }

  return {
    usersProcessed: users.length,
    recurringExecuted: recurringCount,
    billsPaid: billsCount,
  }
}
