import type { NewReminder, Reminder } from "@/db/schema";
import { ReminderRepository } from "@/db/repos/ReminderRepository";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { CronJob } from "cron";
import { getContext, onDestroy, setContext } from "svelte";

const key = Symbol("REMINDER_DATA_CTX");

export class ReminderTableData {
  data = $state<Reminder[]>([]);
  #cronJobs = new Map<number, CronJob>();
  repo = new ReminderRepository();

  constructor(data: Reminder[]) {
    this.data = data;

    for (const item of data) {
      this.mapReminderToCronJob(item);
    }

    onDestroy(() => {
      this.data = [];
      this.#cronJobs = new Map();
    });
  }

  private mapReminderToCronJob(item: Reminder) {
    const job = CronJob.from({
      cronTime: item.interval,
      onTick: () => {
        if (this.data.find((x) => x.id === item.id)?.active) {
          sendNotification({
            title: item.title,
            body: item.message,
          });
        }
      },
      start: true,
      // timeZone: "America/Los_Angeles",
    });

    this.#cronJobs.set(item.id, job);
  }

  public async add(item: NewReminder) {
    const operation = await this.repo.create({ data: item });

    if (!operation.success) return; // todo: error handle

    const result = operation.result!;
    this.mapReminderToCronJob(result);
    this.data = [result, ...this.data];
  }

  public async delete(id: number) {
    const operation = await this.repo.delete({ id });

    if (!operation.success) return; // todo: error handle

    this.#cronJobs.delete(id);
    this.data = this.data?.filter((x) => x.id !== id);
  }

  public async deleteMany(items: Reminder[]) {
    const ids = items.map((x) => x.id);

    const operation = await this.repo.deleteRange({ ids });
    if (!operation.success) return; // todo: error handle

    // Create a Set of IDs for efficient lookups
    const idSet = new Set(ids);

    // Filter the #cronJobs map
    this.#cronJobs = new Map(
      Array.from(this.#cronJobs).filter(([key]) => !idSet.has(key))
    );

    // Filter the data array
    this.data = this.data?.filter((item) => !idSet.has(item.id));
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
