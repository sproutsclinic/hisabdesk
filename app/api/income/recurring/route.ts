import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/* ======================================================== */
/* GET → list recurring                                     */
/* ======================================================== */

export async function GET() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data } = await supabase
    .from("recurring_income")
    .select("*")
    .eq("user_id", user.id)
    .order("next_run")

  return NextResponse.json({ data })
}

/* ======================================================== */
/* POST → create                                            */
/* ======================================================== */

export async function POST(req: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const body = await req.json()

  const { data } = await supabase
    .from("recurring_income")
    .insert({
      ...body,
      user_id: user?.id,
    })
    .select()
    .single()

  return NextResponse.json({ data })
}
