"use client"

import { useEffect, useState } from "react"

export default function IncomeGoalCard() {
  const [data, setData] = useState<any>(null)
  const [value, setValue] = useState("")

  async function load() {
    const res = await fetch("/api/income/goals")
    const json = await res.json()
    setData(json.data)
  }

  useEffect(() => {
    load()
  }, [])

  async function save() {
    await fetch("/api/income/goals", {
      method: "POST",
      body: JSON.stringify({
        target: Number(value),
      }),
    })

    setValue("")
    load()
  }

  if (!data) return null

  return (
    <div className="p-4 border rounded-2xl bg-green-50 space-y-4">

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 text-sm">

        <Kpi label="This Month" value={data.thisTotal} />
        <Kpi label="Last Month" value={data.lastTotal} />
        <Kpi label="Growth" value={`${data.growth}%`} />

      </div>

      {/* Progress */}
      <div>
        <p className="text-xs text-muted-foreground mb-1">
          Target ₹ {data.target || 0}
        </p>

        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600"
            style={{ width: `${Math.min(data.progress, 100)}%` }}
          />
        </div>

        <p className="text-xs mt-1">{data.progress}% achieved</p>
      </div>

      {/* Set target */}
      <div className="flex gap-2">
        <input
          placeholder="Set monthly goal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border p-2 rounded-lg flex-1"
        />
        <button
          onClick={save}
          className="bg-black text-white px-4 rounded-lg"
        >
          Save
        </button>
      </div>

    </div>
  )
}

function Kpi({ label, value }: any) {
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-semibold">
        ₹ {Number(value).toLocaleString("en-IN")}
      </p>
    </div>
  )
}
