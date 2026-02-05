"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Receipt,
  Wallet,
  FileText,
  Plus
} from "lucide-react"

/* ========================================
   TABS (excluding center FAB)
======================================== */

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/income", label: "Income", icon: Receipt },
  { href: "/expense", label: "Expense", icon: Wallet },
  { href: "/tax", label: "Tax", icon: FileText },
]

/* ========================================
   MOBILE NAV
======================================== */

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="
        md:hidden
        fixed bottom-0 left-0 right-0
        bg-white border-t shadow-lg
        h-16
        flex items-center justify-between
        px-3
        z-50
        safe-bottom
      "
    >
      {/* Left tabs */}
      <div className="flex flex-1 justify-around">
        {tabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon
          const active = pathname.startsWith(tab.href)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="
                flex flex-col items-center justify-center
                flex-1 py-2
              "
            >
              <Icon
                size={20}
                className={
                  active
                    ? "text-black"
                    : "text-zinc-400"
                }
              />
              <span
                className={`text-[11px] mt-1 ${
                  active
                    ? "text-black font-medium"
                    : "text-zinc-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Center FAB (Primary action) */}
      <Link
        href="/transactions/new"
        className="
          -mt-6
          bg-black text-white
          w-14 h-14
          rounded-full
          flex items-center justify-center
          shadow-xl
          active:scale-95
          transition
        "
      >
        <Plus size={22} />
      </Link>

      {/* Right tabs */}
      <div className="flex flex-1 justify-around">
        {tabs.slice(2).map((tab) => {
          const Icon = tab.icon
          const active = pathname.startsWith(tab.href)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="
                flex flex-col items-center justify-center
                flex-1 py-2
              "
            >
              <Icon
                size={20}
                className={
                  active
                    ? "text-black"
                    : "text-zinc-400"
                }
              />
              <span
                className={`text-[11px] mt-1 ${
                  active
                    ? "text-black font-medium"
                    : "text-zinc-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
