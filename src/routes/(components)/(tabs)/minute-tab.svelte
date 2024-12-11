<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import type { ReminderType } from "../reminder-columns";

  let mode = $state<"fixed" | "interval">("fixed");

  const intervals = [1, 5, 10, 15, 20, 30, 45];

  let selectedInterval = $state(intervals[0]);

  let {
    onSave,
    saveStateValid = $bindable(),
  }: {
    onSave: ({
      interval,
      type,
    }: {
      interval: string;
      type: ReminderType;
    }) => void;
    saveStateValid: boolean;
  } = $props();

  const minute = $derived(
    mode === "interval" ? `*/${selectedInterval}` : selectedInterval
  );

  const save = () => {
    onSave({
      interval: `${minute} * * * *`,
      type: mode === "fixed" ? "minute_hourly" : "minute_interval",
    });
  };
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="mb-4 text-center">By minute</Card.Title>

    <div class="flex space-x-4">
      <Button
        onclick={() => (mode = "fixed")}
        variant={mode === "fixed" ? "default" : "outline"}
        class="w-full">Fixed Minute</Button
      >
      <Button
        onclick={() => (mode = "interval")}
        variant={mode === "interval" ? "default" : "outline"}
        class="w-full">Recurring Interval</Button
      >
    </div>
  </Card.Header>
  <Card.Content class="space-y-2">
    <div class="flex space-x-2 pb-4">
      {#each intervals as interval}
        <Button
          variant={interval === selectedInterval ? "default" : "outline"}
          onclick={() => (selectedInterval = interval)}
          class="w-full">{interval}</Button
        >
      {/each}
    </div>
    <div class="text-center">
      {#if mode === "fixed"}
        <Card.Description>
          This reminder will trigger at a specific minute of every hour, e.g.,
          "at minute {selectedInterval} past the hour."
        </Card.Description>
      {:else}
        <Card.Description>
          This reminder will trigger at recurring intervals within the hour,
          e.g., "every {selectedInterval}th minute."
        </Card.Description>
      {/if}
    </div>
  </Card.Content>
  <Card.Footer>
    <Button disabled={!saveStateValid} class="w-full" onclick={save}
      >Save</Button
    >
  </Card.Footer>
</Card.Root>
