/* =========================================================
   Expense Budgets API
   ---------------------------------------------------------
   ✓ list budgets
   ✓ create/update budget
   ✓ delete
   ✓ per user
========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/* ========================================================= */

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/* =========================================================
   GET → LIST
========================================================= */

export async function GET() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return bad("Unauthorized", 401)

  const { data, error } = await supabase
    .from("expense_budgets")
    .select("*")
    .eq("user_id", user.id)

  if (error) return bad("Failed")

  return NextResponse.json({ data })
}

/* =========================================================
   POST → UPSERT
========================================================= */

export async function POST(req: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return bad("Unauthorized", 401)

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  await supabase.from("expense_budgets").delete().eq("id", id)

  return NextResponse.json({ success: true })
}
