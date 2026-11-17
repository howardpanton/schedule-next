"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Asks the server for a fresh render every minute, keeping client state. */
export function AutoRefresh({ everyMs = 60_000 }: { everyMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), everyMs);
    return () => clearInterval(id);
  }, [router, everyMs]);

  return null;
}
