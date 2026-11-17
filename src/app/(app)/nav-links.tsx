"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./app-layout.module.css";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/schedule", label: "Schedule" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label="Main">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={pathname === href ? styles.active : undefined}
          aria-current={pathname === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
