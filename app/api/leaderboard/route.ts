import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
export const dynamic = "force-dynamic";
export async function GET() {
  await connectDB();
  return NextResponse.json({ leaderboard: await User.find({ role: "member" }).select("name streak rank").sort({ streak: -1 }).limit(50) });
}
