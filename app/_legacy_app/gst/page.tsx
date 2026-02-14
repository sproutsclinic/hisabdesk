/*
=========================================================
GST DASHBOARD — SERVER COMPONENT (FINAL STABLE)
✓ uses same uid cookie as dashboard
✓ no supabase auth session dependency
✓ Next 16 safe
✓ never redirects wrongly
✓ no async cookies() bug
=========================================================
*/

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"

import GSTClient from "./GSTClient"

/* =========================================================
   SERVER SUPABASE
========================================================= */

function getSupabase(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

/* =========================================================
   PAGE
========================================================= */

export default async function GSTPage() {
  const cookieStore = await cookies()

  /* ✅ SAME AUTH AS DASHBOARD */
  const userId = cookieStore.get("uid")?.value

  if (!userId) redirect("/login")

  const supabase = getSupabase(cookieStore)

  const orgId = userId

  const [invoicesRes, summaryRes] = await Promise.all([
    supabase
      .from("gst_invoices")
      .select("*")
      .eq("org_id", orgId)
      .order("invoice_date", { ascending: false })
      .limit(200),

    supabase
      .from("gst_summary")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ])

  return (
    <GSTClient
      orgId={orgId}
      invoices={invoicesRes.data ?? []}
      summary={summaryRes.data ?? null}
    />
  )
}
