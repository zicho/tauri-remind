<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import AddReminderDialog from "./(components)/add-reminder-dialog.svelte";
  import DataTable from "./(components)/data-table.svelte";
  import { setDataContext } from "./(components)/DataContext.svelte";
  import { columns } from "./(components)/reminder-columns";
  import type { Reminder } from "@/db/schema";

  let { data } = $props();

  let reminders = $state<Reminder[]>(data.reminders);
  let open = $state(false);

  const tableData = setDataContext(reminders);

  const onDeleteMany = (items: Reminder[]) => {
    tableData.deleteMany(items);
  };
</script>

<main class="p-8">
  <DataTable data={tableData.data} {columns} {onDeleteMany} />

  <Button
    class="w-full"
    onclick={() => {
      open = false;
      open = true;
    }}>Add</Button
  >
</main>

<AddReminderDialog bind:open />
