ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

export const dynamic = "force-dynamic"

/* =================================================
   AUTO REMINDER ENGINE â€” FINAL (Gateway Based)
   Uses shared server client (NO createClient anywhere)
================================================= */

export async function POST() {
  try {
    const supabase = getSupabaseAdmin()

    /* ================= AUTH (server session) ================= */

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (!user || error) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    /* ================= FETCH USER ITEMS ================= */

    const { data: items } = await supabase
      .from("vault_items")
      .select("id, category, metadata")
      .eq("user_id", user.id)

    if (!items?.length) {
      return NextResponse.json({ ok: true })
    }

    const inserts: any[] = []

    /* ================= BUILD REMINDERS ================= */

    for (const item of items) {
      const m = item.metadata || {}

      if (item.category === "insurance" && m.due_date) {
        inserts.push({
          user_id: user.id,
          vault_item_id: item.id,
          reminder_date: m.due_date,
          type: "premium",
          status: "pending",
        })
      }

      if (item.category === "loans" && m.emi_date) {
        inserts.push({
          user_id: user.id,
          vault_item_id: item.id,
          reminder_date: m.emi_date,
          type: "emi",
          status: "pending",
        })
      }

      if (item.category === "tax" && m.maturity_date) {
        inserts.push({
          user_id: user.id,
          vault_item_id: item.id,
          reminder_date: m.maturity_date,
          type: "maturity",
          status: "pending",
        })
      }
    }

    if (!inserts.length) {
      return NextResponse.json({ ok: true })
    }

    /* ================= IDEMPOTENT INSERT ================= */

    for (const r of inserts) {
      const { data: exists } = await supabase
        .from("reminders")
        .select("id")
        .eq("vault_item_id", r.vault_item_id)
        .eq("type", r.type)
        .eq("reminder_date", r.reminder_date)
        .maybeSingle()

      if (!exists) {
        await supabase.from("reminders").insert(r)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}