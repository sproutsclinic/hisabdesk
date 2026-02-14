import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { markAllRead } from "@/lib/api/notifications/service"

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" })

  await markAllRead(user.id)

  return NextResponse.json({ success: true })
}
