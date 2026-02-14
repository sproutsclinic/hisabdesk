"use client"

// ==========================================================
// HisabDesk — Add Income Form (PRO VERSION)
// SAME STRUCTURE
// ✅ Notes
// ✅ File upload (now uploads to Supabase Storage)
// ✅ Category + Subcategory
// ✅ Date added
// ✅ Amount LAST
// Phase 4 — Receipt automation integrated
// ==========================================================

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createIncome } from "@/lib/api/income"
import { uploadReceipt } from "@/lib/storage/upload" // ✅ NEW

/* ========================================================== */

const DEMO_USER = "00000000-0000-0000-0000-000000000000"

/* ========================================================== */

const INCOME_MAP: Record<string, string[]> = {
  Salary: ["Monthly Salary", "Bonus", "Incentive", "Arrears"],

  Business: [
    "Sales Revenue",
    "Service Income",
    "Consulting Fees",
    "Clinic/Practice Income",
  ],

  Investments: [
    "Mutual Fund Returns",
    "Stock Profits",
    "Dividends",
    "FD Interest",
    "Crypto",
  ],

  Property: ["House Rent", "Commercial Rent", "Land Lease"],

  Freelance: ["Client Projects", "Online Gigs", "Commissions"],

  Other: ["Gift", "Refund", "Miscellaneous"],
}

// ==========================================================

export default function AddIncomeForm() {
  const router = useRouter()

  const amountRef = useRef<HTMLInputElement>(null)

  const [notes, setNotes] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [amount, setAmount] = useState("")

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subOptions = category ? INCOME_MAP[category] : []

  /* ==========================================================
     SAVE
  ========================================================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) return

    const amt = Number(amount)

    if (!amt || amt <= 0) {
      setError("Enter valid amount")
      amountRef.current?.focus()
      return
    }

    try {
      setLoading(true)
      setError(null)

      let attachmentUrl = ""

      // ======================================================
      // ✅ NEW — Upload receipt to storage
      // ======================================================
      if (file) {
        const { url } = await uploadReceipt(
          DEMO_USER,
          file,
          file.name
        )
        attachmentUrl = `📎 ${url}`
      }

      const finalNotes =
        [notes.trim(), attachmentUrl]
          .filter(Boolean)
          .join(" • ") || null

      await createIncome({
        user_id: DEMO_USER,
        amount: amt,
        category: category || "Other",
        subcategory: subcategory || "Misc",
        notes: finalNotes,
        date: new Date(date).toISOString(),
      })

      router.push("/income/list")
    } catch (err: any) {
      setError(err.message || "Failed to save income")
    } finally {
      setLoading(false)
    }
  }

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold">Income Details</h2>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {/* NOTES */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Notes</label>
        <textarea
          placeholder="Optional description"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
          rows={3}
        />
      </div>

      {/* FILE */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Attachment</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
        {file && (
          <p className="text-xs text-gray-500">
            Selected: {file.name}
          </p>
        )}
      </div>

      {/* CATEGORY */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Income Type</label>
        <select
          required
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setSubcategory("")
          }}
          className="w-full rounded-xl border px-4 py-3 text-sm"
        >
          <option value="">Select category</option>
          {Object.keys(INCOME_MAP).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* SUBCATEGORY */}
      {category && (
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Source</label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm"
          >
            <option value="">Select source</option>
            {subOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* DATE */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
        />
      </div>

      {/* AMOUNT */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Amount</label>
        <input
          ref={amountRef}
          type="number"
          inputMode="decimal"
          required
          placeholder="₹ 0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm font-semibold"
        />
      </div>

      {/* SUBMIT */}
      <button
        disabled={loading}
        className="
          w-full rounded-xl bg-green-600 text-white py-3 text-sm font-medium
          hover:bg-green-700 transition
          disabled:opacity-50
        "
      >
        {loading ? "Saving..." : "Save Income"}
      </button>
    </form>
  )
}
