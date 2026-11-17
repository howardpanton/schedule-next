import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getSchedule } from "@/lib/data";
import { addDays, formatDate, formatTime, todayParam, trackPosition } from "@/lib/time";
import { ChannelFilter } from "./channel-filter";
import { NowLine } from "./now-line";
import styles from "./schedule.module.css";

export const metadata: Metadata = { title: "Schedule" };

const HOURS = [0, 3, 6, 9, 12, 15, 18, 21];

// The URL holds the filters (?date=…&channel=…), so a view can be bookmarked and shared.
export default function SchedulePage({ searchParams }: PageProps<"/schedule">) {
  return (
    <>
      <h1>Schedule</h1>
      <Suspense fallback={<p className={styles.note}>Loading the schedule…</p>}>
        <ScheduleView searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function ScheduleView({ searchParams }: Pick<PageProps<"/schedule">, "searchParams">) {
  const params = await searchParams;
  const channel = typeof params.channel === "string" ? params.channel : "";
  const { date, channels, events } = await getSchedule(
    typeof params.date === "string" ? params.date : undefined,
    channel,
  );
  const rows = channel ? channels.filter((c) => c.id === channel) : channels;
  const dayHref = (days: number) =>
    `/schedule?${new URLSearchParams({ date: addDays(date, days), ...(channel && { channel }) })}`;

  return (
    <>
      <div className={styles.toolbar}>
        <nav className={styles.days} aria-label="Change day">
          <Link href={dayHref(-1)} prefetch={true}>
            ← Previous day
          </Link>
          <span>{formatDate(date)}</span>
          <Link href={dayHref(1)} prefetch={true}>
            Next day →
          </Link>
        </nav>
        <ChannelFilter date={date} channel={channel} channels={channels} />
      </div>
      <p className={styles.note}>All times UTC</p>

      <div className={styles.scroller}>
        <div className={styles.timeline}>
          <div className={styles.hours} aria-hidden="true">
            {HOURS.map((hour) => (
              <span key={hour} style={{ left: `${(hour / 24) * 100}%` }}>
                {String(hour).padStart(2, "0")}:00
              </span>
            ))}
          </div>
          {rows.map((c) => (
            <section key={c.id} className={styles.row} aria-labelledby={`channel-${c.id}`}>
              <h2 id={`channel-${c.id}`} className={styles.channel}>
                {c.name}
              </h2>
              <div className={styles.track}>
                <ol>
                  {events
                    .filter((e) => e.channelId === c.id)
                    .map((e) => {
                      const { left, width } = trackPosition(e.start, e.end, date);
                      const time = `${formatTime(e.start)}–${formatTime(e.end)}`;
                      return (
                        <li
                          key={e.id}
                          title={`${time} ${e.title}`}
                          data-status={e.status}
                          style={{ left: `${left}%`, width: `${width}%` }}
                        >
                          <span className={styles.time}>{time}</span>
                          <span className={styles.title}>{e.title}</span>
                        </li>
                      );
                    })}
                </ol>
                {date === todayParam() && <NowLine date={date} className={styles.now} />}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
