import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/lib/models/Task";
import "@/lib/models/User";
import { requireAdmin } from "@/lib/auth";
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await connectDB();
  return NextResponse.json({ tasks: await Task.find({ type: "water", status: "pending" }).populate("userId", "name email").sort({ updatedAt: 1 }) });
}
