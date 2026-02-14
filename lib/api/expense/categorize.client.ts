export async function autoCategorize(text: string) {
  const res = await fetch("/api/ai/expense-categorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  const json = await res.json()
  return json.category || "Other"
}