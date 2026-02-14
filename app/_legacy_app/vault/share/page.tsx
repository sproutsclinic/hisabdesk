"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { isProUser } from "@/lib/isPro"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

import {
  Share2,
  Copy,
  ShieldCheck,
  Eye,
  Link as LinkIcon,
  RefreshCcw,
  Ban,
  Lock,
} from "lucide-react"

export default function VaultSharePage() {
  const router = useRouter()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [token, setToken] = useState<string | null>(null)

  /* 🔒 PRO */
  const [isPro, setIsPro] = useState(false)

  /* ================= INIT ================= */

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const { data } = await supabase.auth.getUser()
    const user = data.user

    if (!user) {
      router.push("/login")
      return
    }

    const pro = await isProUser(user.id)
    setIsPro(pro)

    /* 🔒 HARD LOCK — non-pro cannot open page */
    if (!pro) {
      router.push("/billing")
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("vault_share_token")
      .eq("id", user.id)
      .single()

    setToken(profile?.vault_share_token || null)
    setLoading(false)
  }

  /* ================= HELPERS ================= */

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : ""

  const generateToken = () =>
    crypto.randomUUID().replace(/-/g, "")

  const saveToken = async (newToken: string | null) => {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) return

    await supabase
      .from("profiles")
      .update({ vault_share_token: newToken })
      .eq("id", user.id)

    setToken(newToken)
  }

  /* ================= ACTIONS ================= */

  const createLink = async () => {
    setCreating(true)
    await saveToken(generateToken())
    toast.success("Secure link created")
    setCreating(false)
  }

  const regenerate = async () => {
    setCreating(true)
    await saveToken(generateToken())
    toast.success("Link rotated (old disabled)")
    setCreating(false)
  }

  const revoke = async () => {
    setCreating(true)
    await saveToken(null)
    toast.success("Access revoked")
    setCreating(false)
  }

  const copy = async () => {
    if (!token) return
    await navigator.clipboard.writeText(`${baseUrl}/vault/shared/${token}`)
    toast.success("Link copied")
  }

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  const shareUrl = token ? `${baseUrl}/vault/shared/${token}` : ""

  return (
    <div className="space-y-8 max-w-xl pb-20">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Share2 size={18} />
          Emergency Sharing
        </h1>

        <p className="text-sm text-zinc-500">
          Give your spouse or family secure read-only access
        </p>
      </div>

      {/* Security */}
      <Card className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <ShieldCheck size={16} />
          Bank-grade privacy
        </div>

        <ul className="text-xs text-zinc-500 space-y-1 list-disc pl-4">
          <li>View-only access</li>
          <li>No edits or deletions</li>
          <li>Revoke anytime</li>
        </ul>
      </Card>

      {/* Create */}
      {!token && (
        <Button onClick={createLink} loading={creating} className="w-full">
          <LinkIcon size={16} />
          Generate Secure Link
        </Button>
      )}

      {/* Active */}
      {token && (
        <Card className="space-y-4">

          <div className="flex gap-2">
            <input readOnly value={shareUrl} className="input text-xs" />

            <Button size="sm" onClick={copy}>
              <Copy size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">

            <Button variant="secondary" onClick={regenerate} loading={creating}>
              <RefreshCcw size={14} />
              Rotate
            </Button>

            <Button variant="secondary" onClick={revoke} loading={creating}>
              <Ban size={14} />
              Revoke
            </Button>

          </div>
        </Card>
      )}

      {/* Footer */}
      <Card className="text-xs text-zinc-500 flex items-center gap-2">
        <Eye size={14} />
        View-only emergency access
      </Card>

      <p className="text-xs text-center text-zinc-400 flex items-center justify-center gap-1">
        <Lock size={12} />
        Pro feature • Private • Secure
      </p>
    </div>
  )
}
