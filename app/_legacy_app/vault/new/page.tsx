"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function NewVaultItemPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return

    setLoading(true)

    try {
      const { data: auth } = await supabase.auth.getUser()

      if (!auth.user) {
        router.replace("/login")
        return
      }

      const { error } = await supabase.from("family_vault").insert({
        title,
        category: category || null,
        description: description || null,
        estimated_value: value ? Number(value) : null,
        user_id: auth.user.id,
      })

      if (error) throw error

      router.push("/vault")
    } catch (err) {
      console.error(err)
      alert("Failed to save asset")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-app py-8 space-y-6 max-w-lg">

      <h1 className="heading-lg">Add Asset</h1>

      <div className="space-y-4">

        <input
          className="input"
          placeholder="Title (Gold necklace, FD, Property...)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="input"
          placeholder="Category (Jewellery / Cash / Property)"
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
          placeholder="Estimated Value ₹"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="btn w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Asset"}
        </button>
      </div>
    </div>
  )
}
