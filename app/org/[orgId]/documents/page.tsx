"use client"

/**
 * =========================================================
 * Organization Documents Center
 * HisabDesk – Phase C (Multi-Tenant Workspace)
 * =========================================================
 *
 * ROUTE
 *   /org/[orgId]/documents
 *
 * PURPOSE
 * Central document vault for each organization:
 *
 *   ✓ upload invoices/bills
 *   ✓ store tax documents
 *   ✓ Supabase storage backed
 *   ✓ OCR auto-parse (invoice-ocr-parser)
 *   ✓ download / delete
 *
 * CONNECTS TO
 *   lib/ai/invoice-ocr-parser.ts
 *   Supabase storage bucket: "documents"
 *
 * REQUIRED TABLE
 *
 * create table org_documents (
 *   id uuid primary key default gen_random_uuid(),
 *   org_id uuid,
 *   name text,
 *   url text,
 *   size numeric,
 *   meta jsonb,
 *   created_at timestamp default now()
 * );
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { parseInvoiceText } from "@/lib/ai/invoice-ocr-parser"

type Doc = {
  id: string
  name: string
  url: string
  size: number
  meta?: any
}

export default function OrgDocumentsPage() {
  const params = useParams()
  const orgId = params?.orgId as string

  const [docs, setDocs] = useState<Doc[]>([])
  const [uploading, setUploading] = useState(false)

  /* ======================================================
     LOAD
  ====================================================== */

  async function load() {
    const { data } = await supabase
      .from("org_documents")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })

    setDocs(data || [])
  }

  useEffect(() => {
    load()
  }, [orgId])

  /* ======================================================
     UPLOAD
  ====================================================== */

  async function upload(file: File) {
    setUploading(true)

    const path = `${orgId}/${Date.now()}-${file.name}`

    /* upload storage */
    const { error } = await supabase.storage
      .from("documents")
      .upload(path, file)

    if (error) {
      alert(error.message)
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("documents")
      .getPublicUrl(path)

    /* OPTIONAL: OCR parse text files */
    let meta: any = {}

    try {
      if (file.type.includes("text")) {
        const text = await file.text()
        meta = parseInvoiceText(text)
      }
    } catch {}

    await supabase.from("org_documents").insert({
      org_id: orgId,
      name: file.name,
      url: publicUrl,
      size: file.size,
      meta,
    })

    setUploading(false)
    load()
  }

  /* ======================================================
     DELETE
  ====================================================== */

  async function remove(doc: Doc) {
    await supabase
      .from("org_documents")
      .delete()
      .eq("id", doc.id)

    load()
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">
          Documents
        </h2>
        <p className="text-sm text-gray-500">
          Upload invoices & tax files
        </p>
      </div>

      {/* UPLOAD */}
      <label className="border rounded-xl p-6 block cursor-pointer text-center hover:bg-gray-50">
        {uploading ? "Uploading..." : "Upload File"}
        <input
          type="file"
          className="hidden"
          onChange={(e) =>
            e.target.files &&
            upload(e.target.files[0])
          }
        />
      </label>

      {/* LIST */}
      <div className="border rounded-xl divide-y">
        {docs.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between p-4"
          >
            <div>
              <p className="font-medium">{d.name}</p>
              <p className="text-xs text-gray-500">
                {(d.size / 1024).toFixed(1)} KB
              </p>

              {d.meta?.confidence && (
                <p className="text-xs text-green-600">
                  Parsed ✓ ({Math.round(
                    d.meta.confidence * 100
                  )}%)
                </p>
              )}
            </div>

            <div className="flex gap-3 text-sm">
              <a
                href={d.url}
                target="_blank"
                className="underline"
              >
                View
              </a>

              <button
                onClick={() => remove(d)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {docs.length === 0 && (
          <p className="p-4 text-sm text-gray-500">
            No documents yet
          </p>
        )}
      </div>
    </div>
  )
}
