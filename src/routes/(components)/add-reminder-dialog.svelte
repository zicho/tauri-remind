<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import Button from "@/components/ui/button/button.svelte";
  import { Input } from "@/components/ui/input";
  import Label from "@/components/ui/label/label.svelte";
  import MinuteTab from "./(tabs)/minute-tab.svelte";
  import { getDataContext } from "./DataContext.svelte";
  import type { Reminder, ReminderType } from "./reminder-columns";

  let { open = $bindable() }: { open: boolean } = $props();

  let reminder = $state<Reminder>({
    id: crypto.randomUUID(),
    title: "New reminder",
    message: "",
    active: true,
    interval: "",
  });

  const data = getDataContext();

  let saveStateValid = $state(false);

  $effect(() => {
    saveStateValid = false;

    if (reminder.message.length > 0) saveStateValid = true;
  });

  const onSave = ({
    interval,
    type,
  }: {
    interval: string;
    type: ReminderType;
  }) => {
    open = false;

    reminder.interval = interval;
    reminder.type = type;

    data.add(reminder);

    reminder = {
      id: crypto.randomUUID(),
      title: "New reminder",
      message: "",
      active: true,
      interval: "",
      type,
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
        <Label for="username" class="font-semibold">Description</Label>
        <Input id="username" bind:value={reminder.message} />
      </div>
    </div>
    <Tabs.Root value="minutes">
      <Tabs.List class="grid w-full grid-cols-6">
        <Tabs.Trigger value="minutes">By minute</Tabs.Trigger>
        <Tabs.Trigger value="hours">Hourly</Tabs.Trigger>
        <Tabs.Trigger value="days">Daily</Tabs.Trigger>
        <Tabs.Trigger value="weeks">Weekly</Tabs.Trigger>
        <Tabs.Trigger value="months">Monthly</Tabs.Trigger>
        <Tabs.Trigger value="custom">Custom</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="minutes">
        <MinuteTab bind:saveStateValid onSave={(x) => onSave(x)} />
      </Tabs.Content>
    </Tabs.Root>
    <Dialog.Footer>
      <Button class="w-full">Save</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
