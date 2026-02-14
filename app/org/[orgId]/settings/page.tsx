"use client"

/**
 * =========================================================
 * Organization Settings (White-Label + Config)
 * HisabDesk – Enterprise / White-Label Control
 * =========================================================
 *
 * ROUTE
 *   /org/[orgId]/settings
 *
 * PURPOSE
 * Organization level configuration:
 *
 *   ✓ company display name
 *   ✓ logo URL
 *   ✓ primary color
 *   ✓ accent color
 *   ✓ support email
 *   ✓ custom domain
 *
 * CONNECTS TO
 *   lib/whitelabel/branding-service.ts
 *
 * SAFE
 * - new page only
 * - no existing files modified
 * =========================================================
 */

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getBranding, saveBranding } from "@/lib/whitelabel/branding-service"

export default function OrgSettingsPage() {
  const params = useParams()
  const orgId = params?.orgId as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    company_name: "",
    logo_url: "",
    primary_color: "#000000",
    accent_color: "#2563eb",
    support_email: "",
    custom_domain: "",
  })

  /* ======================================================
     LOAD
  ====================================================== */

  useEffect(() => {
    async function load() {
      const data = await getBranding(orgId)

      if (data) {
        setForm({
          company_name: data.company_name || "",
          logo_url: data.logo_url || "",
          primary_color: data.primary_color || "#000000",
          accent_color: data.accent_color || "#2563eb",
          support_email: data.support_email || "",
          custom_domain: data.custom_domain || "",
        })
      }

      setLoading(false)
    }

    load()
  }, [orgId])

  /* ======================================================
     SAVE
  ====================================================== */

  async function save() {
    setSaving(true)

    await saveBranding({
      org_id: orgId,
      ...form,
    })

    setSaving(false)
    alert("Saved")
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="space-y-8 max-w-xl">
      <div>
        <h2 className="text-2xl font-semibold">
          Organization Settings
        </h2>
        <p className="text-sm text-gray-500">
          Customize branding & preferences
        </p>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && (
        <div className="border rounded-xl p-6 space-y-4">
          <Field
            label="Company Name"
            value={form.company_name}
            onChange={(v) =>
              setForm({ ...form, company_name: v })
            }
          />

          <Field
            label="Logo URL"
            value={form.logo_url}
            onChange={(v) =>
              setForm({ ...form, logo_url: v })
            }
          />

          <Field
            label="Support Email"
            value={form.support_email}
            onChange={(v) =>
              setForm({ ...form, support_email: v })
            }
          />

          <Field
            label="Custom Domain"
            value={form.custom_domain}
            onChange={(v) =>
              setForm({ ...form, custom_domain: v })
            }
          />

          <ColorField
            label="Primary Color"
            value={form.primary_color}
            onChange={(v) =>
              setForm({ ...form, primary_color: v })
            }
          />

          <ColorField
            label="Accent Color"
            value={form.accent_color}
            onChange={(v) =>
              setForm({ ...form, accent_color: v })
            }
          />

          <button
            onClick={save}
            disabled={saving}
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  )
}

/* ======================================================
   COMPONENTS
====================================================== */

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full"
      />
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">
        {label}
      </label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
