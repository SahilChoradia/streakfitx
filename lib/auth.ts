import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import User from "./models/User";
import SubscriptionPlan from "./models/SubscriptionPlan";
import Offer from "./models/Offer";
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);
export type Session = { userId: string; email: string; role: "member" | "admin" };
export const signToken = (p: Session) => new SignJWT({ ...p }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret());
export async function verifyToken(t?: string): Promise<Session | null> {
  if (!t) return null;
  try { return (await jwtVerify(t, secret())).payload as unknown as Session; } catch { return null; }
}
export const getSession = () => verifyToken(cookies().get("token")?.value);
export async function requireAdmin() { const s = await getSession(); return s?.role === "admin" ? s : null; }
/** Seeds the default admin, plans and offers when missing. Runs on login. */
export async function seedAdmin() {
  await connectDB();
  if (!(await User.exists({ role: "admin" })))
    await User.create({ name: "Admin", email: "admin@streakfitx.com", role: "admin", password: await bcrypt.hash("Admin@Password123!", 12) });
  if (!(await SubscriptionPlan.countDocuments()))
    await SubscriptionPlan.insertMany([
      { name: "Silver Monthly", price: 999, durationMonths: 1, badge: "Silver", features: ["Daily task tracking", "Streak rewards", "Community leaderboard"] },
      { name: "Gold Quarterly", price: 2499, durationMonths: 3, badge: "Gold", features: ["Everything in Silver", "AI diet planner", "Event priority RSVP"] },
      { name: "Platinum Elite", price: 8999, durationMonths: 12, badge: "Platinum", features: ["Everything in Gold", "Quarterly coach review", "Exclusive merchandise"] }]);
  if (!(await Offer.countDocuments()))
    await Offer.insertMany([
      { title: "Protein shaker", description: "Branded shaker bottle", requiredStreak: 7, category: "merchandise", code: "FLEXSHAKE" },
      { title: "10% off supplements", description: "At the gym store", requiredStreak: 14, category: "supplement", code: "SUPP10" },
      { title: "Free personal-training session", description: "One 45-minute session", requiredStreak: 30, category: "service", code: "PT30" },
      { title: "25% off annual renewal", description: "On any annual plan", requiredStreak: 60, category: "discount", code: "RENEW25" }]);
}
