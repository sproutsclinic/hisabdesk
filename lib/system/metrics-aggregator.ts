/**
 * =========================================================
 * Metrics Aggregator (Enterprise System Metrics Engine)
 * HisabDesk – Observability / Admin Analytics
 * =========================================================
 *
 * PURPOSE
 * Central place to compute:
 *
 *   ✓ total users
 *   ✓ active users (7d)
 *   ✓ organizations
 *   ✓ pro subscribers
 *   ✓ MRR
 *   ✓ total transactions
 *   ✓ storage usage
 *
 * WHY
 * Your current:
 *   app/admin/system/page.tsx
 * already shows health checks.
 *
 * This file ADDS:
 *   business + product metrics
 * for deeper enterprise observability.
 *
 * SAFE
 * - server only
 * - does NOT modify any existing code
 *
 * =========================================================
 *
 * USAGE
 *
 * import { getSystemMetrics } from "@/lib/system/metrics-aggregator"
 *
 * const metrics = await getSystemMetrics()
 *
 * =========================================================
 */

"use server"

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   TYPES
========================================================= */

export type SystemMetrics = {
  users: number
  activeUsers7d: number
  organizations: number
  proUsers: number
  mrr: number
  transactions: number
  storageMB: number
}

/* =========================================================
   CLIENT
========================================================= */

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

/* =========================================================
   HELPERS
========================================================= */

async function count(
  table: string,
  filter?: (q: any) => any
): Promise<number> {
  const supabase = getClient()

  let query = supabase
    .from(table)
    .select("*", { count: "exact", head: true })

  if (filter) query = filter(query)

  const { count } = await query
  return count || 0
}

/* =========================================================
   STORAGE ESTIMATE
========================================================= */

async function estimateStorageMB(): Promise<number> {
  try {
    const supabase = getClient()

    const { data } = await supabase.storage
      .from("documents")
      .list("", { limit: 1000 })

    const bytes =
      data?.reduce(
        (s: number, f: any) => s + (f.metadata?.size || 0),
        0
      ) || 0

    return Math.round(bytes / 1024 / 1024)
  } catch {
    return 0
  }
}

/* =========================================================
   MAIN
========================================================= */

export async function getSystemMetrics(): Promise<SystemMetrics> {
  const supabase = getClient()

  /* ------------------------------------------------------
     USERS
  ------------------------------------------------------ */

  const users = await count("profiles")

  const last7 = new Date()
  last7.setDate(last7.getDate() - 7)

  const activeUsers7d = await count("activity_logs", (q) =>
    q.gte("created_at", last7.toISOString())
  )

  /* ------------------------------------------------------
     ORGS
  ------------------------------------------------------ */

  const organizations = await count("organizations")

  /* ------------------------------------------------------
     PRO USERS
  ------------------------------------------------------ */

  const proUsers = await count("profiles", (q) =>
    q.eq("is_pro", true)
  )

  /* ------------------------------------------------------
     MRR (simple flat pricing)
  ------------------------------------------------------ */

  const PLAN_PRICE = 999
  const mrr = proUsers * PLAN_PRICE

  /* ------------------------------------------------------
     TRANSACTIONS
  ------------------------------------------------------ */

  const incomeCount = await count("income")
  const expenseCount = await count("expenses")

  const transactions = incomeCount + expenseCount

  /* ------------------------------------------------------
     STORAGE
  ------------------------------------------------------ */

  const storageMB = await estimateStorageMB()

  return {
    users,
    activeUsers7d,
    organizations,
    proUsers,
    mrr,
    transactions,
    storageMB,
  }
}
