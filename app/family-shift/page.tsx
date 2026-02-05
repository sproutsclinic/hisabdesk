"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  calculateOldRegimeTax,
  calculateNewRegimeTax,
} from "@/lib/tax"

import {
  Sparkles,
  Users,
  ArrowRightLeft,
  TrendingDown,
  History,
  Save,
} from "lucide-react"

/* =================================================
   FAMILY-SHIFT AI STRATEGIST + HISTORY

   Added:
   ✅ Save strategy
   ✅ History list
   ✅ Supabase persistence (family_shift_strategies)
   ✅ reload previous results
   ✅ zero breaking changes
================================================= */

type Member = {
  id: string
  name: string
  relation: string
}

type Strategy = {
  id: string
  income: number
  current_tax: number
  shifted_tax: number
  savings: number
  created_at: string
}

export default function FamilyShiftPage() {
  const [loading, setLoading] = useState(true)

  const [income, setIncome] = useState(0)
  const [members, setMembers] = useState<Member[]>([])

  const [currentTax, setCurrentTax] = useState(0)
  const [shiftTax, setShiftTax] = useState(0)

  /* ✅ NEW */
  const [userId, setUserId] = useState<string | null>(null)
  const [history, setHistory] = useState<Strategy[]>([])
  const [savingPlan, setSavingPlan] = useState(false)

  /* ================= LOAD ================= */

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return

    setUserId(user.id)

    /* income */
    const { data: incomes } = await supabase
      .from("incomes")
      .select("amount")
      .eq("user_id", user.id)

    const totalIncome =
      (incomes || []).reduce(
        (s: number, r: any) => s + Number(r.amount),
        0
      ) || 0

    setIncome(totalIncome)

    /* members */
    const { data: fam } = await supabase
      .from("family_members")
      .select("id,name,relation")

    setMembers(fam || [])

    /* current tax */
    const taxNow = Math.min(
      calculateOldRegimeTax(totalIncome),
      calculateNewRegimeTax(totalIncome)
    )

    setCurrentTax(taxNow)

    /* history */
    loadHistory(user.id)

    setLoading(false)
  }

  const loadHistory = async (uid: string) => {
    const { data } = await supabase
      .from("family_shift_strategies")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })

    setHistory(data || [])
  }

  /* ================= SIMULATION ================= */

  const simulate = () => {
    const people = members.length + 1
    if (people <= 1) return

    const splitIncome = income / people

    let tax = 0

    for (let i = 0; i < people; i++) {
      tax += Math.min(
        calculateOldRegimeTax(splitIncome),
        calculateNewRegimeTax(splitIncome)
      )
    }

    setShiftTax(tax)
  }

  /* ================= SAVE PLAN ================= */

  const savePlan = async () => {
    if (!userId || shiftTax === 0) return

    setSavingPlan(true)

    const savings = currentTax - shiftTax

    await supabase.from("family_shift_strategies").insert({
      user_id: userId,
      income,
      current_tax: currentTax,
      shifted_tax: shiftTax,
      savings,
    })

    await loadHistory(userId)
    setSavingPlan(false)
  }

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  const savings = currentTax - shiftTax

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles size={18} />
          Family Tax Strategist
        </h1>

        <p className="text-sm text-zinc-500">
          Reduce tax legally by distributing income across family
        </p>
      </div>

      {/* Income */}
      <Card className="space-y-1">
        <p className="text-xs text-zinc-500">Your Total Income</p>
        <p className="text-xl font-semibold">
          ₹ {income.toLocaleString("en-IN")}
        </p>
      </Card>

      {/* Members */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Users size={16} />
          Family Members
        </div>

        {members.length === 0 ? (
          <p className="text-xs text-zinc-500">
            Add members to enable tax shifting
          </p>
        ) : (
          members.map((m) => (
            <div key={m.id} className="flex justify-between text-sm">
              <span>{m.name}</span>
              <span className="text-zinc-500 text-xs">
                {m.relation}
              </span>
            </div>
          ))
        )}
      </Card>

      {/* Simulate */}
      <Button
        onClick={simulate}
        disabled={members.length === 0}
        className="w-full"
      >
        <ArrowRightLeft size={16} />
        Run AI Strategy
      </Button>

      {/* Result */}
      {shiftTax > 0 && (
        <Card className="space-y-3">

          <div className="flex justify-between text-sm">
            <span>Current Tax</span>
            <span>₹ {currentTax.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>After Family Split</span>
            <span>₹ {shiftTax.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between text-sm font-semibold text-green-600 items-center gap-1">
            <TrendingDown size={14} />
            Save ₹ {Math.max(savings, 0).toLocaleString("en-IN")}
          </div>

          {/* ✅ Save Button */}
          <Button onClick={savePlan} loading={savingPlan}>
            <Save size={16} />
            Save Strategy
          </Button>

        </Card>
      )}

      {/* ================= HISTORY ================= */}

      {history.length > 0 && (
        <div className="space-y-3">

          <div className="flex items-center gap-2 text-sm font-medium">
            <History size={16} />
            Previous Strategies
          </div>

          {history.map((h) => (
            <Card key={h.id} className="flex justify-between text-xs">

              <span>
                {new Date(h.created_at).toLocaleDateString("en-IN")}
              </span>

              <span className="text-green-600 font-medium">
                Saved ₹ {Number(h.savings).toLocaleString("en-IN")}
              </span>

            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-zinc-400 text-center">
        Suggestions are estimates. Always consult CA before execution.
      </p>
    </div>
  )
}
