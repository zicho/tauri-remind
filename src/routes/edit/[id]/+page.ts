import { ReminderRepository } from "@/db/repos/ReminderRepository";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { parseCronExpression } from "@/utils";

export const load = (async ({ params }) => {
  const getReminderOperation = await new ReminderRepository().getById({
    id: Number(params.id),
  });

  if (!getReminderOperation.success) error(500);

  const data = getReminderOperation.result!;

  const selectedTab = (() => {
    switch (data!.type) {
      case "minute_hourly":
      case "minute_interval":
        return "minutes";
      case "hourly":
        return "hours";
      case "custom":
        return "custom";
      default:
        return "minutes"; // Optional default case
    }
  })();

  return {
    id: data.id,
    title: data.title,
    message: data.message,
    interval: data.interval,
    cronData: parseCronExpression(data.interval),
    type: data.type,
    selectedTab,
  };
}) satisfies PageLoad;
