ï»¿"use client"

export default function Timeline() {
  const items = [
    { label: "Advance Tax Q4", date: "15 Mar" },
    { label: "ITR Filing", date: "31 Jul" },
  ]

  return (
    <div className="card space-y-3">

      <h3 className="text-sm font-medium text-zinc-500">
        Upcoming Deadlines
      </h3>

      {items.map((i) => (
        <div
          key={i.label}
          className="flex justify-between text-sm"
        >
          <span>{i.label}</span>
          <span className="text-zinc-500">{i.date}</span>
        </div>
      ))}
    </div>
  )
}
