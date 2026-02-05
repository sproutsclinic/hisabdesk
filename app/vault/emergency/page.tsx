"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import EmptyState from "@/components/ui/EmptyState"

import {
  Shield,
  FileText,
  HeartPulse,
  Phone,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react"

/* =================================================
   🚨 EMERGENCY MODE — PRO VERSION

   Improvements:
   ✅ USER SCOPED (important security fix)
   ✅ bigger tap targets
   ✅ calmer layout
   ✅ faster queries
   ✅ direct open/call
   ✅ sticky header
================================================= */

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

export default function EmergencyModePage() {
  const [docs, setDocs] = useState<Item[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)

    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return

    /* ✅ IMPORTANT — filter by user_id */
    const [docsRes, contactsRes] = await Promise.all([
      supabase
        .from("vault_items")
        .select("id,title,category,file_url")
        .eq("user_id", user.id)
        .in("category", ["insurance", "legal", "medical"])
        .order("created_at", { ascending: false }),

      supabase
        .from("contacts")
        .select("id,name,role,phone")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ])

    setDocs(docsRes.data || [])
    setContacts(contactsRes.data || [])
    setLoading(false)
  }

  /* ================= HELPERS ================= */

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

  /* ================= GROUPS ================= */

  const groups = {
    insurance: docs.filter((d) => d.category === "insurance"),
    legal: docs.filter((d) => d.category === "legal"),
    medical: docs.filter((d) => d.category === "medical"),
  }

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading emergency data…</div>

  if (docs.length === 0 && contacts.length === 0) {
    return (
      <EmptyState
        title="No emergency info yet"
        description="Add insurance, medical or legal documents first"
      />
    )
  }

  return (
    <div className="space-y-8 pb-24">

      {/* ===== Sticky Header ===== */}
      <div className="sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur py-2 z-10">
        <h1 className="text-lg font-semibold text-red-600 flex items-center gap-2">
          <AlertTriangle size={18} />
          Emergency Mode
        </h1>
        <p className="text-xs text-zinc-500">
          Quick access to critical family documents
        </p>
      </div>

      {/* ================= DOCUMENT GROUPS ================= */}

      {[
        {
          key: "insurance",
          title: "Insurance Policies",
          icon: Shield,
          items: groups.insurance,
        },
        {
          key: "legal",
          title: "Legal & Wills",
          icon: FileText,
          items: groups.legal,
        },
        {
          key: "medical",
          title: "Medical Records",
          icon: HeartPulse,
          items: groups.medical,
        },
      ].map((section) => {
        const Icon = section.icon
        if (section.items.length === 0) return null

        return (
          <div key={section.key} className="space-y-3">

            <div className="flex items-center gap-2 text-sm font-semibold">
              <Icon size={16} />
              {section.title}
            </div>

            <div className="grid gap-3">

              {section.items.map((item) => (
                <Card
                  key={item.id}
                  variant="interactive"
                  onClick={() => openFile(item.file_url)}
                  className="
                    flex items-center justify-between
                    p-4
                    active:scale-[0.99]
                  "
                >
                  <span className="text-sm truncate">
                    {item.title}
                  </span>

                  <ArrowUpRight size={16} />
                </Card>
              ))}

            </div>
          </div>
        )
      })}

      {/* ================= CONTACTS ================= */}

      {contacts.length > 0 && (
        <div className="space-y-3">

          <div className="flex items-center gap-2 text-sm font-semibold">
            <Phone size={16} />
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
                <p className="text-xs text-blue-600 mt-1">
                  Call {c.phone}
                </p>
              </Card>
            ))}

          </div>
        </div>
      )}

      {/* ===== Trust ===== */}
      <p className="text-center text-xs text-zinc-400">
        🔒 Private • Secure • Always available
      </p>
    </div>
  )
}
