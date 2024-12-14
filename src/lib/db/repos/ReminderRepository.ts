import type { NewReminder, Reminder } from "../schema";
import { BaseRepository } from "./BaseRepository";

export class ReminderRepository extends BaseRepository<Reminder, NewReminder> {
  constructor() {
    super("reminders");
  }
}
