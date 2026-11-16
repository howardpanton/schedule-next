import { describe, expect, it } from "vitest";
import { addDays, formatDate, formatTime, percentOfDay, trackPosition } from "./time";

describe("time helpers", () => {
  it("formats times and dates in UTC", () => {
    expect(formatTime("2026-11-09T14:00:00.000Z")).toBe("14:00");
    expect(formatDate("2026-11-09")).toBe("Monday 9 November");
  });

  it("adds days across a month boundary", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2026-11-01", -1)).toBe("2026-10-31");
  });

  it("places an event on the day track", () => {
    expect(trackPosition("2026-11-09T06:00:00Z", "2026-11-09T12:00:00Z", "2026-11-09")).toEqual({
      left: 25,
      width: 25,
    });
  });

  it("clamps to the day", () => {
    expect(percentOfDay(Date.parse("2026-11-08T23:00:00Z"), "2026-11-09")).toBe(0);
    expect(percentOfDay(Date.parse("2026-11-10T01:00:00Z"), "2026-11-09")).toBe(100);
  });
});
