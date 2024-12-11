<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import type { ReminderType } from "../reminder-columns";

  const intervals = [1, 5, 10, 15, 20, 30, 45];
  let selectedInterval = $state(intervals[0]);

  let {
    interval = $bindable(),
    desc = $bindable(),
    type = $bindable(),
  }: {
    interval: string;
    desc: string;
    type: ReminderType;
  } = $props();

  $effect(() => {
    let minute =
      type === "minute_interval" ? `*/${selectedInterval}` : selectedInterval;
    interval = `${minute} * * * *`;
    if (type === "minute_hourly") {
      desc = `This reminder will trigger at a specific minute of every hour, e.g.,
          "at minute ${selectedInterval} past the hour."`;
    } else {
      desc = `This reminder will trigger at recurring intervals within the hour,
          e.g., "every ${selectedInterval}th minute."`;
    }
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
      <Card.Description>
        {desc}
      </Card.Description>
    </div>
  </Card.Content>
</Card.Root>
