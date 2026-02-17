ï»¿import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"

import {
  getAutomationOverview,
} from "@/lib/api/automation/service"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const overview = await getAutomationOverview(user.id)

    return NextResponse.json({ overview })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
