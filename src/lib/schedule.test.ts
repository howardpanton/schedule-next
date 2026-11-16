import { describe, expect, it } from "vitest";
import { dashboard, eventsOn, isDateParam, statusAt } from "./schedule";

const at = (iso: string) => Date.parse(iso);

describe("eventsOn", () => {
  it("returns the running order for a day, sorted by start time", () => {
    const events = eventsOn("2026-11-09");
    expect(events).toHaveLength(13);
    expect(events[0]).toMatchObject({
      title: "Morning Bulletin",
      start: "2026-11-09T06:00:00.000Z",
    });
  });

  it("filters by channel", () => {
    const titles = eventsOn("2026-11-09", "news").map((e) => e.title);
    expect(titles).toEqual(["Morning Bulletin", "Midday News", "Evening News", "Late Briefing"]);
  });
});

describe("statusAt", () => {
  const [bulletin] = eventsOn("2026-11-09");

  it.each([
    ["2026-11-09T05:59:00Z", "upcoming"],
    ["2026-11-09T06:00:00Z", "live"],
    ["2026-11-09T08:00:00Z", "finished"],
  ])("at %s the bulletin is %s", (now, status) => {
    expect(statusAt(bulletin!, at(now))).toBe(status);
  });
});

describe("dashboard", () => {
  it("counts live, upcoming and finished events for today", () => {
    const summary = dashboard(at("2026-11-09T14:30:00Z"));
    expect(summary.counts).toEqual({ live: 2, upcoming: 7, finished: 4 });
    expect(summary.liveNow.map((e) => e.title)).toEqual(["Matinee Classic", "Live: Cup Final"]);
  });

  it("fills 'up next' from tomorrow late in the day", () => {
    const summary = dashboard(at("2026-11-09T23:45:00Z"));
    expect(summary.upNext[0]).toMatchObject({
      title: "Morning Bulletin",
      start: "2026-11-10T06:00:00.000Z",
    });
  });
});

describe("isDateParam", () => {
  it.each([
    ["2026-11-09", true],
    ["2026-13-40", false],
    ["2026-02-30", false],
    ["2026-11-31", false],
    ["2028-02-29", true],
    ["tomorrow", false],
  ])("%s -> %s", (value, expected) => {
    expect(isDateParam(value)).toBe(expected);
  });
});
