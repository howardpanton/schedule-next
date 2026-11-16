const DAY_MS = 86_400_000;

// The schedule runs on UTC, as broadcast schedules usually do.
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

const dayStart = (date: string) => Date.parse(`${date}T00:00:00Z`);

export const formatTime = (iso: string) => timeFormat.format(new Date(iso));

export const formatDate = (date: string) => dateFormat.format(new Date(dayStart(date)));

export const todayParam = (now = Date.now()) => new Date(now).toISOString().slice(0, 10);

export function addDays(date: string, days: number): string {
  return new Date(dayStart(date) + days * DAY_MS).toISOString().slice(0, 10);
}

/** How far through the day a moment is, from 0 to 100. */
export function percentOfDay(ms: number, date: string): number {
  return Math.min(Math.max(((ms - dayStart(date)) / DAY_MS) * 100, 0), 100);
}

/** Where an event sits on a 24-hour track, as CSS percentages. */
export function trackPosition(start: string, end: string, date: string) {
  const left = percentOfDay(Date.parse(start), date);
  return { left, width: percentOfDay(Date.parse(end), date) - left };
}
