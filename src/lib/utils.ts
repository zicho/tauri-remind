import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CronData } from "./data/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseCronExpression(cronExpression: string): CronData {
  const parts = cronExpression.split(" ");
  const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;

  return {
    expression: cronExpression,
    minutes: simplifyCronValue(minutes),
    hours: simplifyCronValue(hours),
    dayOfMonth: simplifyCronValue(dayOfMonth),
    month: simplifyCronValue(month),
    dayOfWeek: simplifyCronValue(dayOfWeek),
  };
}

function simplifyCronValue(value: string): string | number {
  if (value.startsWith("*/")) {
    return parseInt(value.slice(2), 10); // Extract the number after "*/"
  }
  return value;
}
