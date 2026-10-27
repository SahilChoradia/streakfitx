import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth";
const hashOf = (p: any) => createHash("sha256").update(["breakfast", "lunch", "snack", "dinner"].map(k => String(p[k]).toLowerCase().trim()).join("|")).digest("hex");
export async function GET(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const date = new URL(req.url).searchParams.get("date");
  await connectDB();
  const u: any = await User.findById(s.userId).select("dietHistory");
  const h = [...u.dietHistory].reverse().find((d: any) => d.day === date);
  return NextResponse.json({ plan: h?.plan ?? null });
}
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { age, weight, height, goal, diet, localDate } = await req.json();
  if (![age, weight, height].every(n => Number(n) > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(localDate || "")) return NextResponse.json({ error: "Enter a valid age, weight and height" }, { status: 400 });
  if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server" }, { status: 503 });
  await connectDB();
  const u: any = await User.findById(s.userId);
  const recent = u.dietHistory.filter((d: any) => Date.now() - new Date(d.date).getTime() < 7 * 864e5);
  const used = recent.map((d: any) => d.planHash);
  const avoid = recent.flatMap((d: any) => [d.plan?.breakfast, d.plan?.lunch, d.plan?.snack, d.plan?.dinner]).filter(Boolean).join("; ");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const preferredModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const prompt = `Create a one-day meal plan for a ${age}-year-old, ${weight} kg, ${height} cm person. Goal: ${goal}. Diet preference: ${diet}.
Return ONLY JSON: {"calories":number,"protein":number,"carbs":number,"fat":number,"breakfast":string,"lunch":string,"snack":string,"dinner":string,"hydration":string}. Macros are grams. Each meal is one short description with portions.${avoid ? ` Do not reuse any of these recent meals: ${avoid}.` : ""}`;
  try {
    let plan: any = null;
    const modelNames = [preferredModel, preferredModel === "gemini-3.5-flash" ? "gemini-3.8-flash" : "gemini-3.5-flash"];
    let lastError: any = null;

    for (const mName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: mName, generationConfig: { responseMimeType: "application/json", temperature: 1 } });
        for (let i = 0; i < 3; i++) {
          const res = await model.generateContent(prompt);
          const rawText = res.response.text();
          const cleanText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
          const p = JSON.parse(cleanText);
          if (!used.includes(hashOf(p))) { plan = p; break; }
        }
        if (plan) break;
      } catch (err) {
        lastError = err;
        console.error(`AI generation failed with model ${mName}:`, err);
      }
    }

    if (!plan) {
      if (lastError) console.error("All AI model attempts failed:", lastError);
      return NextResponse.json({ error: "Couldn’t generate a fresh plan. Try again." }, { status: 502 });
    }

    u.dietHistory.push({ date: new Date(), day: localDate, planHash: hashOf(plan), plan }); await u.save();
    return NextResponse.json({ plan });
  } catch (err) {
    console.error("AI service error:", err);
    return NextResponse.json({ error: "The AI service failed. Check your API key and try again." }, { status: 502 });
  }
}
