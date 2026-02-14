"use client"

import { useState } from "react"

type Props = {
  text: string
  children: React.ReactNode
}

export default function Tooltip({ text, children }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow((s) => !s)}
    >
      {children}

      {show && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 bg-black text-white text-xs rounded-lg px-3 py-2 shadow-lg">
          {text}
        </div>
      )}
    </div>
  )
}
