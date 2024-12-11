<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import AddReminderDialog from "./(components)/add-reminder-dialog.svelte";
  import DataTable from "./(components)/data-table.svelte";
  import { setDataContext } from "./(components)/DataContext.svelte";
  import { columns, type Reminder } from "./(components)/reminder-columns";

  let data = $state<Reminder[]>([
    // {
    //   id: crypto.randomUUID(),
    //   name: "Drick kaffe",
    //   active: true,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   name: "Drick öl",
    //   active: false,
    // },
  ]);

  let open = $state(false);

  const tableData = setDataContext(data);
</script>

<main class="p-8">
  <DataTable data={tableData.data} {columns} />

  <Button
    class="w-full my-4"
    onclick={() => {
      open = false;
      open = true;
    }}>Add</Button
  >
</main>

<AddReminderDialog bind:open />
