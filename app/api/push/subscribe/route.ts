ï»¿/**
 * =========================================================
 * Push Subscribe API
 * HisabDesk â€” Phase D Mobile
 * =========================================================
 *
 * PURPOSE
 * Save browser push subscription to DB
 *
 * RULE
 * Always use centralized Supabase gateway.
 * NEVER instantiate Supabase manually.
 * =========================================================
 */

import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* =========================================================
   POST
========================================================= */

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin()

    const body = await req.json()
    const subscription = body.subscription

    if (!subscription) {
      return NextResponse.json(
        { error: "Missing subscription" },
        { status: 400 }
      )
    }

    /* ------------------------------------------------------
       AUTH USER (handled by gateway session)
    ------------------------------------------------------ */

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* ------------------------------------------------------
       UPSERT SUBSCRIPTION
    ------------------------------------------------------ */

    await supabase.from("push_subscriptions").upsert({
      user_id: user.id,
      subscription,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Push subscribe error:", err)

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    )
  }
}