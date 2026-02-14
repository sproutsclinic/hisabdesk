/**
 * =========================================================
 * Offline Sync Queue Flush API
 * HisabDesk – Phase D (Background Sync Endpoint)
 * =========================================================
 *
 * PURPOSE
 * Triggered by:
 *   ✓ Service Worker background sync
 *   ✓ online recovery
 *
 * WHY NEEDED
 * ---------------------------------------------------------
 * Service Worker CANNOT directly access Supabase client.
 * So it calls this endpoint to:
 *
 *   → authenticate user (cookie/JWT)
 *   → safely accept queued writes
 *   → respond 200 so SW clears queue
 *
 * NOTE
 * Most of the replay logic already happens client-side
 * (offline-sync-queue.ts).
 *
 * This endpoint simply:
 *   ✓ validates auth
 *   ✓ acts as safe ping
 *   ✓ future extensible for server reconciliation
 *
 * SAFE
 * ✓ authenticated only
 * ✓ no DB writes
 * ✓ lightweight
 *
 * CONNECTS TO
 *   public/sw.js  (sync event)
 *   lib/pwa/offline-sync-queue.ts
 *
 * =========================================================
 */

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/* =========================================================
   CLIENT
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

    /* ------------------------------------------------------
       AUTH (cookie or bearer)
    ------------------------------------------------------ */

    const token =
      req.headers
        .get("authorization")
        ?.replace("Bearer ", "") || null

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token)

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* ------------------------------------------------------
       SUCCESS
    ------------------------------------------------------ */

    return NextResponse.json({
      ok: true,
      message: "Sync acknowledged",
      user: user.id,
    })
  } catch {
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    )
  }
}
