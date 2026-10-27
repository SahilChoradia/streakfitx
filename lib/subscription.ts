import SubscriptionPlan from "./models/SubscriptionPlan";
export async function buildSub(name?: string) {
  if (!name) return { status: "none" };
  const p: any = await SubscriptionPlan.findOne({ name });
  const start = new Date(), end = new Date(start);
  end.setMonth(end.getMonth() + (p?.durationMonths || 1));
  return { plan: name, startDate: start, endDate: end, status: "active" };
}
