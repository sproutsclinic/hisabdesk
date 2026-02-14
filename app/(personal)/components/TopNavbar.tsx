"use client"

import NotificationBell from "@/app/(personal)/notifications/components/NotificationBell"

/* ✅ ADDED */
import { usePathname } from "next/navigation"

/* ✅ ADDED */
import Link from "next/link"

/* ✅ ADDED — small icons for polish */
import { Search, Plus, UserCircle } from "lucide-react"

/* ✅ ADDED — simple title helper */
function getTitle(path: string) {
  const map: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/income": "Income",
    "/expense": "Expense",
    "/bills": "Bills",
    "/portfolio": "Portfolio",
    "/loans": "Loans",
    "/vault": "Vault",
    "/profile": "Profile",
    "/tax": "Tax",
    "/wealth-planner": "Wealth Planner",
    "/insights": "Insights",
    "/automation": "Automation",
    "/onboarding": "Onboarding",
  }

  const key = Object.keys(map).find((k) =>
    path === k || path.startsWith(k + "/")
  )

  return key ? map[key] : "Dashboard"
}

export default function TopNavbar() {
  /* ✅ ADDED */
  const path = usePathname()
  const title = getTitle(path)

  return (
    <header
      className="
        h-14 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-30

        /* ✅ ADDED — premium glass feel */
        backdrop-blur supports-[backdrop-filter]:bg-white/80

        /* ✅ ADDED — subtle depth */
        shadow-sm
      "
    >

      {/* LEFT — page title + greeting */}
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">
          Welcome back 👋
        </span>

        {/* ✅ ADDED page title */}
        <span className="text-sm font-semibold tracking-tight">
          {title}
        </span>
      </div>


      {/* ===================================================== */}
      {/* ✅ ADDED — CENTER SEARCH (non-breaking UI only) */}
      {/* ===================================================== */}

      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Search anything..."
            className="
              w-full pl-9 pr-3 py-1.5 text-sm
              border rounded-lg bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-black/10
            "
          />
        </div>
      </div>


      {/* RIGHT — actions */}
      <div className="flex items-center gap-4">

        {/* ================================================= */}
        {/* ✅ ADDED — quick add shortcut */}
        {/* ================================================= */}
        <Link
          href="/expense/add"
          className="
            hidden sm:flex items-center gap-1
            text-xs font-medium
            bg-black text-white
            px-3 py-1.5 rounded-lg
            hover:opacity-90
            transition
          "
        >
          <Plus size={14} />
          Add
        </Link>

        <NotificationBell />

        {/* ================================================= */}
        {/* ✅ ADDED — avatar placeholder */}
        {/* ================================================= */}
        <div
          className="
            h-8 w-8 rounded-full bg-gray-100
            flex items-center justify-center
            border
          "
        >
          <UserCircle size={18} className="text-gray-600" />
        </div>

      </div>
    </header>
  )
}