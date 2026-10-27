import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SubscriptionPlan from "@/lib/models/SubscriptionPlan";
export const dynamic = "force-dynamic";
export async function GET() { await connectDB(); return NextResponse.json({ plans: await SubscriptionPlan.find().sort({ price: 1 }) }); }
