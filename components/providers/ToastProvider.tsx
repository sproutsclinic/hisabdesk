"use client"

import { createContext, useContext, useState } from "react"
import Toast from "@/components/ui/Toast"

const ToastContext = createContext<any>(null)

export function useToast() {
  return useContext(ToastContext)
}

export default function ToastProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [msg, setMsg] = useState("")

  const show = (text: string) => {
    setMsg(text)
    setTimeout(() => setMsg(""), 2000)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {msg && <Toast message={msg} />}
    </ToastContext.Provider>
  )
}
