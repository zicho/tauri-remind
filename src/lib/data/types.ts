import type { NewReminder, ReminderType, ReminderUpdate } from "@/db/schema";

export type EditorTabProps = {
  onSave: (result: SaveNewReminderResult) => void;
  saveStateValid: boolean;
  cronData?: CronData;
};

export type SaveNewReminderResult = {
  cronExpression: string;
  desc: string;
  type: ReminderType;
};

export type ReminderDataCallback = {
  payload: NewReminder | ReminderUpdate
};

export type SaveEditedReminderResult = SaveNewReminderResult & {
  id: number;
};

export type CronData = {
  expression: string;
  minutes: string | number;
  hours: string | number;
  dayOfMonth: string | number;
  month: string | number;
  dayOfWeek: string | number;
};
