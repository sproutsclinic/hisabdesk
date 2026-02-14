// ==========================================================
// HisabDesk — Expenses Root Redirect
// Server-side redirect (enterprise safe)
// ==========================================================

import { redirect } from "next/navigation"

export default function ExpensesPage() {
  redirect("/expense/list")
}
