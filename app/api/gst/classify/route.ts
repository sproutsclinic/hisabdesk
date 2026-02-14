import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { classifyGSTInvoices } from "@/lib/gst/classification-engine"

/*
=========================================================
GST CLASSIFICATION API
POST /api/gst/classify

Secure
Org scoped
Service role only
Idempotent
Enterprise safe

Body:
{ orgId?: string }

Auto-resolves org from session if missing
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

    // ---------------------------------------------------
    // Resolve org from auth session
    // ---------------------------------------------------
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

    // ---------------------------------------------------
    // Run classification engine
    // ---------------------------------------------------
    const breakdown = await classifyGSTInvoices({ orgId })

    // ---------------------------------------------------
    // Audit trail
    // ---------------------------------------------------
    await supabaseAdmin.from("audit_logs").insert({
      org_id: orgId,
      action: "gst_classification_run",
      meta: breakdown,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      breakdown,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || "Classification failed",
      },
      { status: 500 }
    )
  }
}
