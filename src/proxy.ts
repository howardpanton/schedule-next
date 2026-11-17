import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/session";

const protectedPaths = ["/dashboard", "/schedule"];

// An optimistic check from the cookie alone: it saves a round trip for signed-out
// visitors. The real check happens in the Data Access Layer.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = (await readSession(request.cookies.get(SESSION_COOKIE)?.value)) !== null;

  if (!signedIn && protectedPaths.some((path) => pathname.startsWith(path))) {
    const login = new URL("/login", request.nextUrl);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  if (signedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
