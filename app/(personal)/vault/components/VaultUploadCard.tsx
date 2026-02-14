"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

export default function VaultUploadCard() {
  const [file, setFile] = useState<File | null>(null)

  const upload = async () => {
    if (!file) return

    const res = await fetch("/api/vault/upload", {
      method: "POST",
      body: JSON.stringify({ filename: file.name }),
    })

    const { url } = await res.json()

    await fetch(url, {
      method: "PUT",
      body: file,
    })

    location.reload()
  }

  return (
    <Card className="p-4 space-y-2">
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] ?? null)
        }
      />

      <button onClick={upload}>Upload</button>
    </Card>
  )
}
