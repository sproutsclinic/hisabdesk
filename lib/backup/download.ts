ï»¿/*
  PHASE 18 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â Backup Download Helper

  Usage (client):

  import { downloadBackup } from "@/lib/backup/download"

  await downloadBackup()
*/

export async function downloadBackup() {
  const res = await fetch("/api/admin/export/backup")

  if (!res.ok) {
    alert("Backup failed")
    return
  }

  const blob = await res.blob()

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")

  a.href = url
  a.download = `hisabdesk-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`

  document.body.appendChild(a)
  a.click()
  a.remove()

  window.URL.revokeObjectURL(url)
}
