import { runRecurringIncome } from "./recurringIncome.job";
import { runReminders } from "./reminders.job";

export async function runAutomation() {
  console.log("🔄 Automation cycle started");

  await runRecurringIncome();
  await runReminders();

  console.log("✅ Automation cycle finished");
}