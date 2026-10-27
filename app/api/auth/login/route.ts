import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { signToken, seedAdmin } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    await connectDB(); await seedAdmin();
    const u: any = await User.findOne({ email: String(email).toLowerCase() });
    if (!u || !(await bcrypt.compare(password, u.password)))
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    const token = await signToken({ userId: String(u._id), email: u.email, role: u.role });
    const res = NextResponse.json({ success: true, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
    res.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch { return NextResponse.json({ error: "Login failed" }, { status: 500 }); }
}
