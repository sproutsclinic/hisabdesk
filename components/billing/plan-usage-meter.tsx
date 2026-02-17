ï»¿"use client"

/**
 * =========================================================
 * Plan Usage Meter (Billing + Limits UI)
 * HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Growth / Monetization Layer
 * =========================================================
 *
 * PURPOSE
 * Show subscription usage clearly:
 *
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ invoices used
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ expenses count
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ storage/docs count
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ % usage
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ upgrade nudges
 *
 * WHY (Revenue critical)
 * ---------------------------------------------------------
 * Visible limits ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ upgrades increase 20ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“40%
 *
 * This drives:
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ Pro upgrades
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ plan awareness
 *   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ reduced support tickets
 *
 * Similar to:
 *   Notion usage bar
 *   Stripe billing meter
 *   Vercel usage dashboard
 *
 * =========================================================
 *
 * CONNECTS
 *   profiles (is_pro)
 *   income
 *   expenses
 *   org_documents
 *
 * USAGE
 *
 * <PlanUsageMeter orgId={orgId} />
 *
 * Place:
 *   billing page OR dashboard header
 *
 * =========================================================
 *
 * SAFE
 * - read only
 * - client component
 * =========================================================
 */

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

/* =========================================================
   PLAN LIMITS
========================================================= */

const FREE_LIMITS = {
  expenses: 100,
  invoices: 50,
  documents: 20,
}

const PRO_LIMITS = {
  expenses: 100000,
  invoices: 100000,
  documents: 100000,
}

/* =========================================================
   TYPES
========================================================= */

type Usage = {
  expenses: number
  invoices: number
  documents: number
  isPro: boolean
}

/* =========================================================
   COMPONENT
========================================================= */

export default function PlanUsageMeter({
  orgId,
}: {
  orgId: string
}) {
  const [usage, setUsage] = useState<Usage>({
    expenses: 0,
    invoices: 0,
    documents: 0,
    isPro: false,
  })

  /* ======================================================
     LOAD DATA
  ====================================================== */

  useEffect(() => {
    load()
  }, [orgId])

  async function load() {
    const [profile, exp, inc, docs] = await Promise.all([
      supabase
        .from("profiles")
        .select("is_pro")
        .single(),

      supabase
        .from("expenses")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId),

      supabase
        .from("income")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId),

      supabase
        .from("org_documents")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId),
    ])

    setUsage({
      expenses: exp.count || 0,
      invoices: inc.count || 0,
      documents: docs.count || 0,
      isPro: profile.data?.is_pro || false,
    })
  }

  const limits = usage.isPro ? PRO_LIMITS : FREE_LIMITS

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="border rounded-xl bg-white p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">
          Plan Usage
        </h3>

        {!usage.isPro && (
          <a
            href="/billing"
            className="text-xs text-blue-600 underline"
          >
            Upgrade ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢
          </a>
        )}
      </div>

      <Meter
        label="Expenses"
        used={usage.expenses}
        limit={limits.expenses}
      />

      <Meter
        label="Invoices"
        used={usage.invoices}
        limit={limits.invoices}
      />

      <Meter
        label="Documents"
        used={usage.documents}
        limit={limits.documents}
      />
    </div>
  )
}

/* =========================================================
   METER
========================================================= */

function Meter({
  label,
  used,
  limit,
}: {
  label: string
  used: number
  limit: number
}) {
  const pct = Math.min((used / limit) * 100, 100)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>
          {used} / {limit}
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            pct > 90
              ? "bg-red-500"
              : pct > 70
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
