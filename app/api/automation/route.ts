/* =========================================================
   HisabDesk — Automation API
   Thin server only (SAFE VERSION)
   ========================================================= */

import { NextRequest, NextResponse } from "next/server"

/* ✅ USE YOUR SERVER WRAPPER (NOT supabase-js directly) */
import { createClient } from "@/lib/supabase/server"

import {
  getAutomationOverview,
  createRule,
  updateRule,
  deleteRule,
} from "@/lib/api/automation/service"

import type {
  CreateAutomationRuleRequest,
  UpdateAutomationRuleRequest,
} from "@/lib/api/automation/types"

/* ========================================================= */

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/* =========================================================
   GET — overview
   ========================================================= */

export async function GET() {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const overview = await getAutomationOverview(user.id)

    return NextResponse.json({ data: overview })
  } catch (err) {
    console.error("Automation GET error:", err)
    return bad("Failed to load automation rules", 500)
  }
}

/* =========================================================
   POST — create
   ========================================================= */

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const body =
      (await req.json()) as CreateAutomationRuleRequest

    if (!body?.name) return bad("Invalid payload")

    const row = await createRule(user.id, body)

    return NextResponse.json({ data: row })
  } catch (err) {
    console.error("Automation POST error:", err)
    return bad("Failed to create rule", 500)
  }
}

/* =========================================================
   PATCH — update
   ========================================================= */

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const body =
      (await req.json()) as UpdateAutomationRuleRequest

    if (!body?.id) return bad("Rule id required")

    const row = await updateRule(user.id, body)

    return NextResponse.json({ data: row })
  } catch (err) {
    console.error("Automation PATCH error:", err)
    return bad("Failed to update rule", 500)
  }
}

/* =========================================================
   DELETE — remove
   ========================================================= */

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return bad("Rule id required")

    await deleteRule(user.id, id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Automation DELETE error:", err)
    return bad("Failed to delete rule", 500)
  }
}