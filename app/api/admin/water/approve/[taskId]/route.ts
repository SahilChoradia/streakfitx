import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/lib/models/Task";
import { requireAdmin } from "@/lib/auth";
import { checkStreak } from "@/lib/streak";
export async function POST(_: Request, { params }: { params: { taskId: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const t: any = await Task.findOneAndUpdate({ _id: params.taskId, type: "water", status: "pending" }, { status: "completed", verifiedByAdmin: true, completedAt: new Date() }, { new: true });
  if (!t) return NextResponse.json({ error: "Task not found or already reviewed" }, { status: 404 });
  const streak = await checkStreak(t.userId, t.date);
  return NextResponse.json({ success: true, streak });
}
