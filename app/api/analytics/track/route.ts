import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/*
  Table required in Supabase:

  analytics_events
  ----------------
  id uuid (default uuid_generate_v4())
  user_id uuid nullable
  event text
  props jsonb
  created_at timestamp default now()
*/

export async function POST(req: NextRequest) {
  try {
    const { event, props } = await req.json()

    const authHeader = req.headers.get("authorization")
    let userId: string | null = null

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "")
      const {
        data: { user },
      } = await supabase.auth.getUser(token)

      userId = user?.id ?? null
    }

    await supabase.from("analytics_events").insert({
      event,
      props: props || {},
      user_id: userId,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}
