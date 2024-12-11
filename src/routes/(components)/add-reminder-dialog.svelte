<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import Button from "@/components/ui/button/button.svelte";
  import { Input } from "@/components/ui/input";
  import Label from "@/components/ui/label/label.svelte";
  import type { ReminderSaveResult } from "@/data/types";
  import MinuteTab from "./(tabs)/minute-tab.svelte";
  import { getDataContext } from "./DataContext.svelte";
  import type { Reminder } from "./reminder-columns";

  let { open = $bindable() }: { open: boolean } = $props();

  type ReminderData = {
    title: "New reminder";
    message: "";
  };

  let reminder = $state<ReminderData>({
    title: "New reminder",
    message: "",
  });

  const data = getDataContext();

  let saveStateValid = $state(false);

  $effect(() => {
    saveStateValid = false;

    if (reminder.message.length > 0) saveStateValid = true;
  });

  const onSave = (result: ReminderSaveResult) => {
    open = false;

    const new_reminder: Reminder = {
      id: crypto.randomUUID(),
      active: true,
      title: reminder.title,
      message: reminder.message,
      desc: result.desc,
      interval: result.interval,
      type: result.type,
    };

    data.add(new_reminder);

    reminder = {
      title: "New reminder",
      message: "",
    };
  };
</script>

<Dialog.Root {open}>
  <Dialog.Content class="w-full max-w-4xl">
    <Dialog.Header>
      <Dialog.Title>Adding reminder</Dialog.Title>
      <Dialog.Description>
        Adding a new reminder. Modify the settings and press save.
      </Dialog.Description>
    </Dialog.Header>
    <div class="flex flex-col space-y-4">
      <div>
        <Label for="name" class="font-semibold">Title</Label>
        <Input id="name" bind:value={reminder.title} />
      </div>
      <div>
        <Label for="username" class="font-semibold">Message</Label>
        <Input id="username" bind:value={reminder.message} />
      </div>
    </div>
    <Tabs.Root value="minutes">
      <Tabs.List class="grid w-full grid-cols-2">
        <Tabs.Trigger value="minutes">By minute</Tabs.Trigger>
        <Tabs.Trigger value="hours">Hourly</Tabs.Trigger>
        <!-- <Tabs.Trigger value="days">Daily</Tabs.Trigger>
        <Tabs.Trigger value="weeks">Weekly</Tabs.Trigger>
        <Tabs.Trigger value="months">Monthly</Tabs.Trigger>
        <Tabs.Trigger value="custom">Custom</Tabs.Trigger> -->
      </Tabs.List>
      <Tabs.Content value="minutes">
        <MinuteTab {onSave} />
      </Tabs.Content>
      <Tabs.Content value="hours">
        <!-- <HourTab
          bind:interval={reminder.interval}
          bind:type={reminder.type}
          bind:desc={reminder.desc}
        /> -->
      </Tabs.Content>
    </Tabs.Root>
  </Dialog.Content>
</Dialog.Root>
