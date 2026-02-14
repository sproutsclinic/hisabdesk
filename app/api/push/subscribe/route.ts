/**
 * =========================================================
 * Push Subscribe API
 * HisabDesk – Phase D Mobile
 * =========================================================
 *
 * PURPOSE
 * Save browser push subscription to DB
 *
 * Called by:
 *   components/pwa/push-register.tsx
 *
 * FLOW
 *   Browser → POST subscription
 *   → store in push_subscriptions table
 *
 * SAFE
 * ✓ auth required
 * ✓ server trusted only
 * ✓ idempotent (upsert)
 *
 * CONNECTS TO
 *   lib/pwa/push-notifications.ts
 *
 * =========================================================
 */

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* =========================================================
   CLIENT (SERVICE ROLE)
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   POST
========================================================= */

export async function POST(req: Request) {
  try {
    const supabase = getClient()

    const body = await req.json()
    const subscription = body.subscription

    if (!subscription) {
      return NextResponse.json(
        { error: "Missing subscription" },
        { status: 400 }
      )
    }

    /* ------------------------------------------------------
       AUTH USER (from Supabase JWT cookie)
    ------------------------------------------------------ */

    const access =
      req.headers.get("authorization")?.replace(
        "Bearer ",
        ""
      )

    if (!access) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(access)

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* ------------------------------------------------------
       UPSERT
    ------------------------------------------------------ */

    await supabase.from("push_subscriptions").upsert({
      user_id: user.id,
      subscription,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    )
  }
}
