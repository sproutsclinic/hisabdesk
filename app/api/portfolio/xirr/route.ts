// ==========================================================
// HisabDesk — Portfolio XIRR Calculator
// ----------------------------------------------------------
// TRUE CAGR performance
// Cashflows → Newton method → XIRR
// ==========================================================

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/* =========================================================
   XIRR MATH (Newton method)
========================================================= */

function xirr(cashflows: { amount: number; date: Date }[]) {
  const guess = 0.1
  const maxIter = 100

  const days = (d: Date, d0: Date) =>
    (d.getTime() - d0.getTime()) / (1000 * 60 * 60 * 24)

  const first = cashflows[0].date

  function f(rate: number) {
    return cashflows.reduce(
      (sum, cf) =>
        sum +
        cf.amount /
          Math.pow(1 + rate, days(cf.date, first) / 365),
      0
    )
  }

  function df(rate: number) {
    return cashflows.reduce(
      (sum, cf) =>
        sum -
        (days(cf.date, first) / 365) *
          cf.amount /
          Math.pow(1 + rate, days(cf.date, first) / 365 + 1),
      0
    )
  }

  let rate = guess

  for (let i = 0; i < maxIter; i++) {
    const newRate = rate - f(rate) / df(rate)
    if (Math.abs(newRate - rate) < 1e-7) return newRate
    rate = newRate
  }

  return rate
}

/* =========================================================
   ROUTE
========================================================= */

export async function GET() {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // ------------------------------------------------------
    // fetch portfolio transactions
    // ------------------------------------------------------

    const { data: tx } = await supabase
      .from("portfolio_transactions")
      .select("amount, date, type")

    if (!tx || tx.length === 0)
      return NextResponse.json({ xirr: 0 })

    // ------------------------------------------------------
    // cashflows
    // buy  → negative
    // sell → positive
    // ------------------------------------------------------

    const flows = tx.map((t: any) => ({
      amount: t.type === "buy" ? -Number(t.amount) : Number(t.amount),
      date: new Date(t.date),
    }))

    // add current value as final positive flow
    const { data: holdings } = await supabase
      .from("portfolio")
      .select("current_value")

    const totalValue =
      holdings?.reduce((s, h) => s + Number(h.current_value), 0) || 0

    flows.push({
      amount: totalValue,
      date: new Date(),
    })

    const rate = xirr(flows)

    return NextResponse.json({
      xirr: Number((rate * 100).toFixed(2)),
    })
  } catch {
    return NextResponse.json({ xirr: 0 })
  }
}