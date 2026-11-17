"use client";

import { percentOfDay } from "@/lib/time";
import { useNow } from "@/lib/use-now";

export function NowLine({ date, className }: { date: string; className: string }) {
  const now = useNow();
  if (now === null) return null;
  return (
    <div className={className} style={{ left: `${percentOfDay(now, date)}%` }} aria-hidden="true" />
  );
}
