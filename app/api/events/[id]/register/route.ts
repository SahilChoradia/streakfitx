import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { getSession } from "@/lib/auth";
export async function POST(_: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const e: any = await Event.findById(params.id);
  if (!e) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  const on = e.registeredUsers.some((u: any) => String(u) === s.userId);
  if (on) e.registeredUsers = e.registeredUsers.filter((u: any) => String(u) !== s.userId);
  else if (e.registeredUsers.length >= e.capacity) return NextResponse.json({ error: "This event is full" }, { status: 400 });
  else e.registeredUsers.push(s.userId);
  await e.save();
  return NextResponse.json({ registered: !on, count: e.registeredUsers.length });
}
