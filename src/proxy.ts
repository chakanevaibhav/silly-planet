import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PROTECTED = [/^\/checkout/, /^\/orders/, /^\/account/];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requiresAuth = PROTECTED.some((re) => re.test(pathname));
  if (!requiresAuth) return NextResponse.next();
  const session = await auth();
  if (!session?.user) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/account/:path*"],
};
