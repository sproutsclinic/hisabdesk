ï»¿"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  FileText,
  Calculator,
  Vault,
  BarChart3,
  Send,
  Settings,
  Wallet, // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ ADDED (Budget icon)
} from "lucide-react"

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/income", label: "Income", icon: TrendingUp },
  { href: "/expense", label: "Expense", icon: Receipt },

  // ======================================================
  // ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ ADDED ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Budget Planner (no changes to existing items)
  // ======================================================
  { href: "/budget", label: "Budget", icon: Wallet },

  { href: "/gst", label: "GST", icon: FileText },
  { href: "/tax", label: "Tax", icon: Calculator },
  { href: "/vault", label: "Vault", icon: Vault },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/filing", label: "Filing", icon: Send },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="
        hidden md:flex
        fixed left-0 top-0
        h-screen w-64
        bg-white
        border-r border-zinc-200
        flex-col
        px-4 py-6
      "
    >
      <div className="px-3 mb-8">
        <h1 className="text-base font-semibold tracking-tight">
          HisabDesk
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Personal Finance
        </p>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3
                h-10 px-3
                rounded-xl
                text-sm
                transition-colors
                ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-700 hover:bg-zinc-100"
                }
              `}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-3 pt-6 text-xs text-zinc-400">
        Secure ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Encrypted ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Private
      </div>
    </aside>
  )
}
