import {
  type ColumnType,
  type Generated,
  type Insertable,
  type Selectable,
  type Updateable,
} from "kysely";

export interface Database {
  reminders: ReminderTable;
}

export interface BaseEntity {
  id: Generated<number>;
  created_at?: ColumnType<Date, string | undefined, never>;
}

export type ReminderType =
  | "minute_hourly"
  | "minute_interval"
  | "hourly"
  | "custom";

export interface ReminderTable extends BaseEntity {
  title: string;
  message: string;
  desc: string;
  interval: string;
  active: boolean;
  type: ReminderType;
}

export type Reminder = Selectable<ReminderTable>;
export type NewReminder = Insertable<ReminderTable>;
export type ReminderUpdate = Updateable<ReminderTable>;
