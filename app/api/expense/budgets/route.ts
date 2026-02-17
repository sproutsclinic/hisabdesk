ï»¿import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/* =========================================================
   GET â€” LIST
========================================================= */
export async function GET() {
  const supabase = getSupabaseAdmin()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return bad("Unauthorized", 401)

  const { data, error } = await supabase
    .from("expense_budgets")
    .select("*")
    .eq("user_id", user.id)

  if (error) return bad("Failed")

  return NextResponse.json({ data })
}

/* =========================================================
   POST â€” UPSERT
========================================================= */
export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return bad("Unauthorized", 401)

  const body = await req.json()

  const { data, error } = await supabase
    .from("expense_budgets")
    .upsert({
      user_id: user.id,
      category: body.category,
      limit_amount: body.limit_amount,
    })
    .select()
    .single()

  if (error) return bad("Failed")

  return NextResponse.json({ data })
}

/* =========================================================
   DELETE
========================================================= */
export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdmin()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return bad("Unauthorized", 401)

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return bad("id required")

  await supabase
    .from("expense_budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  return NextResponse.json({ success: true })
}
