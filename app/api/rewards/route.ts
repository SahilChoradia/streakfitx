import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Offer from "@/lib/models/Offer";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const [u, offers]: any = await Promise.all([User.findById(s.userId), Offer.find({ $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }] }).sort({ requiredStreak: 1 })]);
  return NextResponse.json({ streak: u.streak, offers: offers.map((o: any) => {
    const claimed = u.rewards.some((r: any) => r.name === o.title);
    return { _id: o._id, title: o.title, description: o.description, category: o.category, requiredStreak: o.requiredStreak, expiryDate: o.expiryDate,
      unlocked: u.streak >= o.requiredStreak, claimed, code: claimed ? o.code : undefined }; }) });
}
