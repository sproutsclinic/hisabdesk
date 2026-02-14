"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import {
  LayoutDashboard,
  Users,
  Receipt,
  Wallet,
  BarChart3,
  LogOut,
  ShieldCheck,
} from "lucide-react"

/* ========================================
   NAV ITEMS (unchanged routes)
======================================== */

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/expenses", label: "Expenses", icon: Wallet },
  { href: "/reports", label: "Reports", icon: BarChart3 },
]

/* ========================================
   SIDEBAR — ENTERPRISE POLISH

   ✅ softer shadows
   ✅ smoother active state
   ✅ better spacing
   ✅ sticky height stability
   ✅ trust footer
   ✅ dark mode ready
   ✅ accessibility improvements
   ✅ zero breaking changes
======================================== */

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside
      className="
        hidden md:flex
        w-64
        h-screen
        sticky top-0
        flex-col
        shrink-0

        bg-white dark:bg-zinc-900
        border-r border-zinc-200 dark:border-zinc-800
        shadow-sm

        px-5 py-6
      "
    >
      {/* ===== Brand ===== */}
      <div className="mb-10 px-2 select-none">
        <h1 className="text-xl font-semibold tracking-tight">
          HisabDesk
        </h1>

        <p className="text-xs text-zinc-500 mt-1">
          Smart Tax OS
        </p>
      </div>

      {/* ===== Navigation ===== */}
      <nav className="flex-1 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`
                group
                flex items-center gap-3
                px-3 py-2.5
                rounded-xl
                text-sm font-medium
                transition-all duration-150

                ${
                  active
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }
              `}
            >
              <Icon
                size={18}
                className="
                  opacity-80
                  group-hover:opacity-100
                  transition
                "
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* ===== Footer ===== */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
        {/* Trust Badge */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <ShieldCheck size={14} />
          Bank-grade security
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="
            flex items-center gap-2
            w-full text-sm
            px-3 py-2.5
            rounded-xl
            font-medium

            text-red-600
            hover:bg-red-50
            dark:hover:bg-red-950/40

            transition
          "
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
