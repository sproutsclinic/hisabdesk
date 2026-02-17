ï»¿"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Users,
  Search,
  Crown,
  ShieldCheck,
  Filter,
  RefreshCcw,
} from "lucide-react"

/* =================================================
   ADMIN ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â USERS PANEL (Enterprise Ready)

   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ list all users
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ search
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ pro badge
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ created date
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ pro filter
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ live stats
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ refresh button (added)
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ empty state (added)
   ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ admin protected
================================================= */

type Row = {
  id: string
  email: string
  is_pro: boolean
  created_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [rows, setRows] = useState<Row[]>([])

  const [search, setSearch] = useState("")
  const [onlyPro, setOnlyPro] = useState(false)

  /* ================= INIT ================= */

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

    await loadUsers()
    setLoading(false)
  }

  /* ================= LOAD ================= */

  const loadUsers = async () => {
    setRefreshing(true)

    const { data } = await supabase
      .from("profiles")
      .select("id,email,is_pro,created_at")
      .order("created_at", { ascending: false })

    setRows(data || [])
    setRefreshing(false)
  }

  /* ================= FILTERS ================= */

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const emailMatch = r.email
        ?.toLowerCase()
        .includes(search.toLowerCase())

      const proMatch = onlyPro ? r.is_pro : true

      return emailMatch && proMatch
    })
  }, [rows, search, onlyPro])

  /* ================= STATS ================= */

  const total = rows.length
  const proCount = rows.filter((r) => r.is_pro).length
  const freeCount = total - proCount

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-zinc-500">
        Loading users...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} />
          <h1 className="text-lg font-semibold">Users</h1>
        </div>

        {/* ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ refresh added */}
        <Button size="sm" variant="outline" onClick={loadUsers}>
          <RefreshCcw
            size={14}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="text-lg font-semibold">{total}</p>
        </Card>

        <Card className="text-center">
          <p className="text-xs text-zinc-500">Pro</p>
          <p className="text-lg font-semibold text-green-600">{proCount}</p>
        </Card>

        <Card className="text-center">
          <p className="text-xs text-zinc-500">Free</p>
          <p className="text-lg font-semibold">{freeCount}</p>
        </Card>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">

        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email..."
            className="pl-9"
          />
        </div>

        <button
          onClick={() => setOnlyPro(!onlyPro)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
            transition
            ${
              onlyPro
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 dark:bg-zinc-800"
            }
          `}
        >
          <Filter size={14} />
          Pro only
        </button>
      </div>

      {/* Users list */}
      <div className="space-y-3">

        {filtered.length === 0 && (
          <Card className="text-center text-sm text-zinc-500 py-8">
            No users found
          </Card>
        )}

        {filtered.map((u) => (
          <Card
            key={u.id}
            className="flex items-center justify-between text-sm"
          >
            <div className="space-y-1">
              <p className="font-medium">{u.email}</p>
              <p className="text-xs text-zinc-500">
                Joined {new Date(u.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>

            {u.is_pro ? (
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <Crown size={12} />
                Pro
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <ShieldCheck size={12} />
                Free
              </span>
            )}
          </Card>
        ))}

      </div>
    </div>
  )
}
