"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import EmptyState from "@/components/ui/emptyState"

import {
  ShieldCheck,
  FileText,
  HeartPulse,
  Phone,
  Eye,
  ArrowUpRight,
} from "lucide-react"

type Item = {
  id: string
  title: string
  category: string
  file_url: string | null
}

type Contact = {
  id: string
  name: string
  role: string
  phone: string
}

export default function SharedVaultViewer() {
  const supabase = getSupabaseClient()

  const params = useParams()
  const token = String(params?.token || "")

  const [loading, setLoading] = useState(true)
  const [valid, setValid] = useState(true)

  const [docs, setDocs] = useState<Item[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    if (!token) return
    load()
  }, [token])

  const load = async () => {
    setLoading(true)

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("vault_share_token", token)
      .maybeSingle()

    if (!profile) {
      setValid(false)
      setLoading(false)
      return
    }

    const userId = profile.id

    const [itemsRes, contactsRes] = await Promise.all([
      supabase
        .from("vault_items")
        .select("id,title,category,file_url")
        .eq("user_id", userId)
        .in("category", ["insurance", "legal", "medical"])
        .order("created_at", { ascending: false }),

      supabase
        .from("contacts")
        .select("id,name,role,phone")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ])

    setDocs(itemsRes.data || [])
    setContacts(contactsRes.data || [])

    setLoading(false)
  }

  const openFile = (path: string | null) => {
    if (!path) return

    const url = supabase.storage
      .from("vault-documents")
      .getPublicUrl(path).data.publicUrl

    window.open(url, "_blank")
  }

  const call = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  if (loading) return <div className="p-6">Loading emergency data…</div>

  if (!valid) {
    return (
      <EmptyState
        title="Invalid or expired link"
        description="Ask the owner to regenerate the secure share link"
      />
    )
  }

  const groups = {
    insurance: docs.filter((d) => d.category === "insurance"),
    legal: docs.filter((d) => d.category === "legal"),
    medical: docs.filter((d) => d.category === "medical"),
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-24">

      <div className="sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur py-3 z-10">
        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
          <ShieldCheck size={14} />
          Emergency View (Read Only)
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          Quick access to critical family documents
        </p>
      </div>

      {[
        { key: "insurance", title: "Insurance Policies", icon: ShieldCheck },
        { key: "legal", title: "Legal & Wills", icon: FileText },
        { key: "medical", title: "Medical Records", icon: HeartPulse },
      ].map((section) => {
        const Icon = section.icon
        const list = (groups as any)[section.key]

        if (!list.length) return null

        return (
          <div key={section.key} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Icon size={14} />
              {section.title}
            </div>

            <div className="grid gap-3">
              {list.map((item: Item) => (
                <Card
                  key={item.id}
                  variant="interactive"
                  onClick={() => openFile(item.file_url)}
                  className="flex justify-between items-center p-4"
                >
                  <span className="text-sm truncate">{item.title}</span>
                  <ArrowUpRight size={14} />
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {contacts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Phone size={14} />
            Emergency Contacts
          </div>

          <div className="grid gap-3">
            {contacts.map((c) => (
              <Card
                key={c.id}
                variant="interactive"
                onClick={() => call(c.phone)}
                className="p-4"
              >
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-zinc-500">{c.role}</p>
                <p className="text-xs text-blue-600 mt-1">Call {c.phone}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
        <Eye size={12} />
        View only • Cannot edit or delete
      </div>
    </div>
  )
}
