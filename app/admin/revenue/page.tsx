ï»¿"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  IndianRupee,
  Users,
  RefreshCcw,
} from "lucide-react"

type Row = {
  month: string
  users: number
  revenue: number
}

export default function AdminRevenuePage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [rows, setRows] = useState<Row[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  /* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ configurable price */
  const PRICE = Number(process.env.NEXT_PUBLIC_PRO_PRICE || 499)

  /* ================= LOAD ================= */

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push("/login")
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single()

    if (!profile?.is_admin) {
      router.push("/dashboard")
      return
    }

    await loadRevenue()
    setLoading(false)
  }

  /* ================= REVENUE LOGIC ================= */

  const loadRevenue = async () => {
    setRefreshing(true)

    const { data: users } = await supabase
      .from("profiles")
      .select("pro_since,is_pro")
      .eq("is_pro", true)

    const map: Record<string, Row> = {}

    users?.forEach((u: any) => {
      if (!u?.pro_since) return

      const d = new Date(u.pro_since)

      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`

      if (!map[key]) {
        map[key] = {
          month: key,
          users: 0,
          revenue: 0,
        }
      }

      map[key].users += 1
      map[key].revenue += PRICE
    })

    /* newest first */
    const list = Object.values(map).sort((a, b) =>
      b.month.localeCompare(a.month)
    )

    setRows(list)
    setTotalUsers(list.reduce((s, r) => s + r.users, 0))
    setTotalRevenue(list.reduce((s, r) => s + r.revenue, 0))

    setRefreshing(false)
  }

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-zinc-500">
        Loading revenue...
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Revenue Analytics</h1>

        {/* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ refresh added */}
        <Button size="sm" variant="outline" onClick={loadRevenue}>
          <RefreshCcw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">

        <Card className="p-5 space-y-1">
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            <Users size={12} />
            Pro Users
          </p>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </Card>

        <Card className="p-5 space-y-1">
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            <IndianRupee size={12} />
            Total Revenue
          </p>
          <p className="text-2xl font-bold">
            ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {totalRevenue.toLocaleString("en-IN")}
          </p>
        </Card>

      </div>

      {/* Table */}
      <Card className="p-4 overflow-x-auto">

        {rows.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-6">
            No revenue data yet
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-zinc-500 border-b">
              <tr>
                <th className="text-left py-2">Month</th>
                <th className="text-left py-2">Users</th>
                <th className="text-left py-2">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.month} className="border-b">
                  <td className="py-2">{r.month}</td>
                  <td>{r.users}</td>
                  <td>ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ {r.revenue.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </Card>
    </div>
  )
}
