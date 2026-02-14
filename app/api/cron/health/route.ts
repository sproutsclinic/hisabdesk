// ==========================================================
// Cron Health Endpoint
// Route: /api/cron/health
//
// PURPOSE
// - uptime check
// - cron verification
// - monitoring / observability
//
// Used by:
// - Vercel cron validation
// - external uptime monitors
//
// RULES
// ✅ lightweight
// ✅ no DB heavy queries
// ❌ no business logic
// ❌ no calculations
// ==========================================================

import { NextResponse } from "next/server"

/* =========================================================
GET /api/cron/health
========================================================= */

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "hisabdesk-cron",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}
