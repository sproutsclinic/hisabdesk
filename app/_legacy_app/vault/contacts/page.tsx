"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/ui/emptyState"
import { useToast } from "@/components/ui/toast"

import {
  Phone,
  Plus,
  Trash2,
  User
} from "lucide-react"

/* =================================================
   VAULT CONTACTS — Emergency Contacts Manager

   Purpose:
   ✅ store CA / Lawyer / Family / Insurance agent
   ✅ 1-tap call
   ✅ super fast mobile UI
   ✅ emergency mode compatible
   ✅ high retention feature

   Table: contacts
   - id
   - user_id
   - name
   - role
   - phone
   - email
   - notes
================================================= */

type Contact = {
  id: string
  name: string
  role: string
  phone: string
  email: string | null
  notes: string | null
}

export default function ContactsPage() {
  const toast = useToast()

  const [items, setItems] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  const [adding, setAdding] = useState(false)

  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    notes: "",
  })

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)

    const { data } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })

    setItems(data || [])
    setLoading(false)
  }

  /* ================= ADD ================= */

  const add = async () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone required")
      return
    }

    const { data: userRes } = await supabase.auth.getUser()
    const userId = userRes.user?.id
    if (!userId) return

    await supabase.from("contacts").insert({
      user_id: userId,
      ...form,
    })

    toast.success("Contact added")

    setForm({
      name: "",
      role: "",
      phone: "",
      email: "",
      notes: "",
    })

    setAdding(false)
    load()
  }

  /* ================= DELETE ================= */

  const remove = async (id: string) => {
    if (!confirm("Delete contact?")) return

    await supabase.from("contacts").delete().eq("id", id)

    setItems((prev) => prev.filter((x) => x.id !== id))
    toast.success("Deleted")
  }

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  if (items.length === 0 && !adding) {
    return (
      <EmptyState
        title="No contacts yet"
        description="Add family or advisors for emergencies"
        actionLabel="Add Contact"
        actionHref="#"
      />
    )
  }

  return (
    <div className="space-y-6 max-w-xl">

      {/* ===== Header ===== */}
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold flex items-center gap-2">
          <Phone size={16} />
          Emergency Contacts
        </h1>

        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus size={14} />
          Add
        </Button>
      </div>

      {/* ===== Add Form ===== */}
      {adding && (
        <Card className="space-y-3">

          <input
            placeholder="Name"
            className="input"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Role (CA / Lawyer / Family)"
            className="input"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          />

          <input
            placeholder="Phone"
            className="input"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <input
            placeholder="Email (optional)"
            className="input"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <textarea
            placeholder="Notes (optional)"
            className="input"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

          <div className="flex gap-2">
            <Button size="sm" onClick={add}>
              Save
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => setAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* ===== List ===== */}
      <div className="grid gap-3">

        {items.map((c) => (
          <Card
            key={c.id}
            className="flex justify-between items-center"
          >
            <div className="min-w-0">

              <div className="flex items-center gap-2 text-sm font-medium">
                <User size={14} />
                {c.name}
              </div>

              {c.role && (
                <p className="text-xs text-zinc-500">{c.role}</p>
              )}

              <a
                href={`tel:${c.phone}`}
                className="text-xs text-blue-600"
              >
                {c.phone}
              </a>
            </div>

            <button
              onClick={() => remove(c.id)}
              className="text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </Card>
        ))}
      </div>

      <p className="text-xs text-center text-zinc-400">
        Visible in Emergency Mode 🚨
      </p>
    </div>
  )
}
