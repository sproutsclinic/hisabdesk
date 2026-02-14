/**
 * =========================================================
 * CA Dashboard (SERVER • ENTERPRISE SAFE • NO CLIENT FETCH)
 * =========================================================
 *
 * PURPOSE
 * Firm control center
 * Instant render
 * Multi-tenant ready
 *
 * RULE
 * Server fetch only
 * =========================================================
 */

import Link from "next/link"
import { getSupabaseServer } from "@/lib/supabase"

type Org = {
  id: string
  name: string
}

export const dynamic = "force-dynamic"

export default async function CADashboardPage() {
  const supabase = getSupabaseServer()

  /* ======================================================
     SERVER: get logged-in user
  ====================================================== */

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="p-8">
        <p>Please login</p>
      </main>
    )
  }

  /* ======================================================
     SERVER: fetch all org memberships (single query)
  ====================================================== */

  const { data } = await supabase
    .from("organization_members")
    .select("organizations(id, name)")
    .eq("user_id", user.id)

  const orgs: Org[] =
    data?.map((d: any) => d.organizations).filter(Boolean) || []

  /* ======================================================
     UI
  ====================================================== */

  return (
    <main className="min-h-screen bg-gray-50 p-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          CA Workstation
        </h1>
        <p className="text-sm text-gray-500">
          Manage all your client organizations
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Total Clients" value={orgs.length} />
        <Stat label="Active Workspaces" value={orgs.length} />
        <Stat label="System Status" value="Healthy" />
      </div>

      {/* CLIENT LIST */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <h2 className="font-medium mb-4">
          Client Organizations
        </h2>

        {orgs.length === 0 && (
          <p className="text-sm text-gray-500">
            No clients added yet
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {orgs.map((org) => (
            <Link
              key={org.id}
              href={`/org/${org.id}`}
              className="border rounded-xl p-4 hover:shadow transition"
            >
              <p className="font-medium">{org.name}</p>
              <p className="text-xs text-gray-500">
                Open workspace →
              </p>
            </Link>
          ))}
        </div>
      </div>

    </main>
  )
}

/* ====================================================== */

function Stat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="bg-white border rounded-xl p-5 text-center shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
