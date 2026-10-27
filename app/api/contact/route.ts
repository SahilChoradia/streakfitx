import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/lib/models/ContactMessage";
export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json();
  if (!name || !/^\S+@\S+\.\S+$/.test(email || "") || !message) return NextResponse.json({ error: "Name, a valid email and a message are required" }, { status: 400 });
  await connectDB();
  await ContactMessage.create({ name: String(name).slice(0, 100), email, subject: String(subject || "").slice(0, 150), message: String(message).slice(0, 2000) });
  return NextResponse.json({ success: true }, { status: 201 });
}
