"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import styles from "./login.module.css";

export function LoginForm({ next }: { next: string }) {
  // The Server Action's return value becomes `state`; `pending` is true while it runs.
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="next" value={next} />
      {state?.error && (
        <p role="alert" className={styles.error}>
          {state.error}
        </p>
      )}
      <label>
        Email
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state?.email}
        />
      </label>
      <label>
        Password
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
