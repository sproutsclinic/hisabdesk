"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

/* =================================================
   VAULT ADD ITEM PAGE

   Purpose:
   ✅ structured form
   ✅ metadata json save
   ✅ works for all categories
   ✅ Insurance fields first (Phase 1 priority)
   ✅ upload doc
   ✅ reminder support
   ✅ mobile-first

   Saves:
   vault_items.metadata (jsonb)
   reminders (optional)

================================================= */

export default function VaultAddPage() {
  const router = useRouter()
  const { category } = useParams() as { category: string }
  const toast = useToast()

  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  /* ================= INSURANCE FIELDS ================= */

  const [insurer, setInsurer] = useState("")
  const [policyNo, setPolicyNo] = useState("")
  const [coverage, setCoverage] = useState("")
  const [premium, setPremium] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [nominee, setNominee] = useState("")
  const [claimContact, setClaimContact] = useState("")

  /* ================= SAVE ================= */

  const save = async () => {
    if (!title) return toast.error("Title required")

    setSaving(true)

    const { data: userRes } = await supabase.auth.getUser()
    const userId = userRes.user?.id
    if (!userId) return

    let path: string | null = null

    /* upload file */
    if (file) {
      path = `${userId}/${category}/${Date.now()}-${file.name}`

      await supabase.storage
        .from("vault-documents")
        .upload(path, file)
    }

    /* metadata */
    const metadata: any = {}

    if (category === "insurance") {
      metadata.insurer_name = insurer
      metadata.policy_number = policyNo
      metadata.coverage_amount = coverage
      metadata.premium_amount = premium
      metadata.due_date = dueDate
      metadata.nominee = nominee
      metadata.claim_contact = claimContact
    }

    /* insert vault item */
    const { data: inserted } = await supabase
      .from("vault_items")
      .insert({
        user_id: userId,
        category,
        title,
        file_url: path,
        metadata,
      })
      .select()
      .single()

    /* reminder for insurance premium */
    if (category === "insurance" && dueDate) {
      await supabase.from("reminders").insert({
        user_id: userId,
        vault_item_id: inserted.id,
        reminder_date: dueDate,
        type: "premium",
      })
    }

    toast.success("Saved safely 🔒")

    router.push(`/vault/${category}`)
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6 max-w-xl">

      <h1 className="text-base font-semibold capitalize">
        Add {category}
      </h1>

      <Card className="space-y-4">

        {/* TITLE */}
        <input
          className="input"
          placeholder="Title (e.g. LIC Policy)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* ================= INSURANCE FORM ================= */}
        {category === "insurance" && (
          <div className="space-y-3">

            <input
              className="input"
              placeholder="Insurer name"
              value={insurer}
              onChange={(e) => setInsurer(e.target.value)}
            />

            <input
              className="input"
              placeholder="Policy number"
              value={policyNo}
              onChange={(e) => setPolicyNo(e.target.value)}
            />

            <input
              className="input"
              placeholder="Coverage amount"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
            />

            <input
              className="input"
              placeholder="Premium amount"
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
            />

            <input
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <input
              className="input"
              placeholder="Nominee"
              value={nominee}
              onChange={(e) => setNominee(e.target.value)}
            />

            <input
              className="input"
              placeholder="Claim contact"
              value={claimContact}
              onChange={(e) => setClaimContact(e.target.value)}
            />

          </div>
        )}

        {/* FILE */}
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {/* SAVE */}
        <Button loading={saving} onClick={save}>
          Save
        </Button>
      </Card>

      <p className="text-xs text-zinc-400 text-center">
        🔒 Encrypted • Private • Family safe
      </p>
    </div>
  )
}
