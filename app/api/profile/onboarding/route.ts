// ==========================================================
// Profile Onboarding API
// Route: /api/profile/onboarding
//
// PURPOSE
// Save first-time user setup
//
// Flow:
// UI → API → service → DB
//
// RULES
// ✅ thin transport layer
// ✅ auth guard
// ❌ NO business logic
// ❌ NO calculations
// ❌ NO Supabase queries here
// ==========================================================

import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/security/guards"
import { saveOnboardingProfile } from "@/lib/api/profile/profile.service"

/* =========================================================
POST /api/profile/onboarding
========================================================= */

export async function POST(req: NextRequest) {
  try {
    // ------------------------------------------------------
    // Auth
    // ------------------------------------------------------

    const user = await requireUser()

    // ------------------------------------------------------
    // Body
    // ------------------------------------------------------

    const body = await req.json()

    const payload = {
      risk: body.risk,
      dependents: body.dependents,
      monthlyIncome: body.monthlyIncome,
      monthlyExpense: body.monthlyExpense,
      primaryGoal: body.primaryGoal,
    }

    // ------------------------------------------------------
    // Service
    // ------------------------------------------------------

    await saveOnboardingProfile(user.id, payload)

    // ------------------------------------------------------
    // Response
    // ------------------------------------------------------

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[ONBOARDING_POST_ERROR]", err)

    return NextResponse.json(
      { error: "Failed to save onboarding" },
      { status: 400 }
    )
  }
}
