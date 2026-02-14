"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function EditVaultItemPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [value, setValue] = useState("")
  const [filePath, setFilePath] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  /* ================= LOAD ================= */

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    const { data } = await supabase
      .from("family_vault")
      .select("*")
      .eq("id", id)
      .single()

    if (data) {
      setTitle(data.title)
      setCategory(data.category || "")
      setDescription(data.description || "")
      setValue(data.estimated_value?.toString() || "")
      setFilePath(data.file_path || null)
    }

    setLoading(false)
  }

  /* ================= UPLOAD ================= */

  const uploadFile = async (file: File) => {
    const ext = file.name.split(".").pop()
    const filename = `${id}.${ext}`

    const { error } = await supabase.storage
      .from("vault-files")
      .upload(filename, file, { upsert: true })

    if (!error) {
      setFilePath(filename)
    }
  }

  /* ================= SAVE ================= */

  const save = async () => {
    await supabase
      .from("family_vault")
      .update({
        title,
        category: category || null,
        description: description || null,
        estimated_value: value ? Number(value) : null,
        file_path: filePath,
      })
      .eq("id", id)

    router.push("/vault")
  }

  /* ================= PREVIEW URL ================= */

  const previewUrl = filePath
    ? supabase.storage.from("vault-files").getPublicUrl(filePath).data.publicUrl
    : null

  if (loading) return <div className="container-app py-8">Loading...</div>

  return (
    <div className="container-app py-8 space-y-4 max-w-lg">

      <h1 className="heading-lg">Edit Asset</h1>

      <input
        className="input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="input"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <textarea
        className="input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="input"
        type="number"
        placeholder="Estimated value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* FILE UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) uploadFile(e.target.files[0])
        }}
      />

      {/* PREVIEW */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt="proof"
          className="rounded-xl border max-h-48"
        />
      )}

      <button className="btn" onClick={save}>
        Save Changes
      </button>
    </div>
  )
}
