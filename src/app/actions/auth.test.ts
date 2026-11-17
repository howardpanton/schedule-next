// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readSession } from "@/lib/session";
import { login } from "./auth";

// A stand-in for the request's cookie jar, and a redirect that throws like the real one.
const jar = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name) } : undefined),
    set: (name: string, value: string) => jar.set(name, value),
    delete: (name: string) => jar.delete(name),
  }),
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT ${url}`);
  },
}));

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

describe("login action", () => {
  beforeEach(() => jar.clear());

  it("returns an error for a wrong password and sets no cookie", async () => {
    const state = await login(undefined, form({ email: "demo@example.com", password: "nope" }));
    expect(state).toEqual({ error: "Email or password is incorrect.", email: "demo@example.com" });
    expect(jar.size).toBe(0);
  });

  it("signs in, sets a session cookie and redirects to ?next", async () => {
    await expect(
      login(
        undefined,
        form({
          email: "demo@example.com",
          password: "password123",
          next: "/schedule?date=2026-11-09",
        }),
      ),
    ).rejects.toThrow("REDIRECT /schedule?date=2026-11-09");
    expect(await readSession(jar.get("session"))).toBe("u1");
  });

  it("ignores a ?next that points at another site", async () => {
    await expect(
      login(
        undefined,
        form({ email: "demo@example.com", password: "password123", next: "//evil.example" }),
      ),
    ).rejects.toThrow("REDIRECT /dashboard");
  });
});
