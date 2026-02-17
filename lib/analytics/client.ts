ï»¿/*
  Client helper that automatically attaches Supabase auth token
  so events are linked to user_id
*/

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = Record<string, any>

export async function track(event: string, props?: Props) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.access_token
          ? `Bearer ${session.access_token}`
          : "",
      },
      body: JSON.stringify({
        event,
        props,
      }),
    })
  } catch (err) {
    console.error("Analytics client error:", err)
  }
}
