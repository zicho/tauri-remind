<script lang="ts">
  import { setReminderDataContext } from "@/contexts/ReminderDataContext.svelte";
  import "../app.css";
  let { children, data } = $props();

  setReminderDataContext(data.reminders);
</script>

{@render children()}
