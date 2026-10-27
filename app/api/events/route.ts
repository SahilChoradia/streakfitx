import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { getSession } from "@/lib/auth";
export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const list: any[] = await Event.find({ date: { $gte: new Date(Date.now() - 864e5) } }).sort({ date: 1 });
  return NextResponse.json({ events: list.map(e => ({ _id: e._id, title: e.title, description: e.description, date: e.date, location: e.location, category: e.category,
    capacity: e.capacity, count: e.registeredUsers.length, registered: e.registeredUsers.some((u: any) => String(u) === s.userId) })) });
}
