import "server-only";
import { scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, SESSION_COOKIE } from "./session";

export interface User {
  id: string;
  email: string;
  name: string;
}

// ponytail: one demo user with a stored scrypt hash; a real app reads users from a database.
const users = [
  {
    id: "u1",
    email: "demo@example.com",
    name: "Demo Operator",
    passwordHash:
      "31c7050f5332dffcec4948bcf0fa04f7:6842f34f321154a12e87481bbe65a09be1702fca99b9ff6125c5bf05fa18186d8d6025263e6b4d93ef993e93445267d1d9fbfdc35f115c3ec41d61a2d6853466",
  },
];
// Checked when the email is unknown, so a wrong email takes as long as a wrong password.
const DUMMY_HASH =
  "16a4ecf818c468eb49f547cf5b63519c:419253fd75258fe802ba692f011296d98b88f5dbc38b5ea2a5dd43b37da5cc24105f2d8fed0e9be8640bd736961ba10f8ee2d45ead636633f892a0b7dc94619b";

function verifyPassword(password: string, stored: string): boolean {
  const [salt = "", hash = ""] = stored.split(":");
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, Buffer.from(salt, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

const toUser = ({ id, email, name }: User): User => ({ id, email, name });

export function checkCredentials(email: string, password: string): User | null {
  const user = users.find((u) => u.email === email.toLowerCase());
  const ok = verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  return user && ok ? toUser(user) : null;
}

export function findUser(id: string): User | null {
  const user = users.find((u) => u.id === id);
  return user ? toUser(user) : null;
}

/**
 * The signed-in user, or a redirect to the login page. Every data function calls
 * this, so the check sits next to the data rather than in a layout.
 */
export async function getCurrentUser(): Promise<User> {
  "use cache: private";
  const userId = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  const user = userId ? findUser(userId) : null;
  if (!user) redirect("/login");
  return user;
}
