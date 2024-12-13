import { renderComponent } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import Check from "lucide-svelte/icons/check";
import X from "lucide-svelte/icons/x";
import DataTableActions from "./reminder-table-actions.svelte";
import SortButton from "./sort-button.svelte";
import { Checkbox } from "@/components/ui/checkbox";
import type { Reminder } from "@/db/schema";

export const columns: ColumnDef<Reminder>[] = [
  {
    id: "select",
    header: ({ table }) =>
      renderComponent(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        disabled: table.getRowCount() === 0,
        indeterminate:
          table.getIsSomePageRowsSelected() &&
          !table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        controlledChecked: true,
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      renderComponent(Checkbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        controlledChecked: true,
        "aria-label": "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: "Title",
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "message",
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: "Message",
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "desc",
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: "Description",
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
  },
  {
    accessorKey: "type",
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: "Type",
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
    cell: ({ row }) => {
      switch (row.original.type) {
        case "minute_hourly":
          return "Once every hour, at a specific minute";
        case "minute_interval":
          return "Multiple times per hour, at specified minutes";
      }
    },
  },
  {
    accessorKey: "active",
    size: 2,
    header: ({ column }) =>
      renderComponent(SortButton, {
        label: "Active",
        onclick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
    cell: ({ row }) => {
      // You can pass whatever you need from `row.original` to the component

      if (row.original.active) {
        // @ts-ignore
        return renderComponent(Check, {});
      }

      // @ts-ignore
      return renderComponent(X, {});
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return renderComponent(DataTableActions, { item: row.original });
    },
  },
];
