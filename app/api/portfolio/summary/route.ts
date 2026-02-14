import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { listInvestments } from "@/lib/api/portfolio/service"

export const dynamic = "force-dynamic"

export async function GET() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({}, { status: 401 })

  const rows = await listInvestments(user.id)

  const invested = rows.reduce((s, r) => s + Number(r.amount), 0)
  const current = rows.reduce(
    (s, r) => s + Number(r.current_value || r.amount),
    0
  )

  const gain = current - invested

  return NextResponse.json({
    invested,
    current,
    gain,
  })
}