"use client";
import { useApi } from "@/lib/client";
import { Card, rankCls } from "@/components/ui";
export default function Dash() {
  const { data: s } = useApi<any>("/api/admin/stats");
  if (!s) return <p className="text-slate-400">Loading…</p>;
  const mx = Math.max(1, ...Object.values<number>(s.tiers));
  return (<div><h1 className="font-display text-5xl">Overview</h1>
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[["Members", s.members], ["Active plans", s.activeUsers], ["Average streak", s.avgStreak + " days"], ["Top streak", s.topStreak + " days"], ["Water reviews pending", s.pendingWater], ["Events", s.events], ["New messages", s.newMessages]].map(([l, v]) =>
      <Card key={l as string}><div className="text-sm text-slate-400">{l}</div><div className="font-display text-5xl">{v}</div></Card>)}</div>
    <Card className="mt-6"><h2 className="font-display text-3xl">Members by tier</h2>{Object.entries<number>(s.tiers).map(([r, n]) => <div key={r} className="mt-3 flex items-center gap-3">
      <span className={`w-20 ${rankCls[r]}`}>{r}</span><div className="h-3 rounded bg-emerald-400" style={{ width: `${(n / mx) * 60 + 1}%` }} /><span>{n}</span></div>)}</Card></div>);
}
