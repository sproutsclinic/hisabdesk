"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import EmptyState from "@/components/ui/emptyState"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

import { Users, Trash2 } from "lucide-react"

/* =================================================
   FAMILY MEMBERS — Tagging System

   Purpose:
   ✅ assign docs to husband/children/parents
   ✅ improves clarity during emergencies
   ✅ emotional lock-in feature
   ✅ women-first UX

   Table:
   family_members (already exists)

   Fields:
   id
   user_id
   name
   relation
   dob
   notes

================================================= */

type Member = {
  id: string
  name: string
  relation: string
  dob: string | null
  notes: string | null
}

export default function FamilyMembersPage() {
  const toast = useToast()

  const [items, setItems] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState("")
  const [relation, setRelation] = useState("")
  const [saving, setSaving] = useState(false)

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)

    const { data } = await supabase
      .from("family_members")
      .select("*")
      .order("created_at", { ascending: false })

    setItems(data || [])
    setLoading(false)
  }

  /* ================= ADD ================= */

  const add = async () => {
    if (!name || !relation) return

    setSaving(true)

    const { data: userRes } = await supabase.auth.getUser()
    const userId = userRes.user?.id
    if (!userId) return

    await supabase.from("family_members").insert({
      user_id: userId,
      name,
      relation,
    })

    setName("")
    setRelation("")
    toast.success("Member added")

    await load()
    setSaving(false)
  }

  /* ================= DELETE ================= */

  const remove = async (id: string) => {
    if (!confirm("Delete member?")) return

    await supabase.from("family_members").delete().eq("id", id)

    setItems((prev) => prev.filter((x) => x.id !== id))
    toast.success("Removed")
  }

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  if (items.length === 0) {
    return (
      <div className="space-y-6">

        <EmptyState
          title="No family members yet"
          description="Add your husband, children or parents for better organisation"
        />

        {/* Add form */}
        <Card className="space-y-3">
          <input
            className="input"
            placeholder="Name (e.g. Aarav)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Relation (e.g. Son / Husband / Mother)"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
          />

          <Button loading={saving} onClick={add}>
            Add Member
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-2">
        <Users size={18} />
        <h1 className="text-base font-semibold">
          Family Members
        </h1>
      </div>

      {/* Add */}
      <Card className="space-y-3">
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Relation"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
        />

        <Button loading={saving} onClick={add}>
          Add
        </Button>
      </Card>

      {/* List */}
      <div className="grid gap-3">

        {items.map((m) => (
          <Card
            key={m.id}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-zinc-500">{m.relation}</p>
            </div>

            <button
              onClick={() => remove(m.id)}
              className="text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
