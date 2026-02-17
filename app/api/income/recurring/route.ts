ï»¿import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

/* ======================================================== */
/* GET â†’ list recurring                                     */
/* ======================================================== */

export async function GET() {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data } = await supabase
    .from("recurring_income")
    .select("*")
    .eq("user_id", user.id)
    .order("next_run")

  return NextResponse.json({ data })
}

/* ======================================================== */
/* POST â†’ create                                            */
/* ======================================================== */

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()

  const { data } = await supabase
    .from("recurring_income")
    .insert({
      ...body,
      user_id: user.id,
    })
    .select()
    .single()

  return NextResponse.json({ data })
}
