ï»¿import { redirect } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

// ==========================================================
// Personal App Entry Gate
// Resolves auth and redirects user into dashboard
// ==========================================================

export default async function PersonalHomePage() {
  const supabase = getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // No session Ã¢â€ â€™ back to marketing site
  if (!user) {
    redirect("/")
  }

  // Authenticated Ã¢â€ â€™ enter application
  redirect("/dashboard")
}
