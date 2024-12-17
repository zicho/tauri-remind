<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import type { NewReminder, Reminder, ReminderUpdate } from "@/db/schema";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { listen } from "@tauri-apps/api/event";
  import { appDataDir, join } from "@tauri-apps/api/path";
  import { onMount } from "svelte";
  import { getReminderDataContext } from "../lib/contexts/ReminderDataContext.svelte";
  import DataTable from "./(components)/data-table.svelte";
  import { columns } from "./(components)/reminder-columns";
  import { openCreateReminderWindow } from "./(utils)/openReminderModal";
  import type { ReminderDataCallback } from "@/data/types";
  import { toast } from "svelte-sonner";

  let assetUrl = $state("");

  onMount(async () => {
    const appDataDirPath = await appDataDir();
    const filePath = await join(appDataDirPath, "assets/32x32.png");
    assetUrl = convertFileSrc(filePath);
  });

  const context = getReminderDataContext();
  const onDeleteMany = async (items: Reminder[]) => {
    await context.deleteMany(items);
  };

  const setupEventListener = async () => {
    await listen("reminder-saved", async (event: ReminderDataCallback) => {
      // Perform any actions, such as refreshing context or showing a toast
      if (event.payload.id) {
        await context.update(event.payload.id, event.payload as ReminderUpdate);
      } else {
        await context.add(event.payload as NewReminder);
      }
    });
  };

  // Call this function during window initialization
  setupEventListener();
</script>

<main class="p-8">
  <DataTable data={context.data} {columns} {onDeleteMany} />
  <Button class="w-full" onclick={openCreateReminderWindow}>Add</Button>
</main>

<img src={convertFileSrc("assets/32x32.png")} alt="Custom" />
