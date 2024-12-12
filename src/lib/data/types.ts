import type { ReminderType } from "../../routes/(components)/reminder-columns";

export type ReminderSaveResult = {
  cronExpression: string;
  desc: string;
  type: ReminderType;
};
