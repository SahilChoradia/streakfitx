import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/lib/models/Task";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
import { prevDay } from "@/lib/streak";
export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const q = new URL(req.url).searchParams.get("date");
  const date = q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : new Date().toISOString().slice(0, 10);
  await connectDB();
  const u: any = await User.findById(s.userId);
  if (u.streak > 0 && u.lastStreakDate && u.lastStreakDate < prevDay(date)) { u.streak = 0; u.rank = "Bronze"; await u.save(); } // missed a day
  const tasks = await Task.find({ userId: s.userId, date }).select("-proof");
  return NextResponse.json({ date, streak: u.streak, rank: u.rank,
    tasks: ["wakeup", "water", "exercise", "diet"].map(t => tasks.find((x: any) => x.type === t) ?? { type: t, status: "pending" }) });
}
