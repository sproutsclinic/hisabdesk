"use client"

// ==========================================================
// HisabDesk — Personal Layout (FINAL • Enterprise Grade)
// Clean • Premium • Mobile-first • Wealth Planner ready
// ==========================================================

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export default function PersonalLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()

  // ========================================================
  // NAVIGATION (FINAL STRUCTURE)
  // ========================================================

  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/income", label: "Income", icon: "🟢" },
    { href: "/expense", label: "Expenses", icon: "🔴" },

    // ✅ RENAMED CLEANLY
    { href: "/wealth-planner", label: "Wealth Planner", icon: "💎" },

    { href: "/vault", label: "Vault", icon: "🔐" },
    { href: "/insights", label: "Insights", icon: "💡" },
    { href: "/tax", label: "Tax", icon: "🧾" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="hidden md:flex w-64 bg-white border-r flex-col">

        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-lg font-semibold tracking-tight">
            HisabDesk
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">

          {nav.map((item) => {
            const active = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                  ${
                    active
                      ? "bg-black text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}

        </nav>

        {/* Footer */}
        <div className="p-4 text-xs text-slate-400 border-t">
          Personal Workspace
        </div>

      </aside>



      {/* ================================================= */}
      {/* MAIN AREA */}
      {/* ================================================= */}

      <div className="flex-1 flex flex-col">

        {/* ================================================= */}
        {/* TOP BAR */}
        {/* ================================================= */}

        <header className="h-14 bg-white border-b flex items-center justify-between px-4 md:px-6">

          <div className="font-medium text-sm text-slate-600">
            Personal Finance
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">

            <Link
              href="/expense/add"
              className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg"
            >
              + Expense
            </Link>

            <Link
              href="/income/add"
              className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg"
            >
              + Income
            </Link>

          </div>

        </header>



        {/* ================================================= */}
        {/* PAGE CONTENT */}
        {/* ================================================= */}

        <main className="flex-1 overflow-auto">

          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>

        </main>

      </div>

    </div>
  )
}
