<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Input from "@/components/ui/input/input.svelte";
  import Label from "@/components/ui/label/label.svelte";
  import type { ReminderType } from "../reminder-columns";
  import type { ReminderSaveResult } from "@/data/types";
  import cronstrue from "cronstrue";
  import { Button } from "@/components/ui/button";

  let selectedHour = $state(1);
  let selectedMinute = $state(0);

  let cronExpression = $state("");
  let desc = $state("");
  let type: ReminderType = "hourly";

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

  let hourValid = $state(true);
  let minuteValid = $state(true);

  const hourRegex = /^(0|1?\d|2[0-3])$/;
  const minuteRegex = /^(0|[1-5]?\d)$/;

  $effect(() => {
    hourValid = hourRegex.test(selectedHour.toString());
  });

  $effect(() => {
    minuteValid = minuteRegex.test(selectedMinute.toString());
  });

  $effect(() => {
    cronExpression = `${selectedMinute} */${selectedHour} * * *`;
    desc = `Triggers ${cronstrue.toString(cronExpression).toLowerCase()}`;
  });
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="text-center">Hourly</Card.Title>
  </Card.Header>
  <Card.Content>
    <div class="flex space-x-5 items-center">
      <Label>Hour</Label>
      <Input
        class={!hourValid ? "border-destructive text-destructive" : ""}
        bind:value={selectedHour}
      />
      <Label>Minute</Label>
      <Input
        class={!minuteValid ? "border-destructive text-destructive" : ""}
        bind:value={selectedMinute}
      />
    </div>
    <Card.Description class="text-center py-4 text-md">
      {#if minuteValid && hourValid}
        <p>{desc}</p>
        <p><strong>Expression: {cronExpression}</strong></p>
      {:else}
        <p class="text-destructive flex flex-col">
          {#if !hourValid}
            <span>
              Selected hour must be an integer between 1 and 23, not beginning
              with zero
            </span>
          {/if}
          {#if !minuteValid}
            <span>
              Selected minute must be an integer between 1 and 59, not beginning
              with zero
            </span>
          {/if}
        </p>
      {/if}
    </Card.Description>
    <Card.Footer class="p-0">
      <Button
        onclick={save}
        disabled={!minuteValid || !hourValid || !saveStateValid}
        class="w-full">Save</Button
      >
    </Card.Footer>
  </Card.Content>
</Card.Root>
