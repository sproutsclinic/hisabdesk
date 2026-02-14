import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { reconcileGSTInvoices } from "@/lib/gst/reconciliation-engine"

/*
=========================================================
GST RECONCILIATION API
POST /api/gst/reconcile

Secure
Org-scoped
Service role safe
Rate-limit friendly
Idempotent

Body:
{ orgId?: string }

If orgId not passed → auto resolve from user session
=========================================================
*/

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    let orgId: string | undefined = body?.orgId

    // -------------------------
    // Resolve org from user if not provided
    // -------------------------
    if (!orgId) {
      const authHeader = req.headers.get("authorization")

      if (!authHeader) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }

      const token = authHeader.replace("Bearer ", "")

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

      const { data: member } = await supabaseAdmin
        .from("organization_members")
        .select("org_id")
        .eq("user_id", user.id)
        .limit(1)
        .single()

      orgId = member?.org_id
    }

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 400 }
      )
    }

    // -------------------------
    // Run reconciliation
    // -------------------------
    const summary = await reconcileGSTInvoices({
      orgId,
    })

    // -------------------------
    // Audit log
    // -------------------------
    await supabaseAdmin.from("audit_logs").insert({
      org_id: orgId,
      action: "gst_reconciliation_run",
      meta: summary,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      summary,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || "Reconciliation failed",
      },
      { status: 500 }
    )
  }
}
