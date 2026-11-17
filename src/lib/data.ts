import "server-only";
import { connection } from "next/server";
import { getCurrentUser } from "./auth";
import { channels, dashboard, eventsOn, isDateParam, toDateParam, withStatus } from "./schedule";

// The Data Access Layer: pages get data only through these functions,
// and each one checks the session first.

export async function getDashboard() {
  await getCurrentUser();
  // Live figures depend on the current time, so they must render at request time.
  await connection();
  return dashboard(Date.now());
}

export async function getSchedule(date: string | undefined, channel: string | undefined) {
  await getCurrentUser();
  await connection();
  const day = date && isDateParam(date) ? date : toDateParam(Date.now());
  return {
    date: day,
    channels,
    events: withStatus(eventsOn(day, channel || undefined), Date.now()),
  };
}
