ï»¿import { supabaseAdmin } from "./supabaseAdmin";

export async function runRecurringIncome() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: rules, error } = await supabaseAdmin
    .from("recurring_income")
    .select("*")
    .lte("next_run_date", today);

  if (error) throw error;

  for (const rule of rules ?? []) {
    await supabaseAdmin.from("incomes").insert({
      user_id: rule.user_id,
      source_id: rule.source_id,
      amount: rule.amount,
      received_date: today,
      note: "Auto-generated (recurring)"
    });

    await supabaseAdmin
      .from("recurring_income")
      .update({
        next_run_date: calculateNextDate(rule.frequency, today)
      })
      .eq("id", rule.id);
  }
}

function calculateNextDate(freq: string, from: string) {
  const d = new Date(from);

  if (freq === "monthly") d.setMonth(d.getMonth() + 1);
  if (freq === "weekly") d.setDate(d.getDate() + 7);
  if (freq === "yearly") d.setFullYear(d.getFullYear() + 1);

  return d.toISOString().slice(0, 10);
}
