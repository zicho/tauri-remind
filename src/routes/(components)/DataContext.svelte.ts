import { sendNotification } from "@tauri-apps/plugin-notification";
import { CronJob } from "cron";
import { getContext, onDestroy, setContext } from "svelte";
import type { Reminder } from "./reminder-columns";

const key = Symbol("REMINDER_DATA_CTX");

export class ReminderTableData {
  data = $state<Reminder[]>([]);
  #cronJobs = new Map<string, CronJob>();

  constructor(data: Reminder[]) {
    this.data = data;

    onDestroy(() => {
      this.data = [];
      this.#cronJobs = new Map();
    });
  }

  public add(item: Reminder) {
    const job = CronJob.from({
      cronTime: item.interval,
      onTick: () => {
        if (this.data.find(x => x.id === item.id)?.active) {
          sendNotification({
            title: item.title,
            body: item.message,
          });
        }
      },
      start: true,
      // timeZone: "America/Los_Angeles",
    });

    console.dir(item)

    this.data = [item, ...this.data];
    this.#cronJobs.set(item.id, job);
  }

  public delete(id: string) {
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


  public toggle(id: string) {
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
