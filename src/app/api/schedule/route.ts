import type { NextRequest } from "next/server";
import { findUser } from "@/lib/auth";
import { channels, eventsOn, isDateParam, toDateParam, withStatus } from "@/lib/schedule";
import { readSession, SESSION_COOKIE } from "@/lib/session";

// A JSON endpoint for other clients, such as a mobile app or a script. The pages
// don't call it: Server Components read the data directly on the server.
export async function GET(request: NextRequest) {
  const userId = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!userId || !findUser(userId)) {
    return Response.json({ error: "Sign in to continue." }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date") ?? toDateParam(Date.now());
  if (!isDateParam(date)) {
    return Response.json({ error: "date must look like 2026-11-09." }, { status: 400 });
  }
  const channel = searchParams.get("channel") || undefined;
  return Response.json({ date, channels, events: withStatus(eventsOn(date, channel), Date.now()) });
}
