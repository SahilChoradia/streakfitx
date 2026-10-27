import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/lib/models/Task";
import { requireAdmin } from "@/lib/auth";
export async function POST(_: Request, { params }: { params: { taskId: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  const t = await Task.findOneAndUpdate({ _id: params.taskId, type: "water", status: "pending" }, { status: "failed", proof: "", verifiedByAdmin: false });
  return t ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Task not found or already reviewed" }, { status: 404 });
}
