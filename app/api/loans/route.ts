ï»¿import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import {
  getLoansOverview,
  createLoan,
  updateLoan,
  deleteLoan
} from "@/lib/api/loans/service"

import type {
  CreateLoanRequest,
  UpdateLoanRequest
} from "@/lib/api/loans/types"

const bad = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status })

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const overview = await getLoansOverview(user.id)

    return NextResponse.json({ data: overview })
  } catch (err) {
    console.error("Loans GET error:", err)
    return bad("Failed to load loans", 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const body = (await req.json()) as CreateLoanRequest

    const row = await createLoan(user.id, body)

    return NextResponse.json({ data: row })
  } catch (err) {
    console.error("Loans POST error:", err)
    return bad("Failed to create loan", 500)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const body = (await req.json()) as UpdateLoanRequest

    if (!body?.id) return bad("Loan id required")

    const row = await updateLoan(user.id, body)

    return NextResponse.json({ data: row })
  } catch (err) {
    console.error("Loans PATCH error:", err)
    return bad("Failed to update loan", 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const id = new URL(req.url).searchParams.get("id")

    if (!id) return bad("Loan id required")

    await deleteLoan(user.id, id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Loans DELETE error:", err)
    return bad("Failed to delete loan", 500)
  }
}
