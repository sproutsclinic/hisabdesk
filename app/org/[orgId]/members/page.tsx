"use client"

/**
 * =========================================================
 * Organization Members Management Page
 * HisabDesk – Phase C (Team / Roles)
 * =========================================================
 *
 * ROUTE
 *   /org/[orgId]/members
 *
 * PURPOSE
 * Manage team inside an organization:
 *
 *   ✓ view members
 *   ✓ add member by email
 *   ✓ change role
 *   ✓ remove member
 *
 * CONNECTS TO
 *   organization_members table
 *   role-permissions.ts
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

type Role =
  | "owner"
  | "admin"
  | "accountant"
  | "member"
  | "viewer"

type Member = {
  user_id: string
  role: Role
  email?: string
}

const ROLES: Role[] = [
  "owner",
  "admin",
  "accountant",
  "member",
  "viewer",
]

export default function OrgMembersPage() {
  const params = useParams()
  const orgId = params?.orgId as string

  const [members, setMembers] = useState<Member[]>([])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)

  /* ======================================================
     LOAD MEMBERS
  ====================================================== */

  async function load() {
    setLoading(true)

    const { data } = await supabase
      .from("organization_members")
      .select("user_id, role, profiles(email)")
      .eq("org_id", orgId)

    const list =
      data?.map((d: any) => ({
        user_id: d.user_id,
        role: d.role,
        email: d.profiles?.email,
      })) || []

    setMembers(list)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [orgId])

  /* ======================================================
     ADD MEMBER
  ====================================================== */

  async function addMember() {
    if (!email) return

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (!profile) {
      alert("User not found")
      return
    }

    await supabase.from("organization_members").insert({
      org_id: orgId,
      user_id: profile.id,
      role: "member",
    })

    setEmail("")
    load()
  }

  /* ======================================================
     UPDATE ROLE
  ====================================================== */

  async function updateRole(
    userId: string,
    role: Role
  ) {
    await supabase
      .from("organization_members")
      .update({ role })
      .eq("org_id", orgId)
      .eq("user_id", userId)

    load()
  }

  /* ======================================================
     REMOVE
  ====================================================== */

  async function remove(userId: string) {
    await supabase
      .from("organization_members")
      .delete()
      .eq("org_id", orgId)
      .eq("user_id", userId)

    load()
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold">Team</h2>
        <p className="text-sm text-gray-500">
          Manage organization members
        </p>
      </div>

      {/* ADD */}
      <div className="flex gap-2">
        <input
          placeholder="Member email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded-lg w-72"
        />
        <button
          onClick={addMember}
          className="bg-black text-white px-4 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* TABLE */}
      {loading && <p>Loading...</p>}

      <div className="border rounded-xl">
        {members.map((m) => (
          <div
            key={m.user_id}
            className="flex items-center justify-between border-b p-4"
          >
            <div>
              <p className="font-medium">{m.email}</p>
              <p className="text-xs text-gray-500">
                {m.user_id}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={m.role}
                onChange={(e) =>
                  updateRole(
                    m.user_id,
                    e.target.value as Role
                  )
                }
                className="border rounded px-2 py-1"
              >
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>

              <button
                onClick={() => remove(m.user_id)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
