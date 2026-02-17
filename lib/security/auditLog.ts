ï»¿import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/*
  PHASE 17 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Audit Logs

  Table required:

  audit_logs
  ----------
  id uuid default uuid_generate_v4()
  user_id uuid nullable
  action text
  meta jsonb
  created_at timestamp default now()

  Usage:
  await logAudit("payment_success", userId, { amount: 999 })
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function logAudit(
  action: string,
  userId?: string | null,
  meta?: Record<string, any>
) {
  try {
    await supabase.from("audit_logs").insert({
      action,
      user_id: userId ?? null,
      meta: meta || {},
    })
  } catch (err) {
    console.error("Audit log failed:", err)
  }
}
