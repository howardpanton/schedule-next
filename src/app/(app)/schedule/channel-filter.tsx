"use client";

import Form from "next/form";
import type { Channel } from "@/lib/schedule";
import styles from "./schedule.module.css";

interface ChannelFilterProps {
  date: string;
  channel: string;
  channels: Channel[];
}

// next/form turns a GET form into a client-side navigation to /schedule?date=…&channel=…
export function ChannelFilter({ date, channel, channels }: ChannelFilterProps) {
  return (
    <Form action="/schedule" className={styles.filter}>
      <input type="hidden" name="date" value={date} />
      <label htmlFor="channel">Channel</label>
      <select
        id="channel"
        name="channel"
        defaultValue={channel}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        <option value="">All channels</option>
        {channels.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </Form>
  );
}
