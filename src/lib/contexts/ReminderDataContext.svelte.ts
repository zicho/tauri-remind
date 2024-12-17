import type { NewReminder, Reminder, ReminderUpdate } from "@/db/schema";
import { ReminderRepository } from "@/db/repos/ReminderRepository";
import { sendNotification } from "@tauri-apps/plugin-notification";
import { CronJob } from "cron";
import { getContext, onDestroy, setContext } from "svelte";
import { convertFileSrc } from "@tauri-apps/api/core";

const key = Symbol("REMINDER_DATA_CTX");

export class ReminderDataContext {
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
      onTick: async () => {
        if (this.data.find((x) => x.id === item.id)?.active) {
          sendNotification({
            title: item.title,
            body: item.message,
            icon: convertFileSrc("assets/32x32.png"),
            attachments: [
              {
                id: 'image-1',
                url: "http://asset.localhost/assets/32x32.png"
              },
            ],
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

  public async get(id: number) {
    const operation = await this.repo.getById({ id });
    if (!operation.success) return; // todo: error handle
    return operation.result!;
  }

  public async update(id: number, item: ReminderUpdate) {
    const operation = await this.repo.update({ id, data: item });
    if (!operation.success) return; // todo: error handle

    let existingJob = this.#cronJobs.get(id);

    if (existingJob) {
      existingJob.stop();
      existingJob.running = false;
      this.#cronJobs.delete(id);
    }

    let existingItem = this.data.find((x) => x.id === id);

    if (existingItem) {
      this.data = this.data.map((x) =>
        x.id === id ? { ...(item as Reminder) } : x
      );
      this.mapReminderToCronJob(item as Reminder);
    }

    return operation.result!;
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

export function setReminderDataContext(initialData: Reminder[]) {
  const state = new ReminderDataContext(initialData);
  setContext(key, state);
  return state;
}

export function getReminderDataContext(): ReminderDataContext {
  const data = getContext<ReminderDataContext>(key);
  return data;
}
