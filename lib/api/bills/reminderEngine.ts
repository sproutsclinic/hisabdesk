ï»¿import type { BillComputed } from "./types"

export function getUpcomingReminders(rows: BillComputed[]) {
  const today = new Date()

  return rows.filter((b) => {
    const due = new Date(b.nextDueDate)
    const diff =
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

    return diff >= 0 && diff <= 2
  })
}
