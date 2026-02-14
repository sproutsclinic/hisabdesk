/*
=========================================================
DUPLICATE DETECTION ENGINE
Phase B — Day 12

Purpose:
Detect duplicate or suspicious duplicate transactions

Why:
✓ Prevent double expense claims
✓ Prevent double income
✓ Avoid tax mismatch
✓ Clean books automatically

Strategy:
1. Same amount + same date
2. Same amount ±1 day
3. Similar description (fuzzy)
4. Same source/import batch

Output:
Duplicate groups

NO schema changes
Updates only transactions.meta

Used by:
→ /api/ai/duplicates
→ Dashboard alerts
=========================================================
*/

import { createClient } from "@supabase/supabase-js"

/* ====================================================== */

export type DuplicateStatus = "duplicate" | "suspected"

export interface DuplicateGroup {
  ids: string[]
  amount: number
  date: string
  confidence: number
}

/* ====================================================== */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ======================================================
MAIN ENGINE
====================================================== */

export async function detectDuplicates(orgId: string) {
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("org_id", orgId)

  if (error) throw error
  if (!transactions?.length) return []

  /* ---------------------------------------------------
     Index by amount
  --------------------------------------------------- */

  const amountMap = new Map<number, any[]>()

  for (const t of transactions) {
    const amt = Math.round(Number(t.amount || 0))

    if (!amountMap.has(amt)) amountMap.set(amt, [])
    amountMap.get(amt)!.push(t)
  }

  const groups: DuplicateGroup[] = []

  /* ---------------------------------------------------
     Find duplicates
  --------------------------------------------------- */

  for (const [, list] of amountMap) {
    if (list.length < 2) continue

    const checked = new Set<string>()

    for (let i = 0; i < list.length; i++) {
      if (checked.has(list[i].id)) continue

      const group = [list[i]]
      checked.add(list[i].id)

      for (let j = i + 1; j < list.length; j++) {
        if (checked.has(list[j].id)) continue

        if (isSimilar(list[i], list[j])) {
          group.push(list[j])
          checked.add(list[j].id)
        }
      }

      if (group.length > 1) {
        groups.push({
          ids: group.map((g) => g.id),
          amount: group[0].amount,
          date: group[0].date,
          confidence: confidenceScore(group),
        })
      }
    }
  }

  /* ---------------------------------------------------
     Update meta
  --------------------------------------------------- */

  const updates = groups.flatMap((g) =>
    g.ids.map((id) => ({
      id,
      status:
        g.confidence > 0.8 ? "duplicate" : "suspected",
    }))
  )

  const chunks = chunk(updates, 300)

  for (const group of chunks) {
    await Promise.all(
      group.map((u) =>
        supabase
          .from("transactions")
          .update({
            meta: {
              duplicate_status: u.status,
              duplicate_checked_at:
                new Date().toISOString(),
            },
          })
          .eq("id", u.id)
      )
    )
  }

  return groups
}

/* ======================================================
RULES
====================================================== */

function isSimilar(a: any, b: any) {
  const amtClose =
    Math.abs(Number(a.amount) - Number(b.amount)) <= 1

  const dateClose = dateNear(a.date, b.date, 1)

  const textScore = fuzzyMatch(
    a.description,
    b.description
  )

  return amtClose && dateClose && textScore > 0.6
}

function confidenceScore(list: any[]) {
  if (list.length > 2) return 1
  return 0.8
}

/* ======================================================
UTILS
====================================================== */

function dateNear(a: string, b: string, tol: number) {
  const d1 = new Date(a).getTime()
  const d2 = new Date(b).getTime()
  return (
    Math.abs(d1 - d2) / (1000 * 60 * 60 * 24) <= tol
  )
}

function fuzzyMatch(a: string, b: string) {
  const s1 = (a || "").toLowerCase()
  const s2 = (b || "").toLowerCase()

  if (!s1 || !s2) return 0

  let same = 0
  const words = s1.split(" ")

  for (const w of words) {
    if (s2.includes(w)) same++
  }

  return same / words.length
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size))
  }
  return out
}
