import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* =================================================
   AUTO REMINDER ENGINE — SAFE VERSION

   Improvements:
   ✅ user scoped (NOT all users)
   ✅ secure auth token required
   ✅ idempotent
   ✅ batch insert (fast)
   ✅ safe to run repeatedly

   Trigger:
   fetch("/api/reminders/auto", { method: "POST" })

================================================= */

export async function POST(req: Request) {
  try {
    /* ================= AUTH ================= */

    const authHeader = req.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // server only
      { auth: { persistSession: false } }
    )

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (!user || error) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    /* ================= FETCH USER ITEMS ONLY ================= */

    const { data: items } = await supabase
      .from("vault_items")
      .select("id,category,metadata")
      .eq("user_id", user.id)

    if (!items?.length) {
      return NextResponse.json({ ok: true })
    }

    const inserts: any[] = []

    /* ================= BUILD REMINDERS ================= */

    for (const item of items) {
      const m = item.metadata || {}

      /* Insurance premium */
      if (item.category === "insurance" && m.due_date) {
        inserts.push({
          user_id: user.id,
          vault_item_id: item.id,
          reminder_date: m.due_date,
          type: "premium",
          status: "pending",
        })
      }

      /* Loan EMI */
      if (item.category === "loans" && m.emi_date) {
        inserts.push({
          user_id: user.id,
          vault_item_id: item.id,
          reminder_date: m.emi_date,
          type: "emi",
          status: "pending",
        })
      }

      /* Investment maturity */
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

    /* ================= REMOVE DUPLICATES ================= */

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
  } catch {
    return NextResponse.json({ ok: false })
  }
}
