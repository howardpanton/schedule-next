import { Suspense } from "react";
import { NavLinks } from "./nav-links";
import { UserMenu } from "./user-menu";
import styles from "./app-layout.module.css";

// The header is static, so it is part of the prerendered shell. Only the user's
// name waits for the session, behind its own Suspense boundary.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <strong className={styles.brand}>Schedule</strong>
        <NavLinks />
        <Suspense fallback={<span className={styles.user} />}>
          <UserMenu />
        </Suspense>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
