// ==========================================================
// HisabDesk — AI Context Log Route
// ----------------------------------------------------------
// PURPOSE
//   Persist compact AI context for each user session
//
//   Why:
//     • cheaper future prompts
//     • historical learning
//     • audit trail
//     • personalization memory
//
//   Used by:
//     - dashboard summary
//     - page assistant
//     - insights
//
// FLOW
//   metrics/context → store → later reused by AI routes
//
// RULES
//   ✓ server-side only
//   ✓ no AI calls
//   ✓ small payloads only
//   ✓ multi-tenant safe
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

const supabase = createClient()

// ==========================================================
// TYPES
// ==========================================================

interface Body {
  summary: string
  numbers?: Record<string, number | string>
}

// ==========================================================
// AUTH
// ==========================================================

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  return user
}

// ==========================================================
// POST — save context
// ==========================================================

export async function POST(req: Request) {
  try {
    const user = await getUser()

    const body = (await req.json()) as Body

    await supabase.from("ai_context").insert({
      user_id: user.id,
      summary: body.summary,
      numbers: body.numbers || {},
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}

// ==========================================================
// GET — fetch latest context
// ==========================================================

export async function GET() {
  try {
    const user = await getUser()

    const { data } = await supabase
      .from("ai_context")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      context: data || null,
    })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 401 }
    )
  }
}
