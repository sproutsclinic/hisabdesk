import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { importAISFile } from "@/lib/ais/ais-importer"
import fs from "fs"
import path from "path"
import os from "os"

/*
=========================================================
AIS / 26AS IMPORT API
POST /api/ais/import

Enterprise safe
Service-role secured
Handles:
✓ CSV
✓ JSON
✓ Large files
✓ Normalization
✓ Batch DB insert

Flow:
1. Auth user
2. Resolve org
3. Save temp file
4. Parse via ais-importer
5. Insert into transactions table (existing)
6. Audit log

IMPORTANT
Reuses existing "transactions" table
(No new tables created)
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

    const {
      data: { user },
      error: userErr,
    } = await supabaseAdmin.auth.getUser(token)

    if (userErr || !user) {
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
       Read file
    --------------------------------------------------- */

    const form = await req.formData()
    const file = form.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "File required" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const tmpPath = path.join(
      os.tmpdir(),
      `${Date.now()}-${file.name}`
    )

    fs.writeFileSync(tmpPath, buffer)

    /* ---------------------------------------------------
       Parse
    --------------------------------------------------- */

    const transactions = await importAISFile(tmpPath)

    fs.unlinkSync(tmpPath)

    if (!transactions.length) {
      return NextResponse.json({
        success: true,
        inserted: 0,
      })
    }

    /* ---------------------------------------------------
       Normalize → existing transactions schema
    --------------------------------------------------- */

    const rows = transactions.map((t) => ({
      org_id: orgId,
      date: t.date,
      description: t.description,
      amount: t.amount,
      category: t.type,
      source: t.source,
      meta: {
        section: t.section,
        pan: t.pan,
        counterparty: t.counterparty,
      },
      created_at: new Date().toISOString(),
    }))

    /* ---------------------------------------------------
       Batch insert
    --------------------------------------------------- */

    const chunks = chunk(rows, 500)

    for (const c of chunks) {
      await supabaseAdmin.from("transactions").insert(c)
    }

    /* ---------------------------------------------------
       Audit log
    --------------------------------------------------- */

    await supabaseAdmin.from("audit_logs").insert({
      org_id: orgId,
      action: "ais_import",
      meta: { count: rows.length },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      inserted: rows.length,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Import failed" },
      { status: 500 }
    )
  }
}

/* ====================================================== */

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}
