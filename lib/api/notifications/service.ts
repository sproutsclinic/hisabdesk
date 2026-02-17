ï»¿import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import type { NotificationRow } from "./types"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

/* ========================================================= */

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "info" | "warning" | "success" = "info",
) {
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
  })
}

/* ========================================================= */

export async function getNotifications(userId: string) {
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  return data as NotificationRow[]
}

/* ========================================================= */

export async function markAllRead(userId: string) {
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
}
