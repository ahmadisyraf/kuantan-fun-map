import {
  parse,
  isBefore,
  isAfter,
  addMinutes,
  isWithinInterval,
} from "date-fns";

type Status = "Open" | "Closing soon" | "Opening soon" | "Closed";

export function getOperatingStatus(hours: string[]): Status {
  const today = new Date();
  const dayIndex = today.getDay(); // Sunday: 0, Monday: 1, ...
  const todayHours = hours[dayIndex === 0 ? 6 : dayIndex - 1]; // adjust index for your format

  if (todayHours.includes("Closed")) return "Closed";

  const [, timeRange] = todayHours.split(": ");
  const [openTimeStr, closeTimeStr] = timeRange.split(" – ");

  const openTime = parse(openTimeStr.trim(), "hh:mm a", today);
  const closeTime = parse(closeTimeStr.trim(), "hh:mm a", today);

  const now = new Date();

  if (isBefore(now, openTime)) {
    return isWithinInterval(now, {
      start: addMinutes(openTime, -30),
      end: openTime,
    })
      ? "Opening soon"
      : "Closed";
  }

  if (isAfter(now, closeTime)) {
    return "Closed";
  }

  if (
    isWithinInterval(now, {
      start: addMinutes(closeTime, -30),
      end: closeTime,
    })
  ) {
    return "Closing soon";
  }

  return "Open";
}