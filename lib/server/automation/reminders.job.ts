import { supabaseAdmin } from "./supabaseAdmin";

export async function runReminders() {
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await supabaseAdmin
    .from("reminders")
    .select("*")
    .eq("due_date", today);

  for (const reminder of data ?? []) {
    await supabaseAdmin.from("notifications").insert({
      user_id: reminder.user_id,
      title: "Reminder Due",
      body: reminder.title,
      created_at: new Date().toISOString()
    });
  }
}