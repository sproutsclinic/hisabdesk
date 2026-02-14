"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { isProUser } from "@/lib/isPro"

import EmptyState from "@/components/ui/emptyState"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

import { Search, Upload, Trash2, ArrowUpRight, Lock } from "lucide-react"

type VaultItem = {
  id: string
  title: string
  metadata: any
  file_url: string | null
}

/* 🔒 FREE LIMIT */
const FREE_UPLOAD_LIMIT = 5

export default function VaultCategoryPage() {
  const { category } = useParams() as { category: string }
  const router = useRouter()
  const toast = useToast()

  const [items, setItems] = useState<VaultItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState("")

  /* 🔒 NEW */
  const [isPro, setIsPro] = useState(false)

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [category])

  const load = async () => {
    setLoading(true)

    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) return

    setIsPro(await isProUser(user.id))

    const { data } = await supabase
      .from("vault_items")
      .select("id,title,metadata,file_url")
      .eq("category", category)
      .order("created_at", { ascending: false })

    setItems(data || [])
    setLoading(false)
  }

  /* ================= SEARCH ================= */

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()

    return items.filter((i) => {
      const meta = JSON.stringify(i.metadata || {}).toLowerCase()
      return i.title.toLowerCase().includes(q) || meta.includes(q)
    })
  }, [items, search])

  /* ================= 🔒 UPLOAD ================= */

  const handleUpload = async (file: File) => {
    /* 🔒 LIMIT FOR FREE USERS */
    if (!isPro && items.length >= FREE_UPLOAD_LIMIT) {
      router.push("/billing")
      return
    }

    setUploading(true)

    const { data } = await supabase.auth.getUser()
    const userId = data.user?.id
    if (!userId) return

    const path = `${userId}/${category}/${Date.now()}-${file.name}`

    const { error: uploadErr } = await supabase.storage
      .from("vault-documents")
      .upload(path, file)

    if (uploadErr) {
      toast.error("Upload failed")
      setUploading(false)
      return
    }

    await supabase.from("vault_items").insert({
      user_id: userId,
      category,
      title: file.name,
      file_url: path,
      metadata: {},
    })

    toast.success("Uploaded successfully")
    await load()
    setUploading(false)
  }

  /* ================= DELETE ================= */

  const remove = async (item: VaultItem) => {
    if (!confirm("Delete this document?")) return

    await supabase.from("vault_items").delete().eq("id", item.id)

    if (item.file_url) {
      await supabase.storage.from("vault-documents").remove([item.file_url])
    }

    setItems((p) => p.filter((x) => x.id !== item.id))
    toast.success("Deleted")
  }

  /* ================= FILE PICKER ================= */

  const pickFile = () => {
    /* 🔒 BLOCK CLICK */
    if (!isPro && items.length >= FREE_UPLOAD_LIMIT) {
      router.push("/billing")
      return
    }

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,.pdf"
    input.onchange = (e: any) => {
      const f = e.target.files?.[0]
      if (f) handleUpload(f)
    }
    input.click()
  }

  /* ================= HELPERS ================= */

  const getPublicUrl = (path: string | null) =>
    path
      ? supabase.storage.from("vault-documents").getPublicUrl(path).data
          .publicUrl
      : null

  /* ================= UI ================= */

  if (loading) return <div className="p-6">Loading...</div>

  const limitReached = !isPro && items.length >= FREE_UPLOAD_LIMIT

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold capitalize">{category}</h1>

        <Button
          size="sm"
          loading={uploading}
          onClick={pickFile}
          className={!isPro ? "opacity-80" : ""}
        >
          {isPro ? (
            <>
              <Upload size={14} />
              Upload
            </>
          ) : (
            <>
              <Lock size={14} />
              Upload ({items.length}/{FREE_UPLOAD_LIMIT})
            </>
          )}
        </Button>
      </div>

      {/* 🔒 FREE LIMIT BANNER */}
      {limitReached && (
        <Card
          className="text-xs cursor-pointer opacity-80"
          onClick={() => router.push("/billing")}
        >
          🔒 Free limit reached. Upgrade to Pro for unlimited uploads.
        </Card>
      )}

      {/* Search */}
      {items.length > 0 && (
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="input pl-9"
          />
        </div>
      )}

      {/* Empty */}
      {filtered.length === 0 && (
        <EmptyState
          title={`No ${category} documents yet`}
          description="Upload your first file to keep it safe"
          actionLabel="Upload"
          actionHref="#"
        />
      )}

      {/* List */}
      <div className="grid gap-4">
        {filtered.map((item) => {
          const url = getPublicUrl(item.file_url)
          const isImage = url && /\.(jpg|jpeg|png|webp)$/i.test(url)

          return (
            <Card key={item.id} className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <p className="text-sm font-medium truncate flex-1">
                  {item.title}
                </p>

                <button
                  onClick={() => remove(item)}
                  className="text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {url &&
                (isImage ? (
                  <img
                    src={url}
                    className="rounded-xl border max-h-40 object-cover"
                  />
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    className="text-xs underline flex items-center gap-1"
                  >
                    View file
                    <ArrowUpRight size={12} />
                  </a>
                ))}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
