import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Task from "@/lib/models/Task";
import { requireAdmin } from "@/lib/auth";
import { buildSub } from "@/lib/subscription";
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json(); await connectDB();
  const patch: any = {};
  if (b.name) patch.name = b.name;
  if (b.role) patch.role = b.role === "admin" ? "admin" : "member";
  if (b.password) { if (String(b.password).length < 8) return NextResponse.json({ error: "Password must be 8+ characters" }, { status: 400 }); patch.password = await bcrypt.hash(b.password, 12); }
  if (b.subscriptionPlan !== undefined) patch.subscription = await buildSub(b.subscriptionPlan);
  const u = await User.findByIdAndUpdate(params.id, patch, { new: true }).select("-password -dietHistory");
  return u ? NextResponse.json({ user: u }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const s = await requireAdmin();
  if (!s) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (s.userId === params.id) return NextResponse.json({ error: "You can’t delete your own account" }, { status: 400 });
  await connectDB(); await User.findByIdAndDelete(params.id); await Task.deleteMany({ userId: params.id });
  return NextResponse.json({ success: true });
}
