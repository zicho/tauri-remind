<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
  import type { ComponentProps } from "svelte";

  let {
    label,
    variant = "ghost",
    ...restProps
  }: ComponentProps<typeof Button> & { label: string } = $props();
</script>

<Button {variant} {...restProps} class="px-0">
  {label}
  <ArrowUpDown class="ml-2 size-4" />
</Button>
