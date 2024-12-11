<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import Input from "@/components/ui/input/input.svelte";
  import Label from "@/components/ui/label/label.svelte";
  import type { ReminderType } from "../reminder-columns";

  let selectedHour = $state(1);
  let selectedMinute = $state(0);

  let {
    interval = $bindable(),
    desc = $bindable(),
    type = $bindable(),
  }: {
    interval: string;
    desc: string;
    type: ReminderType;
  } = $props();

  let hourValid = $state(true);
  let minuteInvalid = $state(true);

  const hourRegex = /^(0|1?\d|2[0-3])$/;
  const minuteRegex = /^(0|[1-5]?\d)$/;

  $effect(() => {
    hourValid = hourRegex.test(selectedHour.toString());
  });

  $effect(() => {
    minuteInvalid = minuteRegex.test(selectedMinute.toString());
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
        class={!minuteInvalid ? "border-destructive text-destructive" : ""}
        bind:value={selectedMinute}
      />
    </div>
    <div class="text-center mt-6">
      <Card.Description>
        {desc}
      </Card.Description>
    </div>
  </Card.Content>
</Card.Root>
