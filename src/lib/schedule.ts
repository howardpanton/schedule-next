export type Status = "live" | "upcoming" | "finished";

export interface Channel {
  id: string;
  name: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  channelId: string;
  start: string;
  end: string;
}

export interface EventWithStatus extends ScheduleEvent {
  status: Status;
}

export const channels: Channel[] = [
  { id: "news", name: "News 24" },
  { id: "sport-1", name: "Sport 1" },
  { id: "sport-2", name: "Sport 2" },
  { id: "movies", name: "Movies" },
];

// The same running order every day: channel, title, start hour (UTC), minutes.
const DAILY: Array<[string, string, number, number]> = [
  ["news", "Morning Bulletin", 6, 120],
  ["news", "Midday News", 12, 60],
  ["news", "Evening News", 18, 60],
  ["news", "Late Briefing", 22, 30],
  ["sport-1", "Premier Highlights", 9, 90],
  ["sport-1", "Live: Cup Final", 14, 150],
  ["sport-1", "Match of the Day", 20, 90],
  ["sport-2", "Tennis: Quarter Finals", 10, 240],
  ["sport-2", "Cycling: Stage 12", 15, 180],
  ["sport-2", "Motorsport Qualifying", 19, 120],
  ["movies", "Matinee Classic", 13, 120],
  ["movies", "Family Film", 16, 105],
  ["movies", "Feature Presentation", 21, 150],
];

const HOUR_MS = 3_600_000; // 1 hour in milliseconds
const DAY_MS = 24 * HOUR_MS; // 1 day in milliseconds

/**
 * Checks if a string is a valid date parameter in the format YYYY-MM-DD.
 * @param value - The string to check.
 * @returns True if the string is a valid date parameter, false otherwise.
 */
export function isDateParam(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  // Date.parse rolls 30 February over to 2 March, so check the date survives the round trip.
  const ms = Date.parse(`${value}T00:00:00Z`);
  return !Number.isNaN(ms) && toDateParam(ms) === value;
}

/**
 * Converts a timestamp in milliseconds to a date parameter string in the format YYYY-MM-DD.
 * @param ms - The timestamp in milliseconds.
 * @returns The date parameter string.
 */
export function toDateParam(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * Returns the schedule events for a given date and optional channel.
 * @param date - The date parameter in the format YYYY-MM-DD.
 * @param channelId - Optional channel ID to filter events.
 * @returns An array of schedule events.
 */
export function eventsOn(date: string, channelId?: string): ScheduleEvent[] {
  const dayStart = Date.parse(`${date}T00:00:00Z`);
  return DAILY.filter(([channel]) => !channelId || channel === channelId)
    .map(([channel, title, hour, minutes]) => {
      const start = dayStart + hour * HOUR_MS;
      return {
        id: `${date}-${channel}-${hour}`,
        title,
        channelId: channel,
        start: new Date(start).toISOString(),
        end: new Date(start + minutes * 60_000).toISOString(),
      };
    })
    .sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * Returns the status of a schedule event at a given time.
 * @param event - The schedule event.
 * @param now - The current timestamp in milliseconds.
 * @returns The status of the event: 'upcoming', 'live', or 'finished'.
 */
export function statusAt(event: ScheduleEvent, now: number): Status {
  if (now < Date.parse(event.start)) return "upcoming";
  if (now < Date.parse(event.end)) return "live";
  return "finished";
}

/**
 * Adds the status to each schedule event based on the current time.
 * @param events - The array of schedule events.
 * @param now - The current timestamp in milliseconds.
 * @returns An array of schedule events with their status.
 */
export function withStatus(events: ScheduleEvent[], now: number): EventWithStatus[] {
  return events.map((event) => ({ ...event, status: statusAt(event, now) }));
}

/**
 * Returns the dashboard information for the current time.
 * @param now - The current timestamp in milliseconds.
 * @returns An object containing the date, counts, channels, live events, and upcoming events.
 */
export function dashboard(now: number) {
  const today = withStatus(eventsOn(toDateParam(now)), now);
  const tomorrow = withStatus(eventsOn(toDateParam(now + DAY_MS)), now);
  const count = (status: Status) => today.filter((event) => event.status === status).length;

  return {
    date: toDateParam(now),
    counts: { live: count("live"), upcoming: count("upcoming"), finished: count("finished") },
    channels,
    liveNow: today.filter((event) => event.status === "live"),
    upNext: [...today, ...tomorrow].filter((event) => event.status === "upcoming"),
  };
}
