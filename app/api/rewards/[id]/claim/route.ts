import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Offer from "@/lib/models/Offer";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
export async function POST(_: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const [u, o]: any = await Promise.all([User.findById(s.userId), Offer.findById(params.id)]);
  if (!o) return NextResponse.json({ error: "Reward not found" }, { status: 404 });
  if (u.streak < o.requiredStreak) return NextResponse.json({ error: `Reach a ${o.requiredStreak}-day streak to unlock this` }, { status: 400 });
  if (u.rewards.some((r: any) => r.name === o.title)) return NextResponse.json({ error: "Already claimed" }, { status: 400 });
  u.rewards.push({ name: o.title, points: o.requiredStreak, unlockedOn: new Date(), claimed: true }); await u.save();
  return NextResponse.json({ success: true, code: o.code });
}
