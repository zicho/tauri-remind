<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "@/components/ui/input";
  import type { ReminderSaveResult } from "@/data/types";
  import type { ReminderType } from "@/db/schema";
  import cronstrue from "cronstrue";

  const intervals = [1, 5, 10, 15, 20, 30, 45];
  let selectedInterval = $state(intervals[0]);

  let cronExpression = $state("");
  let desc = $state("");
  let type = $state<ReminderType>("minute_hourly");

  let {
    onSave,
    saveStateValid,
  }: { onSave: (result: ReminderSaveResult) => void; saveStateValid: boolean } =
    $props();

  function save() {
    const result: ReminderSaveResult = {
      cronExpression,
      desc,
      type,
    };

    onSave(result);
  }

  $effect(() => {
    let minute =
      type === "minute_interval" ? `*/${selectedInterval}` : selectedInterval;
    cronExpression = `${minute} * * * *`;

    if (type === "minute_hourly") {
      desc = `Triggers ${cronstrue.toString(cronExpression).toLowerCase()}`;
    } else {
      desc = `Triggers ${cronstrue.toString(cronExpression).toLowerCase()} within the hour`;
    }
  });

  let minuteValid = $state(true);
  const minuteRegex = /^([1-9]|[1-5]\d)$/;

  $effect(() => {
    minuteValid = minuteRegex.test(selectedInterval.toString());
  });
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="mb-4 text-center">By minute</Card.Title>

    <div class="flex space-x-4">
      <Button
        onclick={() => (type = "minute_hourly")}
        variant={type === "minute_hourly" ? "default" : "outline"}
        class="w-full">Fixed Minute</Button
      >
      <Button
        onclick={() => (type = "minute_interval")}
        variant={type === "minute_interval" ? "default" : "outline"}
        class="w-full">Recurring Interval</Button
      >
    </div>
  </Card.Header>
  <Card.Content class="space-y-2">
    <div class="flex space-x-2">
      {#each intervals as interval}
        <Button
          variant={interval === selectedInterval ? "default" : "outline"}
          onclick={() => (selectedInterval = interval)}
          class="w-full">{interval}</Button
        >
      {/each}
      <Input
        class="w-full text-right"
        placeholder="custom"
        bind:value={selectedInterval}>Custom</Input
      >
    </div>
    <Card.Description class="text-center py-2 text-md">
      {#if minuteValid}
        <p>{desc}</p>
        <p><strong>Expression: {cronExpression}</strong></p>
      {:else}
        <p class="text-destructive">
          Selected interval must be an integer between 1 and 59, not beginning
          with zero
        </p>
      {/if}
    </Card.Description>
    <Card.Footer class="p-0">
      <Button
        onclick={save}
        disabled={!minuteValid || !saveStateValid}
        class="w-full">Save</Button
      >
    </Card.Footer>
  </Card.Content>
</Card.Root>
