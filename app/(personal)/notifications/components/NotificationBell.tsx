ï»¿"use client"

import { useState } from "react"
import NotificationPanel from "./NotificationPanel"

export default function NotificationBell() {
  const [open, setOpen] = useState(false)

  // temporary mock (later from API)
  const notifications = [
    {
      id: "1",
      title: "Bill Due",
      message: "Electricity bill due tomorrow",
    },
    {
      id: "2",
      title: "Loan EMI",
      message: "Home loan EMI scheduled",
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="text-xl"
      >
        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â
      </button>

      <NotificationPanel
        open={open}
        notifications={notifications}
      />
    </div>
  )
}
