<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "@/components/ui/button";
  import Input from "@/components/ui/input/input.svelte";
  import type { EditorTabProps, SaveNewReminderResult } from "@/data/types";
  import cronstrue from "cronstrue";
  import * as CronParser from "cron-parser";

  let { onSave, saveStateValid, cronData }: EditorTabProps = $props();

  let cronExpression = $state(cronData?.expression ?? "* * * * *");
  let desc = $state("");

  function save() {
    const result: SaveNewReminderResult = {
      cronExpression,
      desc,
      type: "custom",
    };

    onSave(result);
  }

  // for some reason, "CronParser" just logs certain errors without throwing them.
  // thus this regex is needed to catch the cases it refuses to handle.
  const cronRegex =
    /^(\*|([0-5]?\d)) (\*|([0-1]?\d|2[0-3])) (\*|([1-2]?\d|3[0-1])) (\*|(1[0-2]|0?[1-9])) (\*|([0-7]))$/;

  const cronExpressionValid = $derived.by(() => {
    try {
      if (!cronRegex.test(cronExpression)) return false;
      CronParser.parseExpression(cronExpression);
      return true;
    } catch (e) {
      return false;
    }
  });

  $effect(() => {
    if (!cronExpressionValid) return;

    desc = cronstrue.toString(cronExpression);
  });
</script>

<Card.Root>
  <Card.Header>
    <Card.Title class="text-center">Custom expression</Card.Title>
  </Card.Header>
  <Card.Content class="py-4">
    <div class="flex flex-col items-center space-y-2">
      <div>
        <span class="text-muted-foreground font-semibold">Cheat sheet:</span>
      </div>
      <div class="text-muted-foreground flex justify-center space-x-4 w-full">
        <span>Minute</span>
        <span>Hour</span>
        <span>Day (month)</span>
        <span>Month</span>
        <span>Day (week)</span>
      </div>
      <Input
        bind:value={cronExpression}
        class="text-center font-bold tracking-widest"
      />
    </div>
    <Card.Description class="text-center py-4 text-md">
      {#if cronExpressionValid}
        <p>{desc}</p>
      {:else}
        <p class="text-destructive">
          Your CRON expression seems to be invalid.
        </p>
      {/if}
    </Card.Description>
    <Card.Footer class="p-0">
      <Button
        onclick={save}
        disabled={!saveStateValid || !cronExpressionValid}
        class="w-full">Save</Button
      >
    </Card.Footer>
  </Card.Content>
</Card.Root>
