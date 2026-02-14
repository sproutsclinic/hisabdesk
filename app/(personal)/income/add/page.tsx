"use client"

/* =========================================================
   HisabDesk — Add Income (PERSONAL • PRO • AI ENABLED)
   ---------------------------------------------------------
   ✓ Manual entry
   ✓ OCR camera
   ✓ PDF import
   ✓ Professional categories
   ✓ AI insights panel
   ✓ API only (no DB calls)
   ✗ no business logic
========================================================= */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

/* ========================================================= */

export default function Page() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [aiText, setAiText] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  /* ========================================================
     CATEGORY MAP (UNCHANGED – YOUR SYSTEM)
  ======================================================== */

  const CATEGORY_MAP: Record<string, string[]> = {
    Salary: ["Monthly Salary", "Bonus", "Incentive"],

    Professional: [
      "Consultation Fee",
      "Professional Fee",
      "Client Payment",
      "Service Charges",
    ],

    Freelance: ["Project", "Part-time", "Contract Work"],
    Business: ["Sales Revenue", "Customer Payment"],

    Investment: ["Interest", "Dividend", "Capital Gain"],
    Trading: ["Stocks", "Crypto", "F&O", "Intraday"],
    Rental: ["Property Rent", "Room Rent"],

    Lending: ["Interest from Friends", "Loan Return"],
    Gifts: ["Family Gift", "Cash Gift", "Transfer Received"],
    Refunds: ["Cashback", "Refund", "Reversal"],

    Other: ["Misc"],
  }

  const PAYMENT_OPTIONS = [
    "Bank Transfer",
    "UPI",
    "Cash",
    "Cheque",
    "Wallet",
  ]

  /* ======================================================== */

  const [category, setCategory] = useState("Salary")
  const [subcategory, setSubcategory] = useState("Monthly Salary")
  const [payment, setPayment] = useState("Bank Transfer")

  function handleCategoryChange(value: string) {
    setCategory(value)
    setSubcategory(CATEGORY_MAP[value][0])
  }

  /* ========================================================
     AI LOAD (NEW)
  ======================================================== */

  useEffect(() => {
    async function loadAI() {
      try {
        setAiLoading(true)

        const res = await fetch("/api/ai/income-summary", {
          method: "POST",
        })

        const json = await res.json()

        setAiText(json?.insights ?? null)
      } catch {
        setAiText(null)
      } finally {
        setAiLoading(false)
      }
    }

    loadAI()
  }, [])

  /* ========================================================
     SAVE (API ONLY – CLEAN ARCHITECTURE)
  ======================================================== */

  async function createIncome(data: any) {
    await fetch("/api/income", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)

    const date = String(formData.get("date"))
    const amount = Number(formData.get("amount"))
    const description = String(formData.get("description"))

    await createIncome({
      date,
      amount,
      category: `${category} / ${subcategory}`,
      notes: `${description} • ${payment}`,
    })

    router.push("/personal/income")
  }

  /* ========================================================
     OCR
  ======================================================== */

  async function handlePhoto(file: File) {
    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/income/ocr", {
      method: "POST",
      body: form,
    })

    const { text } = await res.json()

    const amountMatch = text.match(/[\d,]+\.\d{2}/)
    const amount = amountMatch
      ? Number(amountMatch[0].replace(/,/g, ""))
      : 0

    await createIncome({
      date: new Date().toISOString().slice(0, 10),
      amount,
      category: "Auto Detected",
      notes: text.slice(0, 120),
    })

    router.push("/personal/income")
  }

  /* ========================================================
     PDF
  ======================================================== */

  async function handlePDF(file: File) {
    const form = new FormData()
    form.append("file", file)

    await fetch("/api/income/pdf-to-text", {
      method: "POST",
      body: form,
    })

    router.push("/personal/income")
  }

  /* ========================================================
     UI
  ======================================================== */

  return (
    <main className="max-w-md mx-auto px-4 py-6 space-y-5">

      <h1 className="text-xl font-semibold">Add Income</h1>

      {/* ================= AI CARD (NEW) ================= */}

      <div className="p-4 bg-blue-50 border rounded-xl text-sm">
        {aiLoading && "Analyzing income trends..."}
        {!aiLoading && aiText && (
          <pre className="whitespace-pre-wrap">{aiText}</pre>
        )}
      </div>

      {/* ================= FORM ================= */}

      <form action={handleSubmit} className="space-y-3">

        <input
          type="date"
          name="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="number"
          name="amount"
          placeholder="₹ Amount"
          required
          className="w-full border rounded-lg p-3 text-lg font-medium text-green-600"
        />

        <input
          type="text"
          name="description"
          placeholder="Source / Client / Person"
          required
          className="w-full border rounded-lg p-3"
        />

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {Object.keys(CATEGORY_MAP).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {CATEGORY_MAP[category].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          {PAYMENT_OPTIONS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded-lg p-3"
        >
          {loading ? "Saving..." : "Save Income"}
        </button>
      </form>

      {/* ================= OCR / PDF ================= */}

      <div className="grid grid-cols-2 gap-3">

        <label className="p-4 border rounded-xl text-center cursor-pointer">
          📸 Scan Slip
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              e.target.files && handlePhoto(e.target.files[0])
            }
          />
        </label>

        <label className="p-4 border rounded-xl text-center cursor-pointer">
          📄 Upload PDF
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) =>
              e.target.files && handlePDF(e.target.files[0])
            }
          />
        </label>

      </div>
    </main>
  )
}
