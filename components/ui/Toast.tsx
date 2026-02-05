"use client"

export default function Toast({
  message
}: {
  message: string
}) {
  return (
    <div
      className="
        fixed bottom-20 left-1/2 -translate-x-1/2
        bg-black text-white text-sm
        px-4 py-2 rounded-xl shadow-lg
        z-50
      "
    >
      {message}
    </div>
  )
}
