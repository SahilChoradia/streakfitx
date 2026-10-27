import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  return NextResponse.json({ user: await User.findById(s.userId).select("-password -dietHistory") });
}
