"use client"

/**
 * =========================================================
 * CA Clients Manager — Enterprise Version
 * Phase C — Day 16 (FINAL)
 * Route: /ca/clients
 *
 * Features:
 * ✓ list all organizations
 * ✓ create client
 * ✓ delete client (safe)
 * ✓ search
 * ✓ GST/AI health indicators
 * ✓ risk score per client
 * ✓ production UX polish
 *
 * SAFE:
 * - single page only
 * - no schema changes
 * =========================================================
 */

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

/* ====================================================== */

type Org = {
  id: string
  name: string
}

type Health = {
  issues: number
  risk: number
}

/* ====================================================== */

export default function CAClientsPage() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [health, setHealth] = useState<Record<string, Health>>({})

  const [name, setName] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  /* ======================================================
     LOAD
  ====================================================== */

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    /* --------------------------------------------
       ORGS
    -------------------------------------------- */

    const { data } = await supabase
      .from("organization_members")
      .select("organizations(id,name)")
      .eq("user_id", user.id)

    const list =
      data?.map((d: any) => d.organizations).filter(Boolean) || []

    setOrgs(list)

    const ids = list.map((o) => o.id)

    if (!ids.length) {
      setLoading(false)
      return
    }

    /* --------------------------------------------
       GST health
    -------------------------------------------- */

    const { data: gst } = await supabase
      .from("gst_summary")
      .select("*")
      .in("org_id", ids)

    /* --------------------------------------------
       AI health
    -------------------------------------------- */

    const { data: tx } = await supabase
      .from("transactions")
      .select("org_id, meta")
      .in("org_id", ids)

    const map: Record<string, Health> = {}

    ids.forEach((id) => {
      map[id] = { issues: 0, risk: 0 }
    })

    gst?.forEach((g: any) => {
      map[g.org_id].issues +=
        (g.mismatch || 0) +
        (g.missing || 0) +
        (g.partial || 0)
    })

    tx?.forEach((t: any) => {
      if (
        t.meta?.reconciliation_status === "missing" ||
        t.meta?.anomaly ||
        t.meta?.duplicate_status
      ) {
        map[t.org_id].issues++
      }
    })

    Object.values(map).forEach((h) => {
      h.risk = Math.min(100, h.issues * 3)
    })

    setHealth(map)
    setLoading(false)
  }

  /* ======================================================
     CREATE CLIENT
  ====================================================== */

  async function createClient() {
    if (!name.trim()) return

    setCreating(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: org } = await supabase
      .from("organizations")
      .insert({
        name,
        owner_id: user.id,
      })
      .select()
      .single()

    await supabase.from("organization_members").insert({
      org_id: org.id,
      user_id: user.id,
      role: "owner",
    })

    setName("")
    setCreating(false)
    load()
  }

  /* ======================================================
     DELETE (SAFE)
  ====================================================== */

  async function remove(id: string) {
    if (!confirm("Delete this client permanently?")) return

    // remove members first
    await supabase.from("organization_members").delete().eq("org_id", id)

    await supabase.from("organizations").delete().eq("id", id)

    load()
  }

  /* ======================================================
     FILTER
  ====================================================== */

  const filtered = useMemo(() => {
    return orgs.filter((o) =>
      o.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [orgs, search])

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Clients</h1>
        <p className="text-sm text-gray-500">
          Manage all your client organizations
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="New client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg px-3 py-2 w-64"
        />

        <button
          disabled={creating}
          onClick={createClient}
          className="bg-black text-white px-4 rounded-lg"
        >
          {creating ? "Creating..." : "Create"}
        </button>

        <input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-72 ml-auto"
        />
      </div>

      {/* LIST */}
      {loading && <p className="text-sm text-gray-400">Loading…</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((org) => (
          <ClientCard
            key={org.id}
            org={org}
            health={health[org.id]}
            onDelete={() => remove(org.id)}
          />
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-sm text-gray-400">No clients yet</p>
        )}
      </div>
    </div>
  )
}

/* ====================================================== */

function ClientCard({
  org,
  health,
  onDelete,
}: {
  org: Org
  health?: Health
  onDelete: () => void
}) {
  const risk = health?.risk || 0

  const color =
    risk > 60
      ? "text-red-600"
      : risk > 30
      ? "text-yellow-600"
      : "text-green-600"

  return (
    <div className="border rounded-xl p-4 space-y-3 hover:shadow bg-white">
      <p className="font-medium">{org.name}</p>

      <div className="flex justify-between text-sm">
        <span>Issues: {health?.issues || 0}</span>
        <span className={`font-semibold ${color}`}>
          Risk {risk}%
        </span>
      </div>

      <div className="flex gap-3 text-sm">
        <a href={`/org/${org.id}`} className="underline">
          Open
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
