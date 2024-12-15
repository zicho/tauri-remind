<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Input } from "@/components/ui/input";
  import Label from "@/components/ui/label/label.svelte";
  import type { CronData, SaveNewReminderResult } from "@/data/types";
  import ArrowLeft from "lucide-svelte/icons/arrow-left";
  import type { NewReminder, Reminder, ReminderUpdate } from "@/db/schema";
  import MinuteTab from "../../(components)/(tabs)/minute-tab.svelte";
  import HourTab from "../../(components)/(tabs)/hour-tab.svelte";
  import CustomTab from "../../(components)/(tabs)/custom-tab.svelte";
  import { goto } from "$app/navigation";
  import { getReminderDataContext } from "../../../lib/contexts/ReminderDataContext.svelte";
  import Button from "@/components/ui/button/button.svelte";
  import { page } from "$app/stores";

  type EditReminderData = {
    id: number;
    title: string;
    message: string;
    interval: string;
    cronData: CronData;
    type: string;
    selectedTab: string;
  };

  let { data }: { data: EditReminderData } = $props();

  let reminderData = $state<EditReminderData>({
    ...data,
  });

  let selectedTab = $state(data.selectedTab);

  const context = getReminderDataContext();

  let titleValid = $derived(reminderData.title.length > 0);
  let messageValid = $derived(reminderData.message.length > 0);
  let saveStateValid = $derived(titleValid && messageValid);

  const onSave = async (result: SaveNewReminderResult) => {
    const reminder: ReminderUpdate = {
      id: Number($page.params.id),
      active: true,
      title: reminderData.title,
      message: reminderData.message,
      desc: result.desc,
      interval: result.cronExpression,
      type: result.type,
    };

    await context.update(reminder.id!, reminder);

    goto("/");
  };
</script>

<main class="p-8">
  <section class="flex flex-col space-y-4 mb-6">
    <div class="flex">
      <Button onclick={() => goto("/")} class="aspect-square mr-4"
        ><ArrowLeft /></Button
      >
      <h1 class="text-4xl">Editing reminder</h1>
    </div>
    <p class="text-muted-foreground text-lg">
      Editing an existing reminder. Modify the settings and press save.
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
      <Input id="name" bind:value={reminderData.title} />
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
      <Input id="name" bind:value={reminderData.message} />
    </div>
  </section>
  <Tabs.Root bind:value={selectedTab}>
    <Tabs.List class="grid w-full grid-cols-3 mb-4">
      <Tabs.Trigger value="minutes">By minute</Tabs.Trigger>
      <Tabs.Trigger value="hours">Hourly</Tabs.Trigger>
      <Tabs.Trigger value="custom">Custom</Tabs.Trigger>
      <!-- <Tabs.Trigger value="days">Daily</Tabs.Trigger>
        <Tabs.Trigger value="weeks">Weekly</Tabs.Trigger>
        <Tabs.Trigger value="months">Monthly</Tabs.Trigger>-->
    </Tabs.List>

    <Tabs.Content value="minutes">
      <MinuteTab {onSave} {saveStateValid} cronData={data.cronData} />
    </Tabs.Content>
    <Tabs.Content value="hours">
      <HourTab {onSave} {saveStateValid} cronData={data.cronData} />
    </Tabs.Content>
    <Tabs.Content value="custom">
      <CustomTab {onSave} {saveStateValid} cronData={data.cronData} />
    </Tabs.Content>
  </Tabs.Root>
</main>
