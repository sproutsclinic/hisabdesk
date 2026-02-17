ï»¿/* =========================================================
   Bills API Route (FIXED â€” uses Supabase Gateway ONLY)
   ========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import {
  getBillsOverview,
  createBill,
  updateBill,
  deleteBill,
} from "@/lib/api/bills/bills.service"

import type {
  CreateBillRequest,
  UpdateBillRequest,
} from "@/lib/api/bills/types"

export const dynamic = "force-dynamic"

const bad = (msg: string, s = 400) =>
  NextResponse.json({ error: msg }, { status: s })

/* =========================================================
   GET
   ========================================================= */

export async function GET() {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return bad("Unauthorized", 401)

  const overview = await getBillsOverview(user.id)

  return NextResponse.json({ data: overview })
}

/* =========================================================
   POST
   ========================================================= */

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return bad("Unauthorized", 401)

  const body = (await req.json()) as CreateBillRequest

  const row = await createBill(user.id, body)

  return NextResponse.json({ data: row })
}

/* =========================================================
   PATCH
   ========================================================= */

export async function PATCH(req: NextRequest) {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return bad("Unauthorized", 401)

  const body = (await req.json()) as UpdateBillRequest

  if (!body.id) return bad("id required")

  const row = await updateBill(user.id, body)

  return NextResponse.json({ data: row })
}

/* =========================================================
   DELETE
   ========================================================= */

export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseAdmin()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return bad("Unauthorized", 401)

  const id = new URL(req.url).searchParams.get("id")

  if (!id) return bad("id required")

  await deleteBill(user.id, id)

  return NextResponse.json({ success: true })
}
