// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { signSession } from "@/lib/session";
import { GET } from "./route";

async function request(query: string, signedIn = true) {
  const headers = signedIn ? { cookie: `session=${await signSession("u1")}` } : undefined;
  return GET(new NextRequest(`http://localhost/api/schedule${query}`, { headers }));
}

describe("GET /api/schedule", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-09T14:30:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("requires a session", async () => {
    const res = await request("", false);
    expect(res.status).toBe(401);
  });

  it("returns the day's events with a status, filtered by channel", async () => {
    const res = await request("?date=2026-11-09&channel=sport-1");
    const body = (await res.json()) as { events: Array<{ title: string; status: string }> };
    expect(body.events.map((e) => [e.title, e.status])).toEqual([
      ["Premier Highlights", "finished"],
      ["Live: Cup Final", "live"],
      ["Match of the Day", "upcoming"],
    ]);
  });

  it("rejects a malformed date", async () => {
    const res = await request("?date=yesterday");
    expect(res.status).toBe(400);
  });
});
