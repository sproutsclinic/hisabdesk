"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  TrendingUp,
  Wallet,
  Calculator,
  Plus,
} from "lucide-react"

/* ==========================================================
   MOBILE NAV — Fintech Bottom Bar (Hardened)

   Improvements:
   • route prefix safe (/app/*)
   • consistent icons with sidebar
   • safe-area padding
   • better tap targets
   • centered primary action (FAB)
   • zero breaking behavior
========================================================== */

const tabs = [
  { href: "/app/dashboard", label: "Home", Icon: Home },
  { href: "/app/income", label: "Income", Icon: TrendingUp },
  { href: "/app/expense", label: "Expense", Icon: Wallet },
  { href: "/app/tax", label: "Tax", Icon: Calculator },
]

export default function MobileNav() {
  const pathname = usePathname()

  const Tab = ({
    href,
    label,
    Icon,
  }: {
    href: string
    label: string
    Icon: any
  }) => {
    const active = pathname?.startsWith(href)

    return (
      <Link
        href={href}
        className="
          flex flex-col items-center justify-center
          flex-1
          py-2
          rounded-xl
          active:scale-95
          transition
        "
      >
        <Icon
          size={20}
          className={active ? "text-zinc-900" : "text-zinc-400"}
        />
        <span
          className={`
            text-[11px] mt-1
            ${active ? "text-zinc-900 font-medium" : "text-zinc-500"}
          `}
        >
          {label}
        </span>
      </Link>
    )
  }

  return (
    <nav
      className="
        md:hidden
        fixed bottom-0 left-0 right-0
        bg-white
        border-t border-zinc-200
        h-16
        flex items-center
        px-2
        pb-[env(safe-area-inset-bottom)]
        z-40
      "
    >
      {/* Left tabs */}
      <div className="flex flex-1 justify-around">
        {tabs.slice(0, 2).map((t) => (
          <Tab key={t.href} {...t} />
        ))}
      </div>

      {/* Primary FAB */}
      <Link
        href="/app/income/add"
        className="
          -mt-6
          w-14 h-14
          rounded-full
          bg-zinc-900 text-white
          flex items-center justify-center
          shadow-lg
          active:scale-95
          transition
        "
      >
        <Plus size={22} />
      </Link>

      {/* Right tabs */}
      <div className="flex flex-1 justify-around">
        {tabs.slice(2).map((t) => (
          <Tab key={t.href} {...t} />
        ))}
      </div>
    </nav>
  )
}
