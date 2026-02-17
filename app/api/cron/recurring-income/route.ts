ï»¿import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = getSupabaseAdmin()

  const today = new Date().toISOString().slice(0, 10)

  const { data: rows } = await supabase
    .from("recurring_income")
    .select("*")
    .lte("next_run", today)
    .eq("active", true)

  for (const r of rows ?? []) {
    await supabase.from("income").insert({
      user_id: r.user_id,
      amount: r.amount,
      category: r.category,
      notes: r.title,
      date: today,
    })

    const next = new Date(r.next_run)
    next.setMonth(next.getMonth() + 1)

    await supabase
      .from("recurring_income")
      .update({ next_run: next.toISOString().slice(0, 10) })
      .eq("id", r.id)
  }

  return NextResponse.json({ ok: true })
}
