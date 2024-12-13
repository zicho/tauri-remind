import type { ReminderType } from "@/db/schema";

export type ReminderSaveResult = {
  cronExpression: string;
  desc: string;
  type: ReminderType;
};
