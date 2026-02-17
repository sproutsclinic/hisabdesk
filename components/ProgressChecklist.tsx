ï»¿"use client"

type Props = {
  hasIncome: boolean
  hasExpense: boolean
  downloaded: boolean
}

export default function ProgressChecklist({
  hasIncome,
  hasExpense,
  downloaded
}: Props) {
  const items = [
    { label: "Add your first income", done: hasIncome },
    { label: "Add your first expense", done: hasExpense },
    { label: "Download tax report (Pro)", done: downloaded }
  ]

  const completed = items.filter(i => i.done).length

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">

      <div className="flex justify-between mb-4">
        <h3 className="font-semibold">Setup Progress</h3>
        <span className="text-sm text-gray-500">
          {completed}/3 completed
        </span>
      </div>

      <div className="space-y-2 text-sm">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span>
              {item.done ? "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦" : "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ"}
            </span>
            <span className={item.done ? "line-through text-gray-400" : ""}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}
