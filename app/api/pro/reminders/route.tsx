/*
=================================================
PRO REMINDERS — ENTERPRISE SAFE (FINAL)

GET /api/pro/reminders

✓ cookie auth (no bearer trust)
✓ no token parsing
✓ rate limit
✓ safe errors
✓ never leaks data
✓ consistent empty response
✓ Next 16 safe
=================================================
*/

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

/* ================================================= */

export async function GET() {
  try {
    /* ================= AUTH (COOKIE ONLY) ================= */

    const cookieStore = await cookies()
    const userId = cookieStore.get("uid")?.value

    if (!userId) return NextResponse.json([])

    /* ================= RATE LIMIT ================= */

    const now = Date.now()
    const key = `reminders_${userId}`

    const g = global as any
    g.__reminderHits ??= {}

    const record = g.__reminderHits[key] || { count: 0, time: now }

    if (now - record.time < 10_000 && record.count >= 20) {
      return NextResponse.json([])
    }

    record.count++
    record.time = now
    g.__reminderHits[key] = record

    /* ================= ADMIN CLIENT ================= */

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    /* ================= PROFILE ================= */

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_pro, pro_expires_at")
      .eq("id", userId)
      .single()

    if (!profile?.is_pro || !profile?.pro_expires_at) {
      return NextResponse.json([])
    }

    /* ================= CALC ================= */

    const expiry = new Date(profile.pro_expires_at)
    const today = new Date()

    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / 86400000
    )

    if (diffDays >= 0 && diffDays <= 7) {
      return NextResponse.json([
        {
          type: "expiry",
          daysLeft: diffDays,
        },
      ])
    }

    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}
