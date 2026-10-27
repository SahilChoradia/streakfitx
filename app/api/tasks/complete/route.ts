import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/lib/models/Task";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
import { checkStreak } from "@/lib/streak";
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { type, proof, localHour, localDate } = await req.json();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate || "")) return bad("Missing date");
  await connectDB();
  const existing: any = await Task.findOne({ userId: s.userId, date: localDate, type });
  if (existing?.status === "completed") return bad("Already completed today");
  if (existing?.status === "pending" && type === "water") return bad("Your photo is waiting for admin review");
  const patch: any = { status: "completed", completedAt: new Date() };
  if (type === "wakeup") {
    if (typeof localHour !== "number" || localHour < 0 || localHour >= 8) return bad("Wake-up must be logged before 8:00 AM");
  } else if (type === "water") {
    if (typeof proof !== "string" || !proof.startsWith("data:image/")) return bad("Upload a photo of your bottle");
    if (proof.length > 2_000_000) return bad("Photo is too large");
    Object.assign(patch, { status: "pending", proof, verifiedByAdmin: false, completedAt: undefined });
  } else if (type === "exercise") {
    if (!/(youtube\.com|youtu\.be|drive\.google\.com)/.test(proof || "")) return bad("Submit a YouTube or Google Drive link");
    patch.proof = proof;
  } else if (type === "diet") {
    const u: any = await User.findById(s.userId).select("dietHistory");
    if (!u.dietHistory.some((d: any) => d.day === localDate)) return bad("Generate today’s diet plan first");
  } else return bad("Unknown task type");
  await Task.findOneAndUpdate({ userId: s.userId, date: localDate, type }, { $set: patch }, { upsert: true });
  const streak = await checkStreak(s.userId, localDate);
  return NextResponse.json({ success: true, streakUpdated: streak !== null, streak });
}
