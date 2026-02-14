// ==========================================================
// HisabDesk — Add Expense Page (Server Wrapper)
// Week 1 Day 2 — UI/Logic Separation
// ==========================================================

import AddExpenseForm from "@/components/expense/AddExpenseForm"

export default function AddExpensePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-10">
        <AddExpenseForm />
      </div>
    </div>
  )
}
