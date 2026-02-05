"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
  ShieldCheck,
  Plus,
  Bell,
  LifeBuoy
} from "lucide-react"

import Link from "next/link"
import { supabase } from "@/lib/supabase"

/* ========================================
   PAGE TITLES
======================================== */

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/customers": "Customers",
  "/invoices": "Invoices",
  "/expenses": "Expenses",
  "/reports": "Reports",
}

/* ========================================
   HEADER (TRUST + PLAN AWARE)
======================================== */

export default function Header() {
  const pathname = usePathname()

  const [syncTime, setSyncTime] = useState("")
  const [isPro, setIsPro] = useState(false)

  /* ================= SYNC CLOCK ================= */

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setSyncTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit"
        })
      )
    }

    update()
    const t = setInterval(update, 30000) // every 30s

    return () => clearInterval(t)
  }, [])

  /* ================= PLAN STATUS ================= */

  useEffect(() => {
    const loadPlan = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", data.user.id)
        .single()

      setIsPro(profile?.is_pro === true)
    }

    loadPlan()
  }, [])

  const title =
    titles[pathname] ||
    pathname.split("/")[1]?.charAt(0).toUpperCase() +
      pathname.split("/")[1]?.slice(1)

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="h-14 px-4 md:px-8 flex items-center justify-between">

          {/* ===== LEFT ===== */}
          <div className="flex items-center gap-4">
            <h1 className="text-sm md:text-base font-semibold">
              {title}
            </h1>

            <span className="hidden md:block text-xs text-zinc-500">
              Synced {syncTime}
            </span>
          </div>

          {/* ===== RIGHT ===== */}
          <div className="flex items-center gap-3">

            {/* Encrypted badge */}
            <div className="hidden md:flex items-center gap-1 text-xs text-green-600 font-medium">
              <ShieldCheck size={14} />
              Encrypted
            </div>

            {/* Plan badge */}
            <span
              className={`hidden md:inline text-xs px-2 py-1 rounded-full font-medium
              ${isPro ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}
            >
              {isPro ? "Pro Plan" : "Free Plan"}
            </span>

            {/* Quick Add */}
            <Link
              href="/transactions/new"
              className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg text-xs hover:opacity-90"
            >
              <Plus size={14} />
              Add
            </Link>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-zinc-100">
              <Bell size={16} />
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Floating support */}
      <a
        href="mailto:support@hisabdesk.com"
        className="fixed bottom-24 right-4 md:right-8 bg-black text-white w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition z-50"
      >
        <LifeBuoy size={18} />
      </a>
    </>
  )
}
