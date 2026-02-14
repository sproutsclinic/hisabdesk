/* =========================================================
   HisabDesk — Income API Route (HARDENED)
   ---------------------------------------------------------
   Thin controller only

   UI → hook → route → service → DB

   RULES
   ✓ no business logic
   ✓ no calculations
   ✓ no aggregation
   ✓ guard based auth
   ✓ service handles DB
========================================================= */

import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/security/guards"

import {
  listIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  getIncomeTotal,
} from "@/lib/api/income/service"

import type {
  CreateIncomeRequest,
  UpdateIncomeRequest,
} from "@/lib/api/income/types"

export const dynamic = "force-dynamic"

/* =========================================================
helpers
========================================================= */

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/* =========================================================
GET → LIST
========================================================= */

export async function GET() {
  try {
    const user = await requireUser()

    const rows = await listIncome(user.id)

    // ✅ moved to service layer (no math here)
    const total = await getIncomeTotal(user.id)

    return NextResponse.json({
      success: true,
      data: { rows, total },
    })
  } catch {
    return bad("Failed to load income", 500)
  }
}

/* =========================================================
POST → CREATE
========================================================= */

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser()

    const body: CreateIncomeRequest = await req.json()

    const row = await createIncome(user.id, body)

    return NextResponse.json({
      success: true,
      data: row,
    })
  } catch {
    return bad("Create failed", 500)
  }
}

/* =========================================================
PATCH → UPDATE
========================================================= */

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser()

    const body: UpdateIncomeRequest = await req.json()

    if (!body.id) return bad("id required")

    const row = await updateIncome(user.id, body)

    return NextResponse.json({
      success: true,
      data: row,
    })
  } catch {
    return bad("Update failed", 500)
  }
}

/* =========================================================
DELETE
========================================================= */

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return bad("id required")

    await deleteIncome(user.id, id)

    return NextResponse.json({ success: true })
  } catch {
    return bad("Delete failed", 500)
  }
}
