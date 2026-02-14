"use client"

/**
 * =========================================================
 * CA SHARED DOCUMENTS WORKSPACE
 * Phase C — Day 18
 * Route: /ca/workspace
 *
 * PURPOSE
 * Central document hub for Chartered Accountants:
 *
 * ✓ upload client files (GST, AIS, bank statements, invoices)
 * ✓ view all uploaded docs
 * ✓ filter by client
 * ✓ download
 * ✓ delete
 *
 * STORAGE
 * Supabase Storage bucket: "ca-docs"
 * Path format:
 *   {orgId}/{filename}
 *
 * SAFE
 * - uses existing orgs
 * - no schema changes
 * - storage only
 * =========================================================
 */

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

/* ====================================================== */

type Org = {
  id: string
  name: string
}

type Doc = {
  name: string
  path: string
  orgId: string
  created_at?: string
}

/* ====================================================== */

export default function CAWorkspacePage() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [selected, setSelected] = useState<string>("all")

  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  /* ======================================================
     LOAD ORGS
  ====================================================== */

  useEffect(() => {
    loadOrgs()
  }, [])

  async function loadOrgs() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from("organization_members")
      .select("organizations(id,name)")
      .eq("user_id", user.id)

    const list =
      data?.map((d: any) => d.organizations).filter(Boolean) || []

    setOrgs(list)

    await loadDocs(list.map((o) => o.id))
  }

  /* ======================================================
     LOAD DOCS
  ====================================================== */

  async function loadDocs(ids: string[]) {
    setLoading(true)

    const results: Doc[] = []

    for (const orgId of ids) {
      const { data } = await supabase.storage
        .from("ca-docs")
        .list(orgId, {
          limit: 100,
        })

      data?.forEach((f) =>
        results.push({
          name: f.name,
          path: `${orgId}/${f.name}`,
          orgId,
          created_at: f.created_at,
        })
      )
    }

    setDocs(results)
    setLoading(false)
  }

  /* ======================================================
     UPLOAD
  ====================================================== */

  async function upload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0]
    if (!file || selected === "all") return

    setUploading(true)

    await supabase.storage
      .from("ca-docs")
      .upload(`${selected}/${file.name}`, file, {
        upsert: true,
      })

    await loadDocs(
      selected === "all"
        ? orgs.map((o) => o.id)
        : [selected]
    )

    setUploading(false)
  }

  /* ======================================================
     DELETE
  ====================================================== */

  async function remove(path: string) {
    if (!confirm("Delete this document?")) return

    await supabase.storage.from("ca-docs").remove([path])

    setDocs((d) => d.filter((x) => x.path !== path))
  }

  /* ======================================================
     FILTER
  ====================================================== */

  const filtered = useMemo(() => {
    if (selected === "all") return docs
    return docs.filter((d) => d.orgId === selected)
  }, [docs, selected])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Shared Documents
        </h1>
        <p className="text-sm text-gray-500">
          Upload and manage client files
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-3">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All Clients</option>

          {orgs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>

        <label className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer text-sm">
          {uploading ? "Uploading..." : "Upload File"}
          <input
            type="file"
            onChange={upload}
            hidden
          />
        </label>
      </div>

      {/* LIST */}
      {loading && (
        <p className="text-sm text-gray-400">Loading…</p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((d) => (
          <DocCard
            key={d.path}
            doc={d}
            orgName={
              orgs.find((o) => o.id === d.orgId)?.name
            }
            onDelete={() => remove(d.path)}
          />
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-sm text-gray-400">
            No documents yet
          </p>
        )}
      </div>
    </div>
  )
}

/* ====================================================== */

function DocCard({
  doc,
  orgName,
  onDelete,
}: {
  doc: Doc
  orgName?: string
  onDelete: () => void
}) {
  return (
    <div className="border rounded-xl p-4 bg-white space-y-2 hover:shadow">
      <p className="font-medium text-sm">{doc.name}</p>

      <p className="text-xs text-gray-500">
        {orgName}
      </p>

      <div className="flex gap-3 text-xs">
        <a
          href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ca-docs/${doc.path}`}
          target="_blank"
          className="underline"
        >
          Download
        </a>

        <button
          onClick={onDelete}
          className="text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
