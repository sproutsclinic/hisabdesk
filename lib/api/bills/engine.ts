ï»¿/* =========================================================
   Bills Engine
   PURE LOGIC ONLY
   ========================================================= */

import type {
  BillRow,
  BillComputed,
  BillsOverview,
} from "./types"

/* ========================================================= */

function nextDueDate(day: number) {
  const today = new Date()

  const next = new Date(
    today.getFullYear(),
    today.getMonth(),
    day,
  )

  if (next < today) {
    next.setMonth(next.getMonth() + 1)
  }

  return next
}

function daysBetween(a: Date, b: Date) {
  return Math.ceil(
    (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24),
  )
}

/* ========================================================= */

export function computeBillsOverview(
  rows: BillRow[],
): BillsOverview {
  const today = new Date()

  const computed: BillComputed[] = rows.map((b) => {
    const next = nextDueDate(b.due_day)

    return {
      ...b,
      nextDueDate: next.toISOString(),
      daysLeft: daysBetween(today, next),
    }
  })

  const totalMonthly = computed.reduce(
    (a, b) => a + b.amount,
    0,
  )

  const upcomingThisMonth = computed
    .filter((b) => b.daysLeft <= 30)
    .reduce((a, b) => a + b.amount, 0)

  const autoPayCount = computed.filter((b) => b.auto_pay).length

  return {
    bills: computed,
    summary: {
      totalMonthly,
      upcomingThisMonth,
      autoPayCount,
      activeBills: computed.length,
    },
  }
}
