import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import { syncGST } from "@/lib/gst/gsp-sync"

import {
  webhookLimiter,
  getIP,
} from "@/lib/security/rate-limit"
import { logRequest } from "@/lib/security/request-logger"

/**
 * =========================================================
 * GST Sync API (REAL GSP VERSION)
 * =========================================================
 *
 * Keeps:
 * ✓ auth
 * ✓ rate limiting
 * ✓ logging
 * ✓ enterprise safety
 *
 * Changes:
 * ✓ uses REAL GSP sync instead of mock importer
 */

export async function POST(req: Request) {
  const start = Date.now()

  try {
    /* ======================================================
       RATE LIMIT
    ====================================================== */

    const ip = getIP(req)

    if (!webhookLimiter.check(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    }

    /* ======================================================
       SUPABASE
    ====================================================== */

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    /* ======================================================
       AUTH VERIFY
    ====================================================== */

    const token =
      req.headers.get("authorization")?.replace(
        "Bearer ",
        ""
      )

    const {
      data: { user },
    } = await supabase.auth.getUser(token || "")

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    /* ======================================================
       BODY
    ====================================================== */

    const { orgId } = await req.json()

    if (!orgId) {
      return NextResponse.json(
        { error: "Missing orgId" },
        { status: 400 }
      )
    }

    /* ======================================================
       REAL GST FETCH + SAVE
       (this internally saves into gst_invoices)
    ====================================================== */

    await syncGST(orgId)

    /* ======================================================
       LOG
    ====================================================== */

    await logRequest({
      req,
      userId: user.id,
      status: 200,
      start,
      meta: {
        type: "gst_sync_real",
        orgId,
      },
    })

    /* ======================================================
       DONE
    ====================================================== */

    return NextResponse.json({
      ok: true,
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "GST sync failed" },
      { status: 500 }
    )
  }
}
