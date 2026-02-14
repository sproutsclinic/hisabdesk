import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { reconcileAIS } from "@/lib/ais/ais-reconciliation-engine"

/*
=========================================================
AIS RECONCILIATION API
POST /api/ais/reconcile

Secure
Service-role only
Org scoped
Idempotent

Flow:
1. Validate session
2. Resolve org
3. Run reconciliation engine
4. Audit log
5. Return summary

Used by:
→ AIS dashboard
→ Tax suggestion engine
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
       Auth
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
       Resolve org
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
       Run reconciliation
    --------------------------------------------------- */

    const summary = await reconcileAIS({ orgId })

    /* ---------------------------------------------------
       Audit
    --------------------------------------------------- */

    await supabaseAdmin.from("audit_logs").insert({
      org_id: orgId,
      action: "ais_reconciliation_run",
      meta: summary,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      summary,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "AIS reconciliation failed" },
      { status: 500 }
    )
  }
}
