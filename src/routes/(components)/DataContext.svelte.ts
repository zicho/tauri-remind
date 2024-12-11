import { sendNotification } from "@tauri-apps/plugin-notification";
import { CronJob } from "cron";
import { getContext, onDestroy, setContext } from "svelte";
import type { Reminder } from "./reminder-columns";

const key = Symbol("REMINDER_DATA_CTX");

export class ReminderTableData {
  data = $state<Reminder[]>([]);
  #cronJobs = $state<CronJob[]>([]);

  constructor(data: Reminder[]) {
    this.data = data;

    onDestroy(() => {
      this.data = [];
      this.#cronJobs = [];
    });
  }

  public add(item: Reminder) {
    const job = CronJob.from({
      cronTime: item.interval,
      onTick: function () {
        sendNotification({
          title: item.title,
          body: item.message,
        });
      },
      start: true,
      timeZone: "America/Los_Angeles",
    });

    this.data = [item, ...this.data];
    this.#cronJobs.push(job);
  }

  public delete(id: string) {
    this.data = this.data?.filter((x) => x.id !== id);
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
