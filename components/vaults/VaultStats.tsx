"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { Card } from "@/components/ui/card"

import {
  ShieldCheck,
  FileText,
  BellRing,
  Landmark,
} from "lucide-react"

/* =================================================
   VAULT STATS — Fast + Lightweight
   Top summary bar for Grahalakshmi Vault
   FIX:
   ✅ uses getSupabaseClient()
   ✅ no invalid supabase import
================================================= */

export default function VaultStats() {
  const supabase = getSupabaseClient()

  const [docs, setDocs] = useState(0)
  const [insurance, setInsurance] = useState(0)
  const [reminders, setReminders] = useState(0)
  const [assets, setAssets] = useState(0)

  useEffect(() => {
    if (!supabase) return
    load()
  }, [])

  const load = async () => {
    try {
      const { data: userRes } = await supabase.auth.getUser()
      const user = userRes.user
      if (!user) return

      const today = new Date()
      const next7 = new Date()
      next7.setDate(today.getDate() + 7)

      const [
        docsRes,
        insuranceRes,
        remindersRes,
        assetsRes,
      ] = await Promise.all([
        supabase
          .from("vault_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),

        supabase
          .from("vault_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("category", "insurance"),

        supabase
          .from("reminders")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("reminder_date", today.toISOString())
          .lte("reminder_date", next7.toISOString())
          .eq("status", "pending"),

        supabase
          .from("vault_items")
          .select("category, metadata")
          .eq("user_id", user.id),
      ])

      setDocs(docsRes.count || 0)
      setInsurance(insuranceRes.count || 0)
      setReminders(remindersRes.count || 0)

      let totalAssets = 0

      ;(assetsRes.data || []).forEach((i: any) => {
        const m = i.metadata || {}

        if (["property", "tax", "insurance"].includes(i.category)) {
          totalAssets += Number(m.current_value || m.amount || 0)
        }
      })

      setAssets(totalAssets)
    } catch (err) {
      console.error("VaultStats error:", err)
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

      <Card className="text-center space-y-1">
        <FileText size={14} className="mx-auto text-zinc-500" />
        <p className="text-sm font-semibold">{docs}</p>
        <p className="text-xs text-zinc-500">Documents</p>
      </Card>

      <Card className="text-center space-y-1">
        <ShieldCheck size={14} className="mx-auto text-green-600" />
        <p className="text-sm font-semibold">{insurance}</p>
        <p className="text-xs text-zinc-500">Policies</p>
      </Card>

      <Card className="text-center space-y-1">
        <BellRing size={14} className="mx-auto text-amber-600" />
        <p className="text-sm font-semibold">{reminders}</p>
        <p className="text-xs text-zinc-500">Due Soon</p>
      </Card>

      <Card className="text-center space-y-1">
        <Landmark size={14} className="mx-auto text-indigo-600" />
        <p className="text-sm font-semibold">
          ₹ {assets.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-zinc-500">Assets</p>
      </Card>

    </div>
  )
}
