// ==========================================================
// HisabDesk — Notifications Page
// Clean • Server Component • Enterprise Safe
// ==========================================================

import { createClient } from "@supabase/supabase-js"
import { Card } from "@/components/ui/card"

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default async function NotificationsPage() {
  const supabase = getSupabase()

  const userId = "00000000-0000-0000-0000-000000000000" // FREE MODE safe

  const { data } = await supabase
    .from("notifications")
    .select("id, message, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(25)

  const items = data ?? []

  return (
    <main className="space-y-6">
      <h1 className="heading-lg">Notifications</h1>

      <Card className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-6">
            No notifications yet
          </p>
        )}

        {items.map((n: any) => (
          <div
            key={n.id}
            className="border-b border-zinc-200 last:border-0 pb-3"
          >
            <p className="text-sm">{n.message}</p>
            <p className="text-xs text-zinc-400 mt-1">
              {new Date(n.created_at).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </Card>
    </main>
  )
}
