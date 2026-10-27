import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
async function role(t?: string) {
  if (!t) return null;
  try { return (await jwtVerify(t, new TextEncoder().encode(process.env.JWT_SECRET!))).payload.role as string; } catch { return null; }
}
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const r = await role(req.cookies.get("token")?.value);
  const go = (p: string) => NextResponse.redirect(new URL(p, req.url));
  if (pathname.startsWith("/admin") && r !== "admin") return go("/login");
  if (pathname.startsWith("/member") && !r) return go("/login");
  if (pathname === "/login" && r) return go(r === "admin" ? "/admin/dashboard" : "/member/dashboard");
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/member/:path*", "/login"] };
