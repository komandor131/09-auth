import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

const startsWithRoute = (pathname: string, routes: string[]): boolean =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

const appendSessionCookies = (
  response: NextResponse,
  setCookie: string | string[] | undefined,
): void => {
  if (!setCookie) {
    return;
  }

  const cookiesToSet = Array.isArray(setCookie) ? setCookie : [setCookie];

  cookiesToSet.forEach((cookie) => {
    response.headers.append("Set-Cookie", cookie);
  });
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  let isAuthenticated = Boolean(accessToken);
  let setCookie: string | string[] | undefined;

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();
      isAuthenticated = sessionResponse.data.success;
      setCookie = sessionResponse.headers["set-cookie"];
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && startsWithRoute(pathname, privateRoutes)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthenticated && startsWithRoute(pathname, authRoutes)) {
    const response = NextResponse.redirect(new URL("/", request.url));
    appendSessionCookies(response, setCookie);

    return response;
  }

  const response = NextResponse.next();
  appendSessionCookies(response, setCookie);

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
