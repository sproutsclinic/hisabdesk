"use client"

// ==========================================================
// HisabDesk — Add Expense (FINAL CLEAN + AI AUTO CATEGORY)
// Mobile first
// Auto categorization on merchant input
// ==========================================================

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createExpense } from "@/lib/api/expenses"

export default function Page() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("Other")

  // ========================================================
  // AI AUTO CATEGORY
  // ========================================================

  async function autoCategorize(text: string) {
    if (!text) return

    try {
      const res = await fetch("/api/ai/expense-categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const json = await res.json()
      setCategory(json?.category || "Other")
    } catch {
      setCategory("Other")
    }
  }

  // ========================================================
  // SAVE
  // ========================================================

  async function handleSubmit(formData: FormData) {
    setLoading(true)

    try {
      await createExpense({
        date: String(formData.get("date")),
        amount: Number(formData.get("amount")),
        category,
        notes: String(formData.get("notes") || ""),
      })

      router.push("/expense") // ✅ matches your actual route
    } finally {
      setLoading(false)
    }
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <main className="max-w-md mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">Add Expense</h1>

      <form action={handleSubmit} className="space-y-3">
        {/* Date */}
        <input
          type="date"
          name="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="w-full border rounded-lg p-3"
        />

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="₹ Amount"
          required
          className="w-full border rounded-lg p-3 text-red-600 text-lg font-medium"
        />

        {/* Merchant / Notes (AI trigger) */}
        <input
          type="text"
          name="notes"
          placeholder="Merchant / Description"
          required
          className="w-full border rounded-lg p-3"
          onBlur={(e) => autoCategorize(e.target.value)}
        />

        {/* Category (auto-filled) */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option>Food</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Rent</option>
          <option>Travel</option>
          <option>Medical</option>
          <option>Subscriptions</option>
          <option>Education</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>

        {/* Save */}
        <button
          disabled={loading}
          className="w-full bg-black text-white rounded-lg p-3"
        >
          {loading ? "Saving..." : "Save Expense"}
        </button>
      </form>
    </main>
  )
}