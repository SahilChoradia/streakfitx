"use client";
import Link from "next/link";
import { api, useApi, localDate } from "@/lib/client";
import { Card, Chip, Ring, rankCls } from "@/components/ui";
const NAMES: any = { wakeup: "Wake up", water: "Drink water", exercise: "Exercise", diet: "Eat to plan" };
export default function Dashboard() {
  const { data: t } = useApi<any>(`/api/tasks/today?date=${localDate()}`), { data: me } = useApi<any>("/api/auth/me"), { data: rw } = useApi<any>("/api/rewards");
  if (!t) return <p className="text-slate-400">Loading…</p>;
  const done = t.tasks.filter((x: any) => x.status === "completed").length, next = rw?.offers?.find((o: any) => !o.unlocked);
  return (<div className="space-y-6"><div className="flex flex-wrap items-center gap-8"><Ring done={done} streak={t.streak} />
    <div><h1 className="font-display text-5xl">{me?.user ? me.user.name.split(" ")[0] + ", " : ""}{done === 4 ? "you’re done for today" : `${4 - done} to go today`}</h1>
      <p className="mt-2 flex gap-2"><span className={`font-semibold ${rankCls[t.rank]}`}>{t.rank}</span><Chip>{done}/4 tasks</Chip></p>
      {next && <p className="mt-3 text-slate-400">Next reward: {next.title} in {next.requiredStreak - t.streak} days</p>}</div></div>
    <div className="grid gap-3 sm:grid-cols-2">{t.tasks.map((x: any) => <Link key={x.type} href="/member/tasks"><Card className="flex items-center justify-between hover:bg-white/10"><span>{NAMES[x.type]}</span>
      <Chip tone={x.status === "completed" ? "ok" : x.status === "pending" && x.proof !== undefined && x.type === "water" ? "wait" : ""}>{x.status === "completed" ? "Done" : x.type === "water" && x.status === "pending" && x._id ? "In review" : "To do"}</Chip></Card></Link>)}</div></div>);
}
