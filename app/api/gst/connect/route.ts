/*
=========================================================
CONNECT GST — ENTERPRISE SECURE
POST /api/gst/connect

✓ auth guard
✓ rate limit
✓ safe json
✓ input validation
✓ safe errors
✓ no trust on client orgId
=========================================================
*/

import { NextResponse } from "next/server"
import { saveGSTCredentials } from "@/lib/gst/gsp-auth"

import {
  requireUser,
  safeJson,
  rateLimit,
} from "@/lib/api/secure"

export async function POST(req: Request) {
  try {
    /* =====================================================
       AUTH (server trusted)
    ===================================================== */

    const userId = await requireUser()

    /* =====================================================
       RATE LIMIT
    ===================================================== */

    rateLimit(userId, 10, 60_000)

    /* =====================================================
       SAFE BODY
    ===================================================== */

    const body = await safeJson(req)

    const gstin = String(body?.gstin || "").trim()

    if (!gstin || gstin.length < 10) {
      return NextResponse.json(
        { error: "Invalid GSTIN" },
        { status: 400 }
      )
    }

    /* =====================================================
       PROVIDER AUTH
    ===================================================== */

    const res = await fetch(
      `${process.env.GSP_BASE_URL}/auth/token`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.GSP_API_KEY!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gstin }),
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: "GST connect failed" },
        { status: 400 }
      )
    }

    const tokenData = await res.json()

    /* =====================================================
       SAVE (use server userId ONLY)
    ===================================================== */

    await saveGSTCredentials(userId, gstin, tokenData)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    const msg = err?.message || "failed"

    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (msg === "RATE_LIMIT") {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    return NextResponse.json({ error: "failed" }, { status: 500 })
  }
}
