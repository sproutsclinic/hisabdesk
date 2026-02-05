"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Receipt,
  Wallet,
  FileText,
  Plus,
} from "lucide-react"

/* ========================================
   TABS (excluding center FAB)
   (kept same routes → zero breaking)
======================================== */

const tabs = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/income", label: "Income", icon: Receipt },
  { href: "/expense", label: "Expense", icon: Wallet },
  { href: "/tax", label: "Tax", icon: FileText },
]

/* ========================================
   MOBILE NAV — Fintech Grade

   Adds:
   ✅ thumb-zone layout
   ✅ safe-area padding (iPhone)
   ✅ better touch targets
   ✅ dark mode
   ✅ smoother active state
   ✅ floating primary action
   ✅ zero breaking changes
======================================== */

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="
        md:hidden
        fixed bottom-0 left-0 right-0
        z-50

        bg-white dark:bg-zinc-950
        border-t border-zinc-200 dark:border-zinc-800
        shadow-[0_-4px_12px_rgba(0,0,0,0.04)]

        h-16
        pb-[env(safe-area-inset-bottom)]
        flex items-center
        px-2
      "
    >
      {/* ===== Left tabs ===== */}
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
                rounded-lg
                active:scale-95
                transition
              "
            >
              <Icon
                size={20}
                className={
                  active
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400"
                }
              />

              <span
                className={`text-[11px] mt-1 ${
                  active
                    ? "text-zinc-900 dark:text-white font-medium"
                    : "text-zinc-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* ===== Center FAB (Primary Action) ===== */}
      <Link
        href="/transactions/new"
        className="
          -mt-7
          bg-zinc-900 text-white
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

      {/* ===== Right tabs ===== */}
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
                rounded-lg
                active:scale-95
                transition
              "
            >
              <Icon
                size={20}
                className={
                  active
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400"
                }
              />

              <span
                className={`text-[11px] mt-1 ${
                  active
                    ? "text-zinc-900 dark:text-white font-medium"
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
