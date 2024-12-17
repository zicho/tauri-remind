<script lang="ts">
  import { setReminderDataContext } from "@/contexts/ReminderDataContext.svelte";
  import "../app.css";
  import { Toaster } from "@/components/ui/sonner";
  let { children, data } = $props();

  setReminderDataContext(data.reminders);
</script>

<Toaster richColors={true} closeButton={true}/>

{@render children()}
