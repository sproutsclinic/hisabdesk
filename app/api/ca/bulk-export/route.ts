import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import * as XLSX from "xlsx"

/*
=========================================================
CA BULK REPORT EXPORT API
POST /api/ca/bulk-export

Phase C — Day 17

Purpose:
One-click export ALL client summaries into Excel

Generates:
clients.xlsx
Sheet per client:
✓ GST summary
✓ Income
✓ Expenses
✓ Profit
✓ Issues count

Enterprise:
✓ Org scoped
✓ Multi-tenant safe
✓ Memory safe
✓ No schema changes

Used by:
→ CA dashboard "Export All"
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

    /* =====================================================
       AUTH
    ====================================================== */

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

    /* =====================================================
       GET ALL CLIENT ORGS
    ====================================================== */

    const { data: members } = await supabaseAdmin
      .from("organization_members")
      .select("organizations(id,name)")
      .eq("user_id", user.id)

    const orgs =
      members
        ?.map((m: any) => m.organizations)
        .filter(Boolean) || []

    if (!orgs.length) {
      return NextResponse.json(
        { error: "No clients found" },
        { status: 400 }
      )
    }

    /* =====================================================
       CREATE WORKBOOK
    ====================================================== */

    const wb = XLSX.utils.book_new()

    for (const org of orgs) {
      const orgId = org.id

      /* --------------------------------------------
         GST
      -------------------------------------------- */

      const { data: gst } = await supabaseAdmin
        .from("gst_summary")
        .select("*")
        .eq("org_id", orgId)
        .single()

      /* --------------------------------------------
         Income
      -------------------------------------------- */

      const { data: incomeRows } = await supabaseAdmin
        .from("income")
        .select("amount")
        .eq("org_id", orgId)

      const income =
        incomeRows?.reduce(
          (s: number, r: any) => s + Number(r.amount),
          0
        ) || 0

      /* --------------------------------------------
         Expenses
      -------------------------------------------- */

      const { data: expenseRows } = await supabaseAdmin
        .from("expenses")
        .select("amount")
        .eq("org_id", orgId)

      const expenses =
        expenseRows?.reduce(
          (s: number, r: any) => s + Number(r.amount),
          0
        ) || 0

      /* --------------------------------------------
         Issues (AI meta)
      -------------------------------------------- */

      const { data: tx } = await supabaseAdmin
        .from("transactions")
        .select("meta")
        .eq("org_id", orgId)

      const issues =
        tx?.filter(
          (t: any) =>
            t.meta?.reconciliation_status === "missing" ||
            t.meta?.anomaly ||
            t.meta?.duplicate_status
        ).length || 0

      /* --------------------------------------------
         SHEET DATA
      -------------------------------------------- */

      const rows = [
        ["Client", org.name],
        [],
        ["Income", income],
        ["Expenses", expenses],
        ["Profit", income - expenses],
        [],
        ["GST Matched", gst?.matched || 0],
        ["GST Mismatch", gst?.mismatch || 0],
        ["GST Missing", gst?.missing || 0],
        ["AI Issues", issues],
      ]

      const sheet = XLSX.utils.aoa_to_sheet(rows)

      XLSX.utils.book_append_sheet(
        wb,
        sheet,
        org.name.slice(0, 30)
      )
    }

    /* =====================================================
       EXPORT BUFFER
    ====================================================== */

    const buffer = XLSX.write(wb, {
      type: "buffer",
      bookType: "xlsx",
    })

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="clients-report.xlsx"',
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Export failed" },
      { status: 500 }
    )
  }
}
