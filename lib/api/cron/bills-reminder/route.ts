ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Bills Reminder Cron (Refactored)
// ----------------------------------------------------------
// Checks for bills due in next 7 days.
// Runs via cron (Vercel / scheduler).
// No dependency on app services.
// ==========================================================

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function GET() {
  try {
    const today = new Date()
    const next7Days = new Date()
    next7Days.setDate(today.getDate() + 7)

    // ------------------------------------------------------
    // Fetch active bills directly
    // ------------------------------------------------------

    const { data: bills, error } = await supabase
      .from("bills")
      .select("id,name,amount,next_due_date,user_id")
      .eq("is_active", true)

    if (error) throw error

    const reminders: any[] = []

    for (const bill of bills ?? []) {
      if (!bill.next_due_date) continue

      const dueDate = new Date(bill.next_due_date)

      if (dueDate >= today && dueDate <= next7Days) {
        reminders.push({
          user_id: bill.user_id,
          bill: bill.name,
          amount: bill.amount,
          due: bill.next_due_date,
        })
      }
    }

    console.log("Upcoming reminders:", reminders.length)

    // Later this can trigger email / WhatsApp / notifications.

    return NextResponse.json({
      ok: true,
      reminders: reminders.length,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}
