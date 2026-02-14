/*
=========================================================
CRON: AUTO GST SYNC
Runs monthly (Vercel cron)

Flow:
1. get all orgs with gst connected
2. run syncGST(orgId)
=========================================================
*/

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { syncGST } from "@/lib/gst/gsp-sync"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    /* --------------------------------------------
       FIND ALL CONNECTED ORGS
    -------------------------------------------- */

    const { data: rows } = await supabaseAdmin
      .from("gst_credentials")
      .select("org_id")

    if (!rows?.length) {
      return NextResponse.json({ ok: true })
    }

    /* --------------------------------------------
       SYNC EACH
    -------------------------------------------- */

    for (const r of rows) {
      await syncGST(r.org_id)
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}
