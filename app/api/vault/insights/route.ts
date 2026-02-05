import { createClient } from "@supabase/supabase-js"

/* =================================================
   AI INSIGHTS ENGINE — Phase 8 (FINAL PRO)

   Purpose:
   ✅ proactive financial advice (positive nudges)
   ✅ tax optimization
   ✅ insurance gap detection
   ✅ loan optimization
   ✅ savings discipline
   ✅ emergency fund coaching
   ✅ net worth growth hints

   Returns:
   [
     { type: "tax" | "insurance" | "loan" | "wealth", message: string }
   ]

   SAFE:
   - read only
   - server only
   - zero writes
================================================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Insight = {
  type: "tax" | "insurance" | "loan" | "wealth"
  message: string
}

export async function GET() {
  const insights: Insight[] = []

  try {
    /* ================= LOAD ================= */

    const [
      { data: incomes },
      { data: expenses },
      { data: deductionsRow },
      { data: vault },
    ] = await Promise.all([
      supabase.from("incomes").select("amount"),
      supabase.from("expenses").select("amount"),
      supabase.from("deductions").select("total").single(),
      supabase.from("vault_items").select("category, metadata"),
    ])

    const totalIncome =
      (incomes || []).reduce((s: number, r: any) => s + Number(r.amount), 0)

    const totalExpense =
      (expenses || []).reduce((s: number, r: any) => s + Number(r.amount), 0)

    const deductions = Number(deductionsRow?.total || 0)

    const items = vault || []

    const insurance = items.filter(i => i.category === "insurance")
    const loans = items.filter(i => i.category === "loans")
    const tax = items.filter(i => i.category === "tax")
    const assets = items.filter(i =>
      ["property", "tax", "insurance"].includes(i.category)
    )

    const savings = totalIncome - totalExpense

    /* =================================================
       TAX INTELLIGENCE
    ================================================= */

    const LIMIT_80C = 150000

    if (deductions < LIMIT_80C) {
      insights.push({
        type: "tax",
        message: `You still have ₹${(
          LIMIT_80C - deductions
        ).toLocaleString("en-IN")} available under 80C for tax saving.`,
      })
    }

    if (tax.length === 0) {
      insights.push({
        type: "tax",
        message:
          "Start PPF/ELSS/NPS investments to legally reduce taxes and build wealth.",
      })
    }

    /* =================================================
       INSURANCE INTELLIGENCE
    ================================================= */

    const recommendedCover = totalIncome * 10

    let currentCover = 0
    insurance.forEach(i => {
      currentCover += Number(i.metadata?.coverage_amount || 0)
    })

    if (insurance.length === 0) {
      insights.push({
        type: "insurance",
        message:
          "Add at least one term or health insurance policy to protect your family.",
      })
    }

    if (currentCover > 0 && currentCover < recommendedCover) {
      insights.push({
        type: "insurance",
        message: `Your total life cover looks low. Ideal ≈ ₹${recommendedCover.toLocaleString(
          "en-IN"
        )}.`,
      })
    }

    /* =================================================
       LOAN INTELLIGENCE
    ================================================= */

    loans.forEach(i => {
      const rate = Number(i.metadata?.interest_rate || 0)

      if (rate >= 14) {
        insights.push({
          type: "loan",
          message:
            "High interest loan detected. Refinancing could save significant money.",
        })
      }
    })

    if (loans.length > 0 && savings > 0) {
      insights.push({
        type: "loan",
        message:
          "Using extra savings to prepay loans may give better returns than investing.",
      })
    }

    /* =================================================
       WEALTH / CASHFLOW INTELLIGENCE
    ================================================= */

    if (totalIncome > 0) {
      const expenseRatio = totalExpense / totalIncome

      if (expenseRatio > 0.8) {
        insights.push({
          type: "wealth",
          message:
            "Expenses exceed 80% of income. Aim to save at least 20% monthly.",
        })
      }

      if (savings > 0) {
        insights.push({
          type: "wealth",
          message: `Nice! You're saving ₹${Math.round(
            savings
          ).toLocaleString("en-IN")} this period.`,
        })
      }
    }

    /* =================================================
       EMERGENCY FUND
    ================================================= */

    if (totalExpense > 0 && savings > 0) {
      const monthsCovered = Math.floor((savings * 6) / totalExpense)

      if (monthsCovered < 3) {
        insights.push({
          type: "wealth",
          message:
            "Build an emergency fund covering at least 3–6 months of expenses.",
        })
      }
    }

    /* =================================================
       ORGANIZATION SCORE (behavioral retention trick)
    ================================================= */

    if (assets.length >= 5) {
      insights.push({
        type: "wealth",
        message:
          "Great job organizing your financial documents. You're building a strong safety net.",
      })
    }

    /* =================================================
       REMOVE DUPLICATES
    ================================================= */

    const unique = Array.from(
      new Map(insights.map(i => [i.message, i])).values()
    )

    return Response.json(unique)
  } catch {
    return Response.json([])
  }
}
