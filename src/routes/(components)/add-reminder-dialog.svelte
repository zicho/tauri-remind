<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { Input } from "@/components/ui/input";
  import Label from "@/components/ui/label/label.svelte";
  import type { SaveNewReminderResult } from "@/data/types";
  import MinuteTab from "./(tabs)/minute-tab.svelte";
  import { getReminderDataContext } from "../../lib/contexts/ReminderDataContext.svelte";
  import HourTab from "./(tabs)/hour-tab.svelte";
  import CustomTab from "./(tabs)/custom-tab.svelte";
  import type { NewReminder, Reminder } from "@/db/schema";

  let { open = $bindable() }: { open: boolean } = $props();

  type ReminderData = {
    title: string;
    message: string;
  };

  let initialData = $state<ReminderData>({
    title: "",
    message: "",
  });

  const data = getReminderDataContext();

  let titleValid = $derived(initialData.title.length > 0);
  let messageValid = $derived(initialData.message.length > 0);
  let saveStateValid = $derived(titleValid && messageValid);

  const onSave = async (result: SaveNewReminderResult) => {
    open = false;

    const reminder: NewReminder = {
      active: true,
      title: initialData.title,
      message: initialData.message,
      desc: result.desc,
      interval: result.cronExpression,
      type: result.type,
    };

    await data.add(reminder);

    initialData = {
      title: "",
      message: "",
    };
  };
</script>

<Dialog.Root {open}>
  <Dialog.Content class="w-full max-w-4xl h-full">
    <Dialog.Header>
      <Dialog.Title>Adding reminder</Dialog.Title>
      <Dialog.Description>
        Adding a new reminder. Modify the settings and press save.
      </Dialog.Description>
    </Dialog.Header>
    <div class="flex flex-col space-y-4">
      <div>
        <div class="flex justify-between mb-2">
          <Label for="name" class="font-semibold">Title</Label>
          {#if !titleValid}
            <Label for="name" class="font-semibold text-destructive"
              >Required</Label
            >
          {/if}
        </div>
        <Input id="name" bind:value={initialData.title} />
      </div>
      <div>
        <div class="flex justify-between mb-2">
          <Label for="name" class="font-semibold">Message</Label>
          {#if !messageValid}
            <Label for="name" class="font-semibold text-destructive"
              >Required</Label
            >
          {/if}
        </div>
        <Input id="name" bind:value={initialData.message} />
      </div>
    </div>
    <Tabs.Root value="minutes">
      <Tabs.List class="grid w-full grid-cols-3">
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
  </Dialog.Content>
</Dialog.Root>
