"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { isProUser } from "@/lib/isPro"

import { Card } from "@/components/ui/card"
import VaultStats from "@/components/vault/VaultStats"

import {
  Shield,
  Home,
  Landmark,
  Banknote,
  FileText,
  HeartPulse,
  Phone,
  Search,
  Sparkles,
  ArrowUpRight,
  Download,
} from "lucide-react"

type VaultItem = {
  id: string
  title: string
  category: string
  metadata: any
  file_url: string | null
}

export default function VaultPage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "core" | "safety">("all")
  const [items, setItems] = useState<VaultItem[]>([])
  const [downloading, setDownloading] = useState(false)

  /* 🔒 PRO */
  const [isPro, setIsPro] = useState(false)

  /* ================= INIT ================= */

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) {
      router.push("/login")
      return
    }

    setIsPro(await isProUser(user.id))
    await loadItems()
  }

  /* ================= LOAD ================= */

  const loadItems = async () => {
    const { data } = await supabase
      .from("vault_items")
      .select("id,title,category,metadata,file_url")

    setItems(data || [])
  }

  /* ================= 🔒 BACKUP (PRO ONLY) ================= */

  const downloadBackup = async () => {
    if (!isPro) {
      router.push("/billing")
      return
    }

    try {
      setDownloading(true)

      const res = await fetch("/api/vault/export")
      const blob = await res.blob()

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "hisabdesk-family-vault-backup.zip"
      a.click()

      window.URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  /* ================= CATEGORY DATA ================= */

  const categories = [
    { key: "insurance", title: "Insurance", subtitle: "Policies, claims, nominees", icon: Shield, color: "text-green-600", group: "core" },
    { key: "property", title: "Property & Assets", subtitle: "House, land, gold, vehicle", icon: Home, color: "text-indigo-600", group: "core" },
    { key: "tax", title: "Tax & Investments", subtitle: "PPF, MF, Form 16, proofs", icon: Landmark, color: "text-blue-600", group: "core" },
    { key: "loans", title: "Loans & Liabilities", subtitle: "EMI, cards, debts", icon: Banknote, color: "text-rose-600", group: "core" },
    { key: "legal", title: "Legal & Wills", subtitle: "Will, nominees, POA", icon: FileText, color: "text-purple-600", group: "safety" },
    { key: "medical", title: "Medical Records", subtitle: "Reports, prescriptions", icon: HeartPulse, color: "text-pink-600", group: "safety" },
    { key: "emergency", title: "Emergency Contacts", subtitle: "CA, lawyer, family", icon: Phone, color: "text-amber-600", group: "safety" },
  ]

  /* ================= SEARCH ================= */

  const query = search.trim().toLowerCase()

  const matchedDocs = useMemo(() => {
    if (!query) return []

    return items.filter((i) => {
      const meta = JSON.stringify(i.metadata || {}).toLowerCase()

      return (
        i.title.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query) ||
        meta.includes(query)
      )
    })
  }, [query, items])

  const filteredCategories = useMemo(() => {
    let list = [...categories]
    if (filter !== "all") list = list.filter((c) => c.group === filter)
    return list
  }, [filter])

  /* ================= HELPERS ================= */

  const openFile = (path: string | null) => {
    if (!path) return

    const url = supabase.storage
      .from("vault-documents")
      .getPublicUrl(path).data.publicUrl

    window.open(url, "_blank")
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Grahalakshmi Vault 🔒</h1>
          <p className="text-sm text-zinc-500">
            Your family’s secure financial locker
          </p>
        </div>

        {/* 🔒 PRO BUTTON */}
        <button
          onClick={downloadBackup}
          disabled={downloading}
          className={`btn flex items-center gap-2 text-xs ${!isPro && "opacity-60"}`}
        >
          <Download size={14} />
          {isPro ? (downloading ? "Preparing..." : "Backup") : "Backup 🔒"}
        </button>
      </div>

      <VaultStats />

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search any document..."
          className="input pl-9"
        />
      </div>

      {/* Results */}
      {query ? (
        <div className="space-y-3">
          {matchedDocs.map((item) => (
            <Card
              key={item.id}
              variant="interactive"
              onClick={() => openFile(item.file_url)}
              className="flex justify-between items-center"
            >
              <span>{item.title}</span>
              <ArrowUpRight size={14} />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <Card
                key={cat.key}
                variant="interactive"
                className="p-5"
                onClick={() => router.push(`/vault/${cat.key}`)}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className={cat.color} />
                  <div>
                    <p className="text-sm font-semibold">{cat.title}</p>
                    <p className="text-xs text-zinc-500">{cat.subtitle}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <div className="text-xs text-zinc-400 text-center pt-4">
        <Sparkles size={12} className="inline mr-1" />
        Encrypted • Private • Only you can access
      </div>
    </div>
  )
}
