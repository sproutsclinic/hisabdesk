"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

/*
  PHASE 17 — Client Admin Guard

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
