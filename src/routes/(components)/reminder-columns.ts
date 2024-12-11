import { renderComponent } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import Check from "lucide-svelte/icons/check";
import X from "lucide-svelte/icons/x";
import DataTableActions from "./reminder-table-actions.svelte";
import SortButton from "./sort-button.svelte";

export type ReminderType = "minute_hourly" | "minute_interval";

export type Reminder = {
  id: string;
  title: string;
  message: string;
  desc: string;
  interval: string;
  active: boolean;
  type: ReminderType;
};

export const columns: ColumnDef<Reminder>[] = [
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
          return "Every hour on minute X";
        case "minute_interval":
          return "Every Xth minute";
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
