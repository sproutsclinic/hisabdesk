ï»¿/*
=========================================================
AI TAX SUGGESTIONS ENGINE
Phase B ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Day 10

Purpose:
Generate actionable tax saving insights using:
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ GST data
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ AIS income
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Books (transactions)
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Presumptive 44ADA/44AD logic
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Deductions detection

NO AI API calls
Pure deterministic intelligence (fast + cheap + reliable)

Output:
Human readable suggestions list for UI

Used by:
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ /api/ai/tax-suggestions
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Dashboard widgets
ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ CA advisory panel
=========================================================
*/

import { getSupabaseAdmin } from "@/lib/supabase/gateway"

/* ====================================================== */

export type SuggestionPriority = "high" | "medium" | "low"

export interface TaxSuggestion {
  id: string
  title: string
  message: string
  impact?: number
  priority: SuggestionPriority
}

/* ====================================================== */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ======================================================
MAIN ENGINE
====================================================== */

export async function generateTaxSuggestions(orgId: string) {
  const [txRes, aisRes, gstRes] = await Promise.all([
    supabase.from("transactions").select("*").eq("org_id", orgId),

    supabase
      .from("transactions")
      .select("*")
      .eq("org_id", orgId)
      .in("source", ["AIS", "26AS"]),

    supabase
      .from("gst_summary")
      .select("*")
      .eq("org_id", orgId)
      .single(),
  ])

  const transactions = txRes.data || []
  const ais = aisRes.data || []
  const gst = gstRes.data || {}

  const suggestions: TaxSuggestion[] = []

  /* ====================================================
     1. Missing AIS income
  ==================================================== */

  const unreconciled = ais.filter(
    (t) => t.meta?.reconciliation_status === "missing"
  )

  if (unreconciled.length) {
    const amount = sum(unreconciled)

    suggestions.push({
      id: "ais-missing-income",
      title: "Unreported AIS Income Detected",
      message: `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${format(amount)} income appears in AIS but not in books. Add entries to avoid notice.`,
      impact: amount,
      priority: "high",
    })
  }

  /* ====================================================
     2. High expenses vs revenue (profit leakage)
  ==================================================== */

  const revenue = sum(
    transactions.filter((t) => t.amount > 0)
  )

  const expenses = Math.abs(
    sum(transactions.filter((t) => t.amount < 0))
  )

  if (revenue > 0) {
    const ratio = expenses / revenue

    if (ratio > 0.8) {
      suggestions.push({
        id: "expense-heavy",
        title: "Very High Expense Ratio",
        message:
          "Expenses exceed 80% of revenue. Verify deductions to avoid scrutiny.",
        priority: "medium",
      })
    }
  }

  /* ====================================================
     3. 44ADA Presumptive check (professionals)
  ==================================================== */

  if (revenue <= 7500000) {
    const presumptiveIncome = revenue * 0.5

    suggestions.push({
      id: "44ada-option",
      title: "Consider Section 44ADA",
      message: `You may declare ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${format(
        presumptiveIncome
      )} (50%) as income without books & audits.`,
      impact: presumptiveIncome,
      priority: "medium",
    })
  }

  /* ====================================================
     4. GST mismatch risk
  ==================================================== */

  const mismatch =
    (gst.mismatch || 0) +
    (gst.missing || 0) +
    (gst.partial || 0)

  if (mismatch > 0) {
    suggestions.push({
      id: "gst-mismatch",
      title: "GST Reconciliation Issues",
      message: `${mismatch} invoices have mismatch/missing status. Fix before filing GSTR.`,
      priority: "high",
    })
  }

  /* ====================================================
     5. TDS refund opportunity
  ==================================================== */

  const tds = ais.filter((t) =>
    (t.description || "").toLowerCase().includes("tds")
  )

  const totalTDS = sum(tds)

  if (totalTDS > 0 && totalTDS > revenue * 0.1) {
    suggestions.push({
      id: "tds-refund",
      title: "Possible TDS Refund",
      message: `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹${format(
        totalTDS
      )} TDS detected. You may be eligible for refund.`,
      impact: totalTDS,
      priority: "medium",
    })
  }

  /* ====================================================
     6. No savings/deduction expenses
  ==================================================== */

  const savingsKeywords = [
    "insurance",
    "pf",
    "ppf",
    "elss",
    "nps",
    "mediclaim",
  ]

  const hasSavings = transactions.some((t) =>
    savingsKeywords.some((k) =>
      (t.description || "").toLowerCase().includes(k)
    )
  )

  if (!hasSavings) {
    suggestions.push({
      id: "no-80c",
      title: "No Tax Saving Investments Found",
      message:
        "Consider 80C/80D investments to reduce tax liability.",
      priority: "low",
    })
  }

  /* ==================================================== */

  return sortByPriority(suggestions)
}

/* ======================================================
UTILS
====================================================== */

function sum(rows: any[]) {
  return rows.reduce(
    (a, b) => a + Number(b.amount || 0),
    0
  )
}

function format(n: number) {
  return new Intl.NumberFormat("en-IN").format(Math.round(n))
}

function sortByPriority(list: TaxSuggestion[]) {
  const order = { high: 0, medium: 1, low: 2 }

  return list.sort(
    (a, b) => order[a.priority] - order[b.priority]
  )
}
