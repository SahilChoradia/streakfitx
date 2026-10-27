"use client";
import { useApi } from "@/lib/client";
import { Card } from "@/components/ui";
export default function Sub() {
  const { data: me } = useApi<any>("/api/auth/me"), { data: pl } = useApi<any>("/api/plans");
  const s = me?.user?.subscription, on = s?.status === "active";
  return (<div><h1 className="font-display text-5xl">Membership</h1>
    <Card className="mt-6"><h2 className="font-display text-3xl">{on ? s.plan : "No active plan"}</h2><p className="text-slate-400">{on ? `Active until ${new Date(s.endDate).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}` : "Ask your gym admin to add a plan."}</p></Card>
    <h2 className="mb-3 mt-8 font-display text-3xl">Available plans</h2><div className="grid gap-4 md:grid-cols-3">{pl?.plans.map((p: any) => <Card key={p._id}><h3 className="font-display text-2xl">{p.name}</h3>
      <p className="text-xl">₹{p.price.toLocaleString("en-IN")} / {p.durationMonths} mo</p><ul className="mt-2 list-disc pl-5 text-slate-400">{p.features.map((f: string) => <li key={f}>{f}</li>)}</ul></Card>)}</div></div>);
}
