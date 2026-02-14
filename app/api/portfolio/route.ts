/* =========================================================
   HisabDesk — Profile API Route
   ---------------------------------------------------------
   SERVER ROUTE ONLY

   PURPOSE
   - fetch profile
   - update preferences
   - onboarding status
   - thin controller only

   ARCHITECTURE
     Client (hook)
        ↓
     /api/profile
        ↓
     service
        ↓
     DB

   RULES
   ✅ server only
   ✅ DB only via service
   ✅ no business logic
   ❌ no Supabase here
   ❌ no calculations
   ❌ no AI

   METHODS
   GET   → fetch profile
   PATCH → update profile
   ========================================================= */

import { NextRequest, NextResponse } from "next/server"

import { requireUser } from "@/lib/security/guards"

import {
  getProfile,
  updateProfile,
} from "@/lib/api/profile/profile.service"

/* =========================================================
   Helpers
   ========================================================= */

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/* =========================================================
   GET → FETCH PROFILE
   ========================================================= */

export async function GET() {
  try {
    const user = await requireUser()

    const profile = await getProfile(user.id)

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (err) {
    console.error("Profile GET error:", err)
    return bad("Failed to load profile", 500)
  }
}

/* =========================================================
   PATCH → UPDATE PROFILE
   ========================================================= */

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser()

    const body = await req.json()

    const updated = await updateProfile(user.id, body)

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (err) {
    console.error("Profile PATCH error:", err)
    return bad("Failed to update profile", 500)
  }
}
