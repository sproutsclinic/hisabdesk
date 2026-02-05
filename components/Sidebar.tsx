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
} from "lucide-react"

/* ========================================
   NAV ITEMS
======================================== */

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/expenses", label: "Expenses", icon: Wallet },
  { href: "/reports", label: "Reports", icon: BarChart3 },
]

/* ========================================
   SIDEBAR
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
        w-64 h-screen
        bg-white border-r
        flex-col
        p-6
        sticky top-0
      "
    >
      {/* ===== Brand ===== */}
      <div className="mb-10">
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
              className={`
                flex items-center gap-3
                px-3 py-2 rounded-xl text-sm
                transition
                ${
                  active
                    ? "bg-black text-white"
                    : "text-zinc-700 hover:bg-zinc-100"
                }
              `}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* ===== Footer ===== */}
      <div className="pt-6 border-t space-y-3">
        <div className="text-xs text-zinc-500">
          🔒 Bank-grade security
        </div>

        <button
          onClick={logout}
          className="
            flex items-center gap-2
            w-full text-sm
            px-3 py-2 rounded-xl
            text-red-600 hover:bg-red-50
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
