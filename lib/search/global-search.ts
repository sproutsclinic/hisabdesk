/**
 * =========================================================
 * Global Search Engine (Workspace Wide Search)
 * HisabDesk – Enterprise Productivity Layer
 * =========================================================
 *
 * PURPOSE
 * One unified search across:
 *
 *   ✓ income
 *   ✓ expenses
 *   ✓ documents
 *   ✓ members
 *   ✓ activity logs
 *
 * WHY (Enterprise MUST)
 *   Large orgs → 1000s of records
 *   Need quick search like:
 *     "amazon"
 *     "₹5000"
 *     "invoice 102"
 *
 * SAFE
 * - server only
 * - no existing files modified
 *
 * =========================================================
 *
 * USAGE
 *
 * const results = await globalSearch(orgId, "amazon")
 *
 * =========================================================
 */

"use server"

import { createClient } from "@supabase/supabase-js"

/* =========================================================
   TYPES
========================================================= */

export type SearchResult = {
  type:
    | "income"
    | "expense"
    | "document"
    | "member"
    | "activity"
  id: string
  title: string
  subtitle?: string
  url: string
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
   MAIN SEARCH
========================================================= */

export async function globalSearch(
  orgId: string,
  query: string
): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []

  const supabase = getClient()
  const q = `%${query}%`

  const results: SearchResult[] = []

  /* ======================================================
     INCOME
  ====================================================== */

  const { data: income } = await supabase
    .from("income")
    .select("id, description, amount")
    .eq("org_id", orgId)
    .ilike("description", q)
    .limit(5)

  income?.forEach((r) =>
    results.push({
      type: "income",
      id: r.id,
      title: r.description || "Income",
      subtitle: `₹ ${r.amount}`,
      url: `/org/${orgId}/finances`,
    })
  )

  /* ======================================================
     EXPENSES
  ====================================================== */

  const { data: expenses } = await supabase
    .from("expenses")
    .select("id, description, amount")
    .eq("org_id", orgId)
    .ilike("description", q)
    .limit(5)

  expenses?.forEach((r) =>
    results.push({
      type: "expense",
      id: r.id,
      title: r.description || "Expense",
      subtitle: `₹ ${r.amount}`,
      url: `/org/${orgId}/finances`,
    })
  )

  /* ======================================================
     DOCUMENTS
  ====================================================== */

  const { data: docs } = await supabase
    .from("org_documents")
    .select("id, name")
    .eq("org_id", orgId)
    .ilike("name", q)
    .limit(5)

  docs?.forEach((r) =>
    results.push({
      type: "document",
      id: r.id,
      title: r.name,
      url: `/org/${orgId}/documents`,
    })
  )

  /* ======================================================
     MEMBERS
  ====================================================== */

  const { data: members } = await supabase
    .from("organization_members")
    .select("user_id, profiles(email)")
    .eq("org_id", orgId)

  members
    ?.filter((m: any) =>
      m.profiles?.email
        ?.toLowerCase()
        .includes(query.toLowerCase())
    )
    .slice(0, 5)
    .forEach((m: any) =>
      results.push({
        type: "member",
        id: m.user_id,
        title: m.profiles?.email,
        url: `/org/${orgId}/members`,
      })
    )

  /* ======================================================
     ACTIVITY
  ====================================================== */

  const { data: activity } = await supabase
    .from("activity_logs")
    .select("id, action")
    .eq("org_id", orgId)
    .ilike("action", q)
    .limit(5)

  activity?.forEach((r) =>
    results.push({
      type: "activity",
      id: r.id,
      title: r.action.replace(/_/g, " "),
      url: `/org/${orgId}/activity`,
    })
  )

  return results
}
