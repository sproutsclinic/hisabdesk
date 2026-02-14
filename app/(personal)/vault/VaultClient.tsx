"use client"

// ==========================================================
// HisabDesk — Vault Client UI
// ----------------------------------------------------------
// PURPOSE
//   Interactive client layer for Vault
//
//   Responsibilities:
//     ✓ upload (no full page reload)
//     ✓ delete
//     ✓ download
//     ✓ list refresh
//
//   Uses:
//     useVaultDocuments()
//     lib/api/vault helpers
//
//   RULES
//     ✓ client only
//     ✓ no DB/Supabase here
//     ✓ server routes only
//
// ==========================================================

import { useState } from "react"
import { Card } from "@/components/ui/card"

import { useVaultDocuments } from "@/lib/hooks/useVaultDocuments"
import { downloadDocument } from "@/lib/api/vault"

// ==========================================================
// COMPONENT
// ==========================================================

export default function VaultClient() {
  const {
    documents,
    loading,
    upload,
    remove,
  } = useVaultDocuments()

  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState("tax")
  const [busy, setBusy] = useState(false)

  // --------------------------------------------------------
  // UPLOAD
  // --------------------------------------------------------

  async function handleUpload() {
    if (!file) return

    try {
      setBusy(true)
      await upload(file, category)
      setFile(null)
    } finally {
      setBusy(false)
    }
  }

  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* UPLOAD */}
      {/* ================================================= */}

      <Card className="p-5 space-y-4">

        <p className="text-sm font-medium">
          Upload document
        </p>

        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="text-sm"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border rounded p-2 text-sm"
        >
          <option value="tax">Tax</option>
          <option value="salary">Salary</option>
          <option value="investment">Investment</option>
          <option value="loan">Loan</option>
          <option value="insurance">Insurance</option>
          <option value="other">Other</option>
        </select>

        <button
          onClick={handleUpload}
          disabled={!file || busy}
          className="bg-primary text-white rounded px-4 py-2 text-sm"
        >
          {busy ? "Uploading..." : "Upload"}
        </button>

      </Card>



      {/* ================================================= */}
      {/* LIST */}
      {/* ================================================= */}

      <Card className="p-5 space-y-4">

        <p className="text-sm font-medium">
          Stored Documents
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">
            Loading…
          </p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-gray-500">
            No documents yet
          </p>
        ) : (
          <div className="space-y-2">

            {documents.map((d) => (
              <div
                key={d.id}
                className="
                  flex items-center justify-between
                  border rounded p-3 text-sm
                "
              >
                <div>
                  <p className="font-medium">
                    {d.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {d.category} •{" "}
                    {(d.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      downloadDocument(d.id)
                    }
                    className="text-primary text-xs"
                  >
                    Download
                  </button>

                  <button
                    onClick={() =>
                      remove(d.id)
                    }
                    className="text-red-600 text-xs"
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </Card>

    </div>
  )
}
