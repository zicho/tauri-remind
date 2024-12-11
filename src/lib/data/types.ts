import type { ReminderType } from "../../routes/(components)/reminder-columns";

export type ReminderSaveResult = {
  interval: string;
  desc: string;
  type: ReminderType;
};
