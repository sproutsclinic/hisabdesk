ï»¿"use client"

import { useEffect, useState } from "react"
import { getSupabaseAdmin } from "@/lib/supabase/gateway"
import { useRouter } from "next/navigation"

/*
  PHASE 17 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Client Admin Guard

  Protects admin pages on client side
  (extra layer in addition to API guards)

  Usage:

  <AdminGuard>
    {children}
  </AdminGuard>
*/

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const role = user?.user_metadata?.role || "user"

      if (role !== "admin") {
        router.replace("/dashboard")
        return
      }

      setAllowed(true)
    }

    check()
  }, [router])

  if (!allowed) return null

  return <>{children}</>
}
