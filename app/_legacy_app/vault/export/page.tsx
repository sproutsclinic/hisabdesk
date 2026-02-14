"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { isProUser } from "@/lib/isPro"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

import { Download, ShieldCheck, FileArchive, Lock } from "lucide-react"

/* =================================================
   🔒 VAULT BACKUP — PRO ONLY

   Free  → redirect billing
   Pro   → download ZIP

   Phase 9 Lock:
   ✅ premium export
================================================= */

export default function VaultExportPage() {
  const router = useRouter()
  const toast = useToast()

  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(true)

  /* 🔒 NEW */
  const [isPro, setIsPro] = useState(false)

  /* ================= LOAD ================= */

  useEffect(() => {
    checkPro()
  }, [])

  const checkPro = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      router.push("/login")
      return
    }

    const pro = await isProUser(user.id)
    setIsPro(pro)

    /* 🔒 HARD LOCK */
    if (!pro) {
      router.push("/billing")
      return
    }

    setLoading(false)
  }

  /* ================= DOWNLOAD ================= */

  const downloadBackup = async () => {
    try {
      setDownloading(true)

      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token

      if (!token) {
        toast.error("Login required")
        return
      }

      const res = await fetch("/api/vault/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        toast.error("Export failed")
        return
      }

      const blob = await res.blob()

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")

      a.href = url
      a.download = "hisabdesk-vault-backup.zip"
      a.click()

      window.URL.revokeObjectURL(url)

      toast.success("Backup downloaded")
    } finally {
      setDownloading(false)
    }
  }

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="max-w-xl space-y-8">

      <div className="space-y-1">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <FileArchive size={18} />
          Vault Backup
        </h1>

        <p className="text-sm text-zinc-500">
          Download all your family documents as a secure ZIP file
        </p>
      </div>

      <Card className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <ShieldCheck size={14} />
          100% Private & Encrypted
        </div>

        <ul className="text-xs text-zinc-500 space-y-1 list-disc pl-4">
          <li>Only you can download</li>
          <li>No data shared with anyone</li>
          <li>Works offline after download</li>
        </ul>
      </Card>

      <Button
        className="w-full"
        loading={downloading}
        onClick={downloadBackup}
      >
        <Download size={16} />
        Download Full Backup (.zip)
      </Button>

      <p className="text-xs text-center text-zinc-400 flex items-center justify-center gap-1">
        <Lock size={12} />
        Pro feature • Private • Secure
      </p>
    </div>
  )
}
