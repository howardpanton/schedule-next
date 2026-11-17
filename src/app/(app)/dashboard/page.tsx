import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getDashboard } from "@/lib/data";
import type { Channel, EventWithStatus } from "@/lib/schedule";
import { formatDate, formatTime } from "@/lib/time";
import { AutoRefresh } from "./auto-refresh";
import styles from "./dashboard.module.css";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>
      <Suspense fallback={<p className={styles.date}>Loading today’s figures…</p>}>
        <DashboardData />
      </Suspense>
    </>
  );
}

async function DashboardData() {
  const { date, counts, channels, liveNow, upNext } = await getDashboard();
  const stats = [
    ["Live now", counts.live],
    ["Still to air today", counts.upcoming],
    ["Finished today", counts.finished],
    ["Channels", channels.length],
  ] as const;

  return (
    <>
      <AutoRefresh />
      <p className={styles.date}>{formatDate(date)} · all times UTC</p>
      <dl className={styles.stats}>
        {stats.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.columns}>
        <section>
          <h2>On air</h2>
          <EventList events={liveNow} channels={channels} empty="Nothing is live right now." />
        </section>
        <section>
          <h2>Up next</h2>
          <EventList events={upNext} channels={channels} empty="Nothing else is scheduled." />
          <Link href="/schedule">See the full schedule</Link>
        </section>
      </div>
    </>
  );
}

interface EventListProps {
  events: EventWithStatus[];
  channels: Channel[];
  empty: string;
}

function EventList({ events, channels, empty }: EventListProps) {
  if (events.length === 0) return <p className={styles.empty}>{empty}</p>;
  const channelName = (id: string) => channels.find((c) => c.id === id)?.name ?? id;

  return (
    <ul className={styles.list}>
      {events.map((event) => (
        <li key={event.id} data-status={event.status}>
          <span className={styles.time}>
            {formatTime(event.start)}–{formatTime(event.end)}
          </span>
          <span>{event.title}</span>
          <span className={styles.channel}>{channelName(event.channelId)}</span>
        </li>
      ))}
    </ul>
  );
}
