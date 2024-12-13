<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import Button from "@/components/ui/button/button.svelte";
  import { Input } from "@/components/ui/input";
  import Label from "@/components/ui/label/label.svelte";
  import type { SaveNewReminderResult } from "@/data/types";
  import type { NewReminder } from "@/db/schema";
  import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
  import X from "lucide-svelte/icons/x";
  import CustomTab from "../(components)/(tabs)/custom-tab.svelte";
  import HourTab from "../(components)/(tabs)/hour-tab.svelte";
  import MinuteTab from "../(components)/(tabs)/minute-tab.svelte";
  import { getReminderDataContext } from "../../lib/contexts/ReminderDataContext.svelte";

  type ReminderData = {
    title: string;
    message: string;
  };

  let initialData = $state<ReminderData>({
    title: "",
    message: "",
  });

  const context = getReminderDataContext();

  let titleValid = $derived(initialData.title.length > 0);
  let messageValid = $derived(initialData.message.length > 0);
  let saveStateValid = $derived(titleValid && messageValid);

  const onSave = async (result: SaveNewReminderResult) => {
    const reminder: NewReminder = {
      active: true,
      title: initialData.title,
      message: initialData.message,
      desc: result.desc,
      interval: result.cronExpression,
      type: result.type,
    };

    const webview = WebviewWindow.getCurrent();

    webview.emit("reminder-saved", reminder);
    webview.close();
  };
</script>

<main class="p-8">
  <section class="flex flex-col space-y-4 mb-6">
    <div class="flex justify-between">
      <h1 class="text-4xl">Create new reminder</h1>
      <Button
        onclick={() => WebviewWindow.getCurrent().close()}
        class="aspect-square mr-4"><X /></Button
      >
    </div>
    <p class="text-muted-foreground text-lg">
      Adding a new reminder. Modify the settings and press save.
    </p>
  </section>

  <section class="flex flex-col space-y-4 mb-6">
    <div>
      <div class="flex justify-between mb-2">
        <Label for="name" class="font-semibold text-md">Title</Label>
        {#if !titleValid}
          <Label for="name" class="font-semibold text-destructive text-md"
            >Required</Label
          >
        {/if}
      </div>
      <Input id="name" bind:value={initialData.title} />
    </div>
    <div>
      <div class="flex justify-between mb-2">
        <Label for="name" class="font-semibold text-md">Message</Label>
        {#if !messageValid}
          <Label for="name" class="font-semibold text-destructive text-md"
            >Required</Label
          >
        {/if}
      </div>
      <Input id="name" bind:value={initialData.message} />
    </div>
  </section>
  <Tabs.Root value="minutes">
    <Tabs.List class="grid w-full grid-cols-3 mb-4">
      <Tabs.Trigger value="minutes">By minute</Tabs.Trigger>
      <Tabs.Trigger value="hours">Hourly</Tabs.Trigger>
      <Tabs.Trigger value="custom">Custom</Tabs.Trigger>
      <!-- <Tabs.Trigger value="days">Daily</Tabs.Trigger>
        <Tabs.Trigger value="weeks">Weekly</Tabs.Trigger>
        <Tabs.Trigger value="months">Monthly</Tabs.Trigger>-->
    </Tabs.List>

    <Tabs.Content value="minutes">
      <MinuteTab {onSave} {saveStateValid} />
    </Tabs.Content>
    <Tabs.Content value="hours">
      <HourTab {onSave} {saveStateValid} />
    </Tabs.Content>
    <Tabs.Content value="custom">
      <CustomTab {onSave} {saveStateValid} />
    </Tabs.Content>
  </Tabs.Root>
</main>
