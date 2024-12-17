<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import type { Reminder } from "@/db/schema";
  import { convertFileSrc } from "@tauri-apps/api/core";
  import { appDataDir, join } from "@tauri-apps/api/path";
  import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
  import { onMount } from "svelte";
  import { getReminderDataContext } from "../lib/contexts/ReminderDataContext.svelte";
  import DataTable from "./(components)/data-table.svelte";
  import { columns } from "./(components)/reminder-columns";
  import { openCreateReminderWindow } from "./(utils)/openReminderModal";

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

  const listenForReminderSaved = () => {
    const currentWindow = WebviewWindow.getCurrent();

    currentWindow.listen("reminder-saved", async () => {
      location.reload();
    });
  };

  listenForReminderSaved();
</script>

<main class="p-8">
  <DataTable data={context.data} {columns} {onDeleteMany} />
  <Button class="w-full" onclick={openCreateReminderWindow}>Add</Button>
</main>

<img src={convertFileSrc("assets/32x32.png")} alt="Custom" />
