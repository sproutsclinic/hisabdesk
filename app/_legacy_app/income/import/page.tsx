"use client"

// ==========================================================
// HisabDesk — Income Import
// CSV + PDF + Auto Categorization
// + Editable Categories
// + ML Learning (GLOBAL categorizer)
// ==========================================================

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createIncome } from "@/lib/api/income"

/* ✅ NEW — GLOBAL ML ENGINE (ADDITION ONLY) */
import {
  detectCategory,
  learnCategory,
} from "@/lib/categorizer"

// ==========================================================

type Row = {
  date: string
  description: string
  amount: number
  category: string
}

export default function IncomeImportPage() {
  const router = useRouter()

  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)

  /* ==========================================================
     CATEGORY OPTIONS (EXISTING STYLE KEPT)
  ========================================================== */

  const CATEGORY_OPTIONS = [
    "Salary",
    "Freelance",
    "Business",
    "Interest",
    "Refund",
    "Investment",
    "Other",
  ]

  /* ==========================================================
     UPDATE CATEGORY
     ✅ NEW — learns globally
  ========================================================== */

  const updateCategory = (index: number, value: string) => {
    const row = rows[index]

    /* ✅ NEW — ML learn (ADDED ONLY) */
    learnCategory(row.description, value)

    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, category: value } : r
      )
    )
  }

  /* ==========================================================
     CSV PARSER
     (structure unchanged)
     only category detection swapped to global
  ========================================================== */

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter(Boolean)

    const parsed: Row[] = []

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",")

      const date = cols[0]?.trim()
      const description = cols[1]?.trim()

      const credit = Number(cols[2]?.replace(/[^0-9.-]/g, ""))

      if (!credit || credit <= 0) continue

      /* ✅ NEW — global detection */
      const category = detectCategory(description, "income")

      parsed.push({
        date,
        description,
        amount: credit,
        category,
      })
    }

    setRows(parsed)
  }

  /* ==========================================================
     PDF PARSER
     (unchanged, only detection swapped)
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

      /* ✅ NEW — global detection */
      const category = detectCategory(line, "income")

      parsed.push({
        date,
        description: line.trim(),
        amount,
        category,
      })
    }

    setRows(parsed)
  }

  /* ==========================================================
     FILE HANDLER (unchanged)
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
     IMPORT (unchanged)
  ========================================================== */

  const handleImport = async () => {
    try {
      setLoading(true)

      for (const r of rows) {
        await createIncome({
          date: r.date,
          category: r.category,
          amount: r.amount,
          notes: r.description,
        })
      }

      router.push("/income/list")
    } finally {
      setLoading(false)
    }
  }

  /* ==========================================================
     UI (unchanged except dropdown handler)
  ========================================================== */

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">

      <div>
        <h1 className="text-xl font-semibold">
          Import Income Statement
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload CSV / PDF • Review • Edit categories • Import
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

                    <td className="p-3 text-right text-green-600">
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
              className="px-5 py-2 rounded-xl bg-green-600 text-white text-sm"
            >
              {loading
                ? "Importing..."
                : `Import ${rows.length} Income`}
            </button>
          </div>
        </>
      )}
    </main>
  )
}
