"use client"

// ==========================================================
// HisabDesk — Expense Import
// CSV + PDF
// + Global Categorizer
// + ML Learning
// + GST Auto Tagging  ✅ NEW
// ==========================================================

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createExpense } from "@/lib/api/expenses"

import {
  detectCategory,
  learnCategory,
} from "@/lib/categorizer"

/* ✅ NEW — GST ENGINE */
import { detectGST } from "@/lib/gstTagger"

// ==========================================================

type Row = {
  date: string
  description: string
  amount: number
  category: string
  gst: number /* ✅ NEW */
}

export default function ExpenseImportPage() {
  const router = useRouter()

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  /* ==========================================================
     CATEGORY OPTIONS
  ========================================================== */

  const CATEGORY_OPTIONS = [
    "Food",
    "Travel",
    "Fuel",
    "Shopping",
    "Rent",
    "Loan/EMI",
    "Utilities",
    "Medical",
    "Misc",
  ]

  /* ✅ NEW — GST OPTIONS */
  const GST_OPTIONS = [0, 5, 12, 18, 28]

  /* ==========================================================
     UPDATE CATEGORY
     (learn + re-calc GST)
  ========================================================== */

  const updateCategory = (index: number, value: string) => {
    const row = rows[index]

    learnCategory(row.description, value)

    const newGST = detectGST(value) /* ✅ NEW */

    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, category: value, gst: newGST }
          : r
      )
    )
  }

  /* ✅ NEW — update GST manually */
  const updateGST = (index: number, value: number) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, gst: value } : r
      )
    )
  }

  /* ==========================================================
     CSV PARSER
  ========================================================== */

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter(Boolean)

    const parsed: Row[] = []

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",")

      const date = cols[0]?.trim()
      const description = cols[1]?.trim()

      const debit = Number(cols[2]?.replace(/[^0-9.-]/g, ""))

      if (!debit || debit <= 0) continue

      const category = detectCategory(description, "expense")

      /* ✅ NEW — GST auto */
      const gst = detectGST(category)

      parsed.push({
        date,
        description,
        amount: debit,
        category,
        gst,
      })
    }

    setRows(parsed)
  }

  /* ==========================================================
     PDF PARSER
  ========================================================== */

  const parsePDFText = (text: string) => {
    const lines = text.split("\n")

    const parsed: Row[] = []

    for (const line of lines) {
      const match = line.match(
        /(\d{2}[\/\-]\d{2}[\/\-]\d{2,4}).*?([\d,]+\.\d{2})/
      )

      if (!match) continue

      const date = match[1]
      const amount = Number(match[2].replace(/,/g, ""))

      if (amount <= 0) continue

      const category = detectCategory(line, "expense")

      /* ✅ NEW — GST auto */
      const gst = detectGST(category)

      parsed.push({
        date,
        description: line.trim(),
        amount,
        category,
        gst,
      })
    }

    setRows(parsed)
  }

  /* ==========================================================
     FILE HANDLER
  ========================================================== */

  const handleFile = async (file: File) => {
    if (file.name.endsWith(".csv")) {
      const text = await file.text()
      parseCSV(text)
      return
    }

    if (file.name.endsWith(".pdf")) {
      const form = new FormData()
      form.append("file", file)

      const res = await fetch("/api/expense/pdf-to-csv", {
        method: "POST",
        body: form,
      })

      const { text } = await res.json()

      parsePDFText(text)
    }
  }

  /* ==========================================================
     IMPORT
     ✅ saves gst_percent
  ========================================================== */

  const handleImport = async () => {
    try {
      setLoading(true)

      for (const r of rows) {
        await createExpense({
          date: r.date,
          category: r.category,
          amount: r.amount,
          notes: r.description,
          gst_percent: r.gst, /* ✅ NEW */
        })
      }

      router.push("/expense/list")
    } finally {
      setLoading(false)
    }
  }

  /* ==========================================================
     UI
  ========================================================== */

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      <div>
        <h1 className="text-xl font-semibold">
          Import Expense Statement
        </h1>
        <p className="text-sm text-gray-500">
          Auto categorize • GST auto tag • Review • Import
        </p>
      </div>

      {/* Upload */}
      <div className="rounded-2xl border border-dashed p-8 text-center">
        <input
          type="file"
          accept=".csv,.pdf"
          onChange={(e) =>
            e.target.files && handleFile(e.target.files[0])
          }
        />
      </div>

      {/* Preview */}
      {rows.length > 0 && (
        <>
          <div className="rounded-2xl border overflow-hidden">

            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">GST %</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">{r.date}</td>
                    <td className="p-3">{r.description}</td>

                    <td className="p-3">
                      <select
                        value={r.category}
                        onChange={(e) =>
                          updateCategory(i, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 text-xs"
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </td>

                    {/* ✅ NEW GST column */}
                    <td className="p-3">
                      <select
                        value={r.gst}
                        onChange={(e) =>
                          updateGST(i, Number(e.target.value))
                        }
                        className="border rounded-lg px-2 py-1 text-xs"
                      >
                        {GST_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}%
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3 text-right text-red-600">
                      ₹ {r.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          <div className="flex justify-end">
            <button
              onClick={handleImport}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm"
            >
              {loading
                ? "Importing..."
                : `Import ${rows.length} Expenses`}
            </button>
          </div>
        </>
      )}
    </main>
  )
}
