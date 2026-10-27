"use client";
import toast from "react-hot-toast";
import { api, useApi } from "@/lib/client";
import { Card, Chip, btn } from "@/components/ui";
export default function Rewards() {
  const { data, reload } = useApi<any>("/api/rewards");
  async function claim(id: string) { try { const r = await api(`/api/rewards/${id}/claim`, { method: "POST" }); toast.success("Claimed. Code: " + r.code); reload(); } catch (e: any) { toast.error(e.message); } }
  if (!data) return <p className="text-slate-400">Loading…</p>;
  return (<div><h1 className="font-display text-5xl">Rewards</h1><p className="mt-1 text-slate-400">Your streak: {data.streak} days</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">{data.offers.map((o: any) => <Card key={o._id}><Chip>{o.category}</Chip><h2 className="mt-2 font-display text-3xl">{o.title}</h2>
      <p className="text-slate-400">{o.description}</p><p className="my-2 text-sm text-slate-500">Unlocks at {o.requiredStreak} days</p>
      {o.claimed ? <p>Your code: <b className="text-emerald-300">{o.code}</b></p> : o.unlocked ? <button className={btn} onClick={() => claim(o._id)}>Claim reward</button> : <Chip>{o.requiredStreak - data.streak} days to go</Chip>}</Card>)}</div></div>);
}
