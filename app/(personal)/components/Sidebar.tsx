"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/* ✅ ADDED — lightweight icons (safe, optional visual polish) */
import {
  LayoutDashboard,
  TrendingUp,
  ArrowDownCircle,
  Receipt,
  PieChart,
  Landmark,
  User,
  FolderLock,
  LineChart,
  Sparkles,
  Calculator,
  Zap,
  Rocket,
} from "lucide-react"

/* ✅ ADDED — icon map (non-breaking) */
const iconMap: Record<string, any> = {
  "/dashboard": LayoutDashboard,
  "/income": TrendingUp,
  "/expense": ArrowDownCircle,
  "/bills": Receipt,
  "/portfolio": PieChart,
  "/loans": Landmark,
  "/profile": User,
  "/vault": FolderLock,
  "/wealth-planner": LineChart,
  "/insights": Sparkles,
  "/tax": Calculator,
  "/automation": Zap,
  "/onboarding": Rocket,
}

const items = [
  { href: "/dashboard", label: "Dashboard" },

  { href: "/income", label: "Income" },
  { href: "/expense", label: "Expense" },
  { href: "/bills", label: "Bills" },

  { href: "/portfolio", label: "Portfolio" },
  { href: "/loans", label: "Loans" },

  { href: "/profile", label: "Profile" },
  { href: "/vault", label: "Vault" },

  { href: "/wealth-planner", label: "Wealth Planner" },
  { href: "/insights", label: "Insights" },
  { href: "/tax", label: "Tax" },

  { href: "/automation", label: "Automation" },
  { href: "/onboarding", label: "Onboarding" },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside
      className="
        w-64 border-r bg-white h-screen sticky top-0 flex flex-col

        /* ✅ ADDED — subtle depth */
        shadow-sm

        /* ✅ ADDED — smoother feel */
        transition-colors
      "
    >

      {/* Header */}
      <div className="p-6 border-b">
        <div className="font-semibold text-lg tracking-tight">
          HisabDesk
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Personal Finance
        </p>
      </div>

      {/* Nav */}
      <nav
        className="
          space-y-1 px-3 py-4 overflow-y-auto flex-1

          /* ✅ ADDED — smooth scroll */
          scroll-smooth
        "
      >
        {items.map((i) => {
          const active = path === i.href || path.startsWith(i.href + "/")

          /* ✅ ADDED — icon resolve */
          const Icon = iconMap[i.href]

          return (
            <Link
              key={i.href}
              href={i.href}
              className={`

                block px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-150

                /* ✅ ADDED — flex for icon */
                flex items-center gap-3

                ${
                  active
                    ? `
                        bg-black text-white shadow-sm

                        /* ✅ ADDED — active glow */
                        ring-1 ring-black/10
                      `
                    : `
                        text-gray-700
                        hover:bg-gray-100
                        hover:text-black

                        /* ✅ ADDED — nicer hover animation */
                        hover:translate-x-[2px]
                      `
                }
              `}
            >
              {/* ✅ ADDED — icon (safe, optional) */}
              {Icon && <Icon size={16} />}

              {i.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer space for future (profile/logout etc) */}
      <div
        className="
          p-3 border-t text-xs text-muted-foreground

          /* ✅ ADDED — softer footer */
          bg-gray-50/70
        "
      >
        © HisabDesk
      </div>

    </aside>
  )
}