"use client"

export default function SidebarToggle({
  onClick,
}: {
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="md:hidden border rounded px-2 py-1 text-sm"
    >
      ☰
    </button>
  )
}
