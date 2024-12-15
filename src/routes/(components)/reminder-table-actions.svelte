<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import Ellipsis from "lucide-svelte/icons/ellipsis";
  import Pencil from "lucide-svelte/icons/pencil";
  import Trash from "lucide-svelte/icons/trash";
  import Power from "lucide-svelte/icons/power";
  import PowerOff from "lucide-svelte/icons/power-off";
  import type { Reminder } from "@/db/schema";
  import { getReminderDataContext } from "../../lib/contexts/ReminderDataContext.svelte";
  import { goto } from "$app/navigation";

  let { item }: { item: Reminder } = $props();

  const data = getReminderDataContext();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        class="relative size-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <Ellipsis class="size-4" />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
      <DropdownMenu.Item
        class="cursor-pointer"
        onclick={() => data.toggle(item.id)}
      >
        {#if item.active}
          <PowerOff /> Deactivate
        {:else}
          <Power /> Activate
        {/if}
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item
      class="cursor-pointer"
      onclick={async () => goto(`/edit/${item.id}`)}
      ><Pencil />Edit</DropdownMenu.Item
    >
    <DropdownMenu.Item
      class="cursor-pointer"
      onclick={async () => await data.delete(item.id)}
      ><Trash />Delete</DropdownMenu.Item
    >
  </DropdownMenu.Content>
</DropdownMenu.Root>
