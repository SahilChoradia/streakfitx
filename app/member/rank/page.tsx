"use client";
import { useApi } from "@/lib/client";
import { Card, rankCls } from "@/components/ui";
export default function Rank() {
  const { data } = useApi<any>("/api/leaderboard"), { data: me } = useApi<any>("/api/auth/me");
  if (!data) return <p className="text-slate-400">Loading…</p>;
  return (<div><h1 className="font-display text-5xl">Leaderboard</h1><Card className="mt-6 overflow-x-auto"><table className="w-full text-left"><thead className="text-sm text-slate-400"><tr><th className="p-2">#</th><th>Member</th><th>Tier</th><th>Streak</th></tr></thead>
    <tbody>{data.leaderboard.map((u: any, i: number) => <tr key={u._id} className={`border-t border-white/10 ${me?.user?._id === u._id ? "bg-emerald-500/10" : ""}`}><td className="p-2">{i + 1}</td><td>{u.name}{me?.user?._id === u._id && " (you)"}</td><td className={rankCls[u.rank]}>{u.rank}</td><td>{u.streak} days</td></tr>)}</tbody></table></Card></div>);
}
