import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/*
=========================================================
CA BULK GST SYNC API
POST /api/ca/bulk-gst-sync

Phase C — Day 19

Purpose:
Run GST sync for ALL client organizations in one click

Runs per org:
✓ GST Sync
✓ Reconciliation
✓ Classification

Enterprise:
✓ Multi-tenant safe
✓ Service role
✓ Sequential execution (rate-limit safe)
✓ Audit logged

Flow:
1. Auth CA
2. Fetch all member orgs
3. For each org → call internal engines
4. Return summary

Used by:
→ CA Dashboard "Sync All Clients"
=========================================================
*/

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ====================================================== */

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
       GET ALL CLIENT ORGS
    --------------------------------------------------- */

    const { data: members } = await supabaseAdmin
      .from("organization_members")
      .select("org_id")
      .eq("user_id", user.id)

    const orgIds =
      members?.map((m: any) => m.org_id) || []

    if (!orgIds.length) {
      return NextResponse.json({
        success: true,
        processed: 0,
      })
    }

    /* ---------------------------------------------------
       PROCESS LOOP (safe sequential)
    --------------------------------------------------- */

    const results: {
      orgId: string
      status: "success" | "failed"
      error?: string
    }[] = []

    for (const orgId of orgIds) {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }

        /* GST Sync */
        await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/gst/sync`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ orgId }),
          }
        )

        /* Reconcile */
        await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/gst/reconcile`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ orgId }),
          }
        )

        /* Classify */
        await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/gst/classify`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ orgId }),
          }
        )

        results.push({ orgId, status: "success" })
      } catch (e: any) {
        results.push({
          orgId,
          status: "failed",
          error: e.message,
        })
      }
    }

    /* ---------------------------------------------------
       AUDIT
    --------------------------------------------------- */

    await supabaseAdmin.from("audit_logs").insert({
      org_id: null,
      action: "ca_bulk_gst_sync",
      meta: {
        total: results.length,
        success: results.filter(
          (r) => r.status === "success"
        ).length,
      },
      created_at: new Date().toISOString(),
    })

    /* --------------------------------------------------- */

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Bulk sync failed" },
      { status: 500 }
    )
  }
}
