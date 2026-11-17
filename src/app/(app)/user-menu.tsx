import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";
import styles from "./app-layout.module.css";

export async function UserMenu() {
  const user = await getCurrentUser();
  return (
    <form action={logout} className={styles.user}>
      <span>{user.name}</span>
      <button type="submit">Sign out</button>
    </form>
  );
}
