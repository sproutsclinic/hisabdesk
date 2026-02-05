import { createClient } from "@supabase/supabase-js"

/* =================================================
   AI RISK + SAFETY ENGINE — Phase 8 (FINAL)

   Detects:
   ✅ missing insurance
   ✅ no nominee
   ✅ low coverage
   ✅ premium due soon (7 days)
   ✅ expiry soon (30 days)
   ✅ expired policies
   ✅ loans missing EMI
   ✅ high interest loans
   ✅ no tax investments

   Returns:
   [
     { type: "insurance" | "loan" | "tax", message: string }
   ]

   SAFE:
   - read only
   - server only
   - fast single query
================================================= */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Risk = {
  type: "insurance" | "loan" | "tax"
  message: string
}

export async function GET() {
  const risks: Risk[] = []

  try {
    /* ================= DATES ================= */

    const today = new Date()

    const next7 = new Date()
    next7.setDate(today.getDate() + 7)

    const next30 = new Date()
    next30.setDate(today.getDate() + 30)

    /* ================= LOAD VAULT ================= */

    const { data: items } = await supabase
      .from("vault_items")
      .select("title, category, metadata")

    if (!items || items.length === 0) {
      return Response.json([])
    }

    const insurance = items.filter((i) => i.category === "insurance")
    const loans = items.filter((i) => i.category === "loans")
    const tax = items.filter((i) => i.category === "tax")

    /* =================================================
       INSURANCE INTELLIGENCE
    ================================================= */

    if (insurance.length === 0) {
      risks.push({
        type: "insurance",
        message:
          "No insurance policies added. Your family may be financially unprotected.",
      })
    }

    insurance.forEach((i) => {
      const m = i.metadata || {}

      const coverage = Number(m.coverage_amount || 0)

      /* nominee */
      if (!m.nominee) {
        risks.push({
          type: "insurance",
          message: `Policy "${i.title}" has no nominee added.`,
        })
      }

      /* low coverage */
      if (coverage > 0 && coverage < 500000) {
        risks.push({
          type: "insurance",
          message: `Coverage for "${i.title}" looks low. Consider increasing protection.`,
        })
      }

      /* premium due soon */
      if (m.due_date) {
        const due = new Date(m.due_date)

        if (due >= today && due <= next7) {
          risks.push({
            type: "insurance",
            message: `Premium due soon for "${i.title}" on ${due.toLocaleDateString("en-IN")}.`,
          })
        }
      }

      /* expiry */
      if (m.expiry_date) {
        const exp = new Date(m.expiry_date)

        if (exp < today) {
          risks.push({
            type: "insurance",
            message: `"${i.title}" policy has expired. Renew immediately.`,
          })
        } else if (exp <= next30) {
          risks.push({
            type: "insurance",
            message: `"${i.title}" expires on ${exp.toLocaleDateString("en-IN")}. Renew soon.`,
          })
        }
      }
    })

    /* =================================================
       LOAN INTELLIGENCE
    ================================================= */

    loans.forEach((i) => {
      const m = i.metadata || {}
      const rate = Number(m.interest_rate || 0)

      if (!m.emi_date) {
        risks.push({
          type: "loan",
          message: `Loan "${i.title}" missing EMI schedule.`,
        })
      }

      if (rate >= 15) {
        risks.push({
          type: "loan",
          message: `"${i.title}" interest rate is high. Consider refinancing.`,
        })
      }
    })

    /* =================================================
       TAX INTELLIGENCE
    ================================================= */

    if (tax.length === 0) {
      risks.push({
        type: "tax",
        message:
          "No tax-saving investments found. You may be losing 80C deductions.",
      })
    }

    /* remove duplicates (safety) */
    const unique = Array.from(
      new Map(risks.map((r) => [r.message, r])).values()
    )

    return Response.json(unique)
  } catch {
    return Response.json([])
  }
}
