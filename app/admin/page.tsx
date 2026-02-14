"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  Users,
  Crown,
  IndianRupee,
  ShieldCheck,
  RefreshCcw,
  BarChart3,
} from "lucide-react"

/* =================================================
   ADMIN PANEL — Enterprise Control Center

   ✅ users count
   ✅ pro users count
   ✅ revenue estimate
   ✅ quick refresh
   ✅ navigation shortcuts
   ✅ metrics shortcut (added)
   ✅ admin-only guard
   ✅ zero breaking changes
================================================= */

export default function AdminPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [users, setUsers] = useState(0)
  const [proUsers, setProUsers] = useState(0)

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!profile?.is_admin) {
      router.push("/dashboard")
      return
    }

    await loadStats()
    setLoading(false)
  }

  /* ================= LOAD STATS ================= */

  const loadStats = async () => {
    setRefreshing(true)

    const [{ count: total }, { count: pros }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_pro", true),
    ])

    setUsers(total || 0)
    setProUsers(pros || 0)

    setRefreshing(false)
  }

  /* ================= CALC ================= */

  const revenue = proUsers * 499

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-zinc-500">
        Loading admin dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck size={18} />
          Admin Panel
        </h1>

        <div className="flex flex-wrap gap-2">

          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/admin/users")}
          >
            <Users size={14} />
            Users
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/admin/revenue")}
          >
            <IndianRupee size={14} />
            Revenue
          </Button>

          {/* ✅ added metrics shortcut */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/admin/metrics")}
          >
            <BarChart3 size={14} />
            Metrics
          </Button>

          <Button size="sm" onClick={loadStats} disabled={refreshing}>
            <RefreshCcw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <Card className="p-5 space-y-2">
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <Users size={14} />
            Total Users
          </div>
          <p className="text-2xl font-bold">{users}</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center gap-2 text-green-600 text-xs">
            <Crown size={14} />
            Pro Users
          </div>
          <p className="text-2xl font-bold">{proUsers}</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 text-xs">
            <IndianRupee size={14} />
            Est. Monthly Revenue
          </div>
          <p className="text-2xl font-bold">
            ₹ {revenue.toLocaleString("en-IN")}
          </p>
        </Card>

      </div>
    </div>
  )
}
