import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateTaxSuggestions } from "@/lib/ai/tax-suggestions-engine"

/*
=========================================================
AI TAX SUGGESTIONS API
POST /api/ai/tax-suggestions

Secure
Org scoped
Service role
Deterministic (no external AI calls)
Fast (<200ms typical)

Flow:
1. Validate auth
2. Resolve org
3. Run engine
4. Audit log
5. Return suggestions

Used by:
→ Dashboard
→ CA panel
→ Advisory widgets
=========================================================
*/

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.replace("Bearer ", "")

    /* ---------------------------------------------------
       AUTH
    --------------------------------------------------- */

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      )
    }

    /* ---------------------------------------------------
       ORG RESOLUTION
    --------------------------------------------------- */

    const { data: member } = await supabaseAdmin
      .from("organization_members")
      .select("org_id")
      .eq("user_id", user.id)
      .limit(1)
      .single()

    const orgId = member?.org_id

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 400 }
      )
    }

    /* ---------------------------------------------------
       RUN ENGINE
    --------------------------------------------------- */

    const suggestions = await generateTaxSuggestions(orgId)

    /* ---------------------------------------------------
       AUDIT
    --------------------------------------------------- */

    await supabaseAdmin.from("audit_logs").insert({
      org_id: orgId,
      action: "tax_suggestions_generated",
      meta: { count: suggestions.length },
      created_at: new Date().toISOString(),
    })

    /* --------------------------------------------------- */

    return NextResponse.json({
      success: true,
      suggestions,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to generate suggestions" },
      { status: 500 }
    )
  }
}
