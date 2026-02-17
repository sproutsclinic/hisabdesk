ï»¿// ==========================================================
// HisabDesk Ã¢â‚¬â€ Vault (Document Locker)
// SERVER COMPONENT (safe)
// Uses unified Supabase client (FINAL ARCHITECTURE)
// ==========================================================

import { Card } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// ==========================================================
// TYPES
// ==========================================================

interface DocumentRow {
  id: string
  name: string
  category: string
  size: number
  created_at: string
  path: string
}

// ==========================================================
// SERVER LOAD
// ==========================================================

async function loadDocuments(): Promise<DocumentRow[]> {
  const supabase = getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return data ?? []
}

// ==========================================================
// PAGE
// ==========================================================

export default async function VaultPage() {
  const docs = await loadDocuments()

  return (
    <main className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Vault</h1>
        <p className="text-sm text-gray-500">
          Securely store receipts, proofs, and financial documents
        </p>
      </div>

      {/* UPLOAD */}
      <form action="/api/vault/upload" method="POST" encType="multipart/form-data">
        <Card className="p-5 space-y-4">
          <p className="text-sm font-medium">Upload document</p>

          <input type="file" name="file" required className="text-sm" />

          <select name="category" className="border rounded p-2 text-sm">
            <option value="tax">Tax</option>
            <option value="salary">Salary</option>
            <option value="investment">Investment</option>
            <option value="loan">Loan</option>
            <option value="insurance">Insurance</option>
            <option value="other">Other</option>
          </select>

          <button
            type="submit"
            className="bg-primary text-white rounded px-4 py-2 text-sm"
          >
            Upload
          </button>
        </Card>
      </form>

      {/* DOCUMENT LIST */}
      <Card className="p-5 space-y-4">
        <p className="text-sm font-medium">Stored Documents</p>

        {docs.length === 0 ? (
          <p className="text-sm text-gray-500">No documents uploaded yet</p>
        ) : (
          <div className="space-y-2">
            {docs.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between border rounded p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs text-gray-500">
                    {d.category} Ã¢â‚¬Â¢ {(d.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <a
                  href={`/api/vault/download?id=${d.id}`}
                  className="text-primary text-xs"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </Card>
    </main>
  )
}
