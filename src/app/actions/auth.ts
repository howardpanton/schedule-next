"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { checkCredentials } from "@/lib/auth";
import { createSession, deleteSession } from "@/lib/session";

const credentials = z.object({ email: z.email(), password: z.string().min(1) });

export type LoginState = { error: string; email: string } | undefined;

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const parsed = credentials.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and a password.", email };

  const user = checkCredentials(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Email or password is incorrect.", email };

  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}

/** Follow ?next only when it stays on this site. */
function safeNext(next: FormDataEntryValue | null): string {
  if (typeof next !== "string" || !next) return "/dashboard";
  const url = new URL(next, "http://localhost");
  return url.origin === "http://localhost" ? url.pathname + url.search : "/dashboard";
}
