/* =========================================================
   HisabDesk — Profile API (FIXED)
   Thin server route only
========================================================= */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/* ✅ FIXED — real service exports */
import {
  getProfile,
  saveOnboardingProfile,
} from "@/lib/api/profiles/profile.service"

import type { OnboardingProfileInput } from "@/lib/api/profiles/profile.service"

export const dynamic = "force-dynamic"

/* ========================================================= */

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

/* =========================================================
   GET → profile
========================================================= */

export async function GET() {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const data = await getProfile(user.id)

    return NextResponse.json({ data })
  } catch (err: any) {
    return bad(err.message || "Failed to load profile", 500)
  }
}

/* =========================================================
   PATCH → save onboarding/profile
========================================================= */

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return bad("Unauthorized", 401)

    const body = (await req.json()) as OnboardingProfileInput

    await saveOnboardingProfile(user.id, body)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return bad(err.message || "Failed to update profile", 500)
  }
}