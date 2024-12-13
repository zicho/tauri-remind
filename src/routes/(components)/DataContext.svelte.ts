import { db } from "@/db/db";
import type { NewReminder, Reminder } from "@/db/schema";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { CronJob } from "cron";
import type { Insertable } from "kysely";
import { getContext, onDestroy, setContext } from "svelte";

const key = Symbol("REMINDER_DATA_CTX");

export class ReminderTableData {
  data = $state<Reminder[]>([]);
  #cronJobs = new Map<number, CronJob>();

  constructor(data: Reminder[]) {
    this.data = data;

    onDestroy(() => {
      this.data = [];
      this.#cronJobs = new Map();
    });
  }

  public async add(item: NewReminder) {
    const result = await db.insertInto("reminders")
      .values(item)
      .returningAll()
      .executeTakeFirstOrThrow() as Reminder;

    console.dir("result added:");
    console.dir(result);

    const job = CronJob.from({
      cronTime: item.interval,
      onTick: () => {
        if (this.data.find(x => x.id === result.id)?.active) {
          sendNotification({
            title: item.title,
            body: item.message,
          });
        }
      },
      start: true,
      // timeZone: "America/Los_Angeles",
    });

    this.data = [result, ...this.data];
    this.#cronJobs.set(result.id, job);
  }

  public delete(id: number) {
    this.#cronJobs.delete(id);
    this.data = this.data?.filter((x) => x.id !== id);
  }

  public deleteMany(items: Reminder[]) {
    // Create a Set of IDs for efficient lookups
    const idSet = new Set(items.map(x => x.id));

    // Filter the #cronJobs map
    this.#cronJobs = new Map(
      Array.from(this.#cronJobs).filter(([key]) => !idSet.has(key))
    );

    // Filter the data array
    this.data = this.data?.filter(item => !idSet.has(item.id));
  }


  public toggle(id: number) {
    const item = this.data.find((x) => x.id === id);
    if (!item) return;
    item.active = !item.active;
  }
}

export function setDataContext(initialData: Reminder[]) {
  const context = setContext(key, new ReminderTableData(initialData));
  return context;
}

export function getDataContext(): ReminderTableData {
  return getContext(key);
}
