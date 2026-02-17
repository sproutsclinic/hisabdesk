ï»¿"use client"

// ==========================================================
// HisabDesk ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Add Expense Form (FINAL POLISHED)
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Category dropdown
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Subcategory ALWAYS renders
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â File upload ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ Supabase Storage
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Date added
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Amount autofocus
// ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Client safe
// Phase 4 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Receipt automation integrated
// ==========================================================

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createExpense } from "@/lib/api/expenses"
import { uploadReceipt } from "@/lib/storage/upload" // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ NEW

/* ========================================================== */

const CATEGORY_MAP: Record<string, string[]> = {
  Home: [
    "House Rent",
    "Electricity Bill",
    "Water Bill",
    "Gas",
    "Maintenance",
    "Internet/WiFi",
  ],

  Living: ["Groceries", "Food/Dining", "Clothing", "Shopping"],

  Travel: ["Fuel", "Taxi/Cab", "Bus/Train", "Flight", "Hotel Stay"],

  Health: [
    "Hospital Bill",
    "Doctor Consultation",
    "Medical Tests",
    "Medicines",
    "Insurance Premium",
  ],

  Finance: [
    "Loan Repayment",
    "EMI",
    "Credit Card Bill",
    "Tax Payment",
    "Bank Charges",
  ],

  Assets: [
    "Jewellery Purchase",
    "Electronics",
    "Furniture",
    "Property Expense",
  ],

  Business: [
    "Office Rent",
    "Salary Paid",
    "Marketing",
    "Software Subscription",
    "Professional Fees",
  ],

  Education: ["School Fees", "Books", "Courses"],

  Miscellaneous: ["Gifts", "Donations", "Entertainment", "Other"],
}

const USER_ID = "00000000-0000-0000-0000-000000000000"

export default function AddExpenseForm() {
  const router = useRouter()

  const amountRef = useRef<HTMLInputElement>(null)

  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [notes, setNotes] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subOptions = CATEGORY_MAP[category] ?? []

  /* ==========================================================
     SAVE
  ========================================================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    try {
      setError(null)

      const amt = Number(amount)

      if (!amt || amt <= 0) {
        setError("Enter valid amount")
        amountRef.current?.focus()
        return
      }

      if (!category) return setError("Select category")
      if (!subcategory) return setError("Select subcategory")

      setLoading(true)

      let attachmentUrl = ""

      // ======================================================
      // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ NEW ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Upload receipt to storage
      // ======================================================
      if (file) {
        const { url } = await uploadReceipt(
          USER_ID,
          file,
          file.name
        )
        attachmentUrl = `ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â½ ${url}`
      }

      const finalNotes =
        [notes.trim(), attachmentUrl]
          .filter(Boolean)
          .join(" ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ ") || null

      await createExpense({
        user_id: USER_ID,
        amount: amt,
        category: `${category} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ ${subcategory}`,
        notes: finalNotes,
        date: new Date(date).toISOString(),
      })

      router.push("/expense/list")
    } catch (err: any) {
      setError(err.message || "Failed to save expense")
    } finally {
      setLoading(false)
    }
  }

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold">Expense Details</h2>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {/* Amount */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Amount</label>
        <input
          ref={amountRef}
          type="number"
          inputMode="decimal"
          placeholder="ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ 0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm font-semibold"
        />
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setSubcategory("")
          }}
          className="w-full rounded-xl border px-4 py-3 text-sm bg-white"
        >
          <option value="">Select category</option>
          {Object.keys(CATEGORY_MAP).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Subcategory</label>
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          disabled={!category}
          className="w-full rounded-xl border px-4 py-3 text-sm bg-white disabled:bg-gray-100"
        >
          <option value="">
            {category ? "Select subcategory" : "Choose category first"}
          </option>

          {subOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
        />
      </div>

      {/* Attachment */}
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

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-xs text-gray-500">Notes</label>
        <input
          type="text"
          placeholder="Optional notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
        />
      </div>

      {/* Submit */}
      <button
        disabled={loading}
        className="
          w-full rounded-xl bg-blue-600 text-white py-3 text-sm font-medium
          hover:bg-blue-700 transition
          disabled:opacity-50
        "
      >
        {loading ? "Saving..." : "Save Expense"}
      </button>
    </form>
  )
}
