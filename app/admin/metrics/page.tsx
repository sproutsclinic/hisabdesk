"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

import {
  Users,
  Crown,
  IndianRupee,
  TrendingUp,
} from "lucide-react"

/* ========================================
   ADMIN — METRICS DASHBOARD
======================================== */

export default function AdminMetricsPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [users, setUsers] = useState(0)
  const [proUsers, setProUsers] = useState(0)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) {
      router.push("/login")
      return
    }

    const { count: total } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    const { count: pro } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_pro", true)

    setUsers(total || 0)
    setProUsers(pro || 0)

    setLoading(false)
  }

  /* ================= CALC ================= */

  const conversion =
    users > 0 ? ((proUsers / users) * 100).toFixed(1) : "0"

  /* ✅ FIXED price */
  const revenue = proUsers * 499

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-8 max-w-6xl">

      <h1 className="text-lg font-semibold">Platform Metrics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <MetricCard
          icon={<Users size={18} />}
          label="Total Users"
          value={users}
        />

        <MetricCard
          icon={<Crown size={18} />}
          label="Pro Users"
          value={proUsers}
        />

        <MetricCard
          icon={<TrendingUp size={18} />}
          label="Conversion"
          value={`${conversion}%`}
        />

        <MetricCard
          icon={<IndianRupee size={18} />}
          label="Monthly Revenue"
          value={`₹ ${revenue.toLocaleString("en-IN")}`}
        />

      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: any
}) {
  return (
    <Card className="p-5 space-y-2">
      <div className="flex items-center gap-2 text-zinc-500 text-sm">
        {icon}
        {label}
      </div>

      <p className="text-2xl font-bold">{value}</p>
    </Card>
  )
}
