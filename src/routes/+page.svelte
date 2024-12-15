<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import DataTable from "./(components)/data-table.svelte";
  import { getReminderDataContext } from "../lib/contexts/ReminderDataContext.svelte";
  import { columns } from "./(components)/reminder-columns";
  import type { Reminder } from "@/db/schema";
  import { goto } from "$app/navigation";

  const context = getReminderDataContext();
  const onDeleteMany = async (items: Reminder[]) => {
    await context.deleteMany(items);
  };
</script>

<main class="p-8">
  <DataTable data={context.data} {columns} {onDeleteMany} />
  <Button class="w-full" onclick={() => goto("/create")}>Add</Button>
</main>
