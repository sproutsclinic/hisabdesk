import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getNotifications } from "@/lib/api/notifications/service"

function client(req: NextRequest) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") || "",
        },
      },
    },
  )
}

/* ========================================================= */

export async function GET(req: NextRequest) {
  const supabase = client(req)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" })

  const rows = await getNotifications(user.id)

  return NextResponse.json({
    data: {
      rows,
      unread: rows.filter((r) => !r.read).length,
    },
  })
}
