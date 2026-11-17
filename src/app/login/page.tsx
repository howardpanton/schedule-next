import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";

export const metadata: Metadata = { title: "Sign in" };

// The card is static and prerendered. Only the form waits for the request,
// because it reads ?next from the URL.
export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Sign in</h1>
        <p className={styles.hint}>Demo account: demo@example.com / password123</p>
        <Suspense fallback={<p className={styles.hint}>Loading…</p>}>
          <FormWithNext searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function FormWithNext({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const { next } = await searchParams;
  return <LoginForm next={typeof next === "string" ? next : ""} />;
}
