import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { requireAdmin } from "@/lib/auth";
import { buildSub } from "@/lib/subscription";
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  return NextResponse.json({ users: await User.find().select("-password -dietHistory").sort({ createdAt: -1 }) });
}
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { name, email, password, role = "member", subscriptionPlan } = await req.json();
  if (!name || !email || !password || String(password).length < 8)
    return NextResponse.json({ error: "Name, email and a password of 8+ characters are required" }, { status: 400 });
  await connectDB();
  if (await User.exists({ email: String(email).toLowerCase() })) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  const u: any = await User.create({ name, email, role: role === "admin" ? "admin" : "member", password: await bcrypt.hash(password, 12),
    streak: 0, rank: "Bronze", subscription: await buildSub(subscriptionPlan) });
  const { password: _p, dietHistory: _d, ...user } = u.toObject();
  return NextResponse.json({ user }, { status: 201 });
}
