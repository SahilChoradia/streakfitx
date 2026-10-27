import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Task from "@/lib/models/Task";
import Event from "@/lib/models/Event";
import ContactMessage from "@/lib/models/ContactMessage";
import { requireAdmin } from "@/lib/auth";
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const [members, pendingWater, events, newMessages] = await Promise.all([
    User.find({ role: "member" }).select("streak rank subscription"), Task.countDocuments({ type: "water", status: "pending" }),
    Event.countDocuments(), ContactMessage.countDocuments({ status: "new" })]);
  const tiers: any = { Platinum: 0, Gold: 0, Silver: 0, Bronze: 0 };
  members.forEach((m: any) => tiers[m.rank]++);
  return NextResponse.json({ members: members.length, activeUsers: members.filter((m: any) => m.subscription?.status === "active").length,
    avgStreak: members.length ? Math.round(members.reduce((a: number, m: any) => a + m.streak, 0) / members.length) : 0,
    topStreak: Math.max(0, ...members.map((m: any) => m.streak)), pendingWater, events, newMessages, tiers });
}
