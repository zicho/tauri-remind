<script lang="ts" generics="TData, TValue">
  import {
    createSvelteTable,
    FlexRender,
  } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "@/components/ui/button";

  import {
    type ColumnDef,
    type PaginationState,
    type SortingState,
    type RowSelectionState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
  } from "@tanstack/table-core";
  import Trash from "lucide-svelte/icons/trash";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onDeleteMany?: (items: TData[]) => void;
  };

  let { columns, data, onDeleteMany }: DataTableProps<TData, TValue> = $props();

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
  let sorting = $state<SortingState>([]);
  let rowSelection = $state<RowSelectionState>({});

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    onRowSelectionChange: (updater) => {
      if (typeof updater === "function") {
        rowSelection = updater(rowSelection);
      } else {
        rowSelection = updater;
      }
    },
    state: {
      get pagination() {
        return pagination;
      },
      get sorting() {
        return sorting;
      },
      get rowSelection() {
        return rowSelection;
      },
    },
  });

  let selectedItems = $derived(table.getFilteredSelectedRowModel().rows);

  const onDeleteManyClick = () => {
    onDeleteMany?.(selectedItems.map((x) => x.original));
    table.resetRowSelection();
  };
</script>

{#if onDeleteMany}
  <div class="flex justify-end mb-4">
    <Button
      onclick={onDeleteManyClick}
      disabled={selectedItems.length === 0}
      variant="destructive"><Trash />Delete selected</Button
    >
  </div>
{/if}
<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head>
              {#if !header.isPlaceholder}
                <FlexRender
                  content={header.column.columnDef.header}
                  context={header.getContext()}
                />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row data-state={row.getIsSelected() && "selected"}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell>
              <FlexRender
                content={cell.column.columnDef.cell}
                context={cell.getContext()}
              />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">
            No results.
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>

<div class="flex justify-between my-4">
  <div class="text-muted-foreground flex-1">
    {table.getFilteredSelectedRowModel().rows.length} of{" "}
    {table.getFilteredRowModel().rows.length} row(s) selected.
  </div>
  <div>Pagination</div>
</div>
