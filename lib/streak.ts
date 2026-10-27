import Task from "./models/Task";
import User from "./models/User";
export const rankFor = (n: number) => n >= 60 ? "Platinum" : n >= 30 ? "Gold" : n >= 10 ? "Silver" : "Bronze";
export const prevDay = (d: string) => new Date(new Date(d + "T00:00:00Z").getTime() - 864e5).toISOString().slice(0, 10);
/** Streak grows once per day, only when all 4 tasks are completed (water counts after admin approval). */
export async function checkStreak(userId: any, date: string) {
  if ((await Task.countDocuments({ userId, date, status: "completed" })) < 4) return null;
  const u: any = await User.findById(userId);
  if (!u) return null;
  if (u.lastStreakDate !== date) {
    u.streak = u.lastStreakDate === prevDay(date) ? u.streak + 1 : 1;
    u.lastStreakDate = date; u.rank = rankFor(u.streak); await u.save();
  }
  return u.streak as number;
}
