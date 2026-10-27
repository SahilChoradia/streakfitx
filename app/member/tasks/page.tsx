"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api, useApi, localDate, compressImage } from "@/lib/client";
import { Card, Chip, btn, btn2, inp } from "@/components/ui";
const META: any = { wakeup: ["Wake up", "Log it before 8:00 AM."], water: ["Drink water", "Photo of your water bottle. An admin reviews it."], exercise: ["Exercise", "Paste a YouTube or Google Drive video link."], diet: ["Eat to plan", "Generate today’s AI diet plan, then confirm it."] };
export default function Tasks() {
  const { data, reload } = useApi<any>(`/api/tasks/today?date=${localDate()}`);
  const [file, setFile] = useState<File | null>(null), [link, setLink] = useState(""), [busy, setBusy] = useState(false);
  async function complete(type: string, extra: any = {}) {
    setBusy(true);
    try { const r = await api("/api/tasks/complete", { method: "POST", body: { type, localHour: new Date().getHours(), localDate: localDate(), ...extra } });
      toast.success(r.streakUpdated ? `All four done. Streak is now ${r.streak} days.` : type === "water" ? "Photo sent for review" : "Saved"); setFile(null); setLink(""); reload();
    } catch (e: any) { toast.error(e.message); } setBusy(false);
  }
  if (!data) return <p className="text-slate-400">Loading…</p>;
  return (<div><h1 className="font-display text-5xl">Today’s tasks</h1><div className="mt-6 grid gap-4 md:grid-cols-2">{data.tasks.map((t: any) => {
    const done = t.status === "completed", review = t.type === "water" && t.status === "pending" && t._id, rejected = t.status === "failed";
    return (<Card key={t.type}><div className="flex items-center gap-2"><h2 className="flex-1 font-display text-3xl">{META[t.type][0]}</h2>
      <Chip tone={done ? "ok" : review ? "wait" : rejected ? "bad" : ""}>{done ? "Done" : review ? "In review" : rejected ? "Rejected" : "To do"}</Chip></div>
      <p className="mb-4 mt-1 text-slate-400">{META[t.type][1]}</p>
      {!done && t.type === "wakeup" && <button className={btn} disabled={busy} onClick={() => complete("wakeup")}>I’m up</button>}
      {!done && !review && t.type === "water" && <div className="space-y-3"><input type="file" accept="image/*" capture="environment" aria-label="Bottle photo" onChange={e => setFile(e.target.files?.[0] || null)} className={inp} />
        <button className={btn} disabled={busy || !file} onClick={async () => { try { complete("water", { proof: await compressImage(file!) }); } catch { toast.error("That image couldn’t be read"); } }}>Submit photo</button></div>}
      {!done && t.type === "exercise" && <div className="space-y-3"><input className={inp} placeholder="https://youtu.be/…" value={link} onChange={e => setLink(e.target.value)} aria-label="Video link" />
        <button className={btn} disabled={busy || !link} onClick={() => complete("exercise", { proof: link })}>Submit link</button></div>}
      {!done && t.type === "diet" && <div className="flex gap-2"><button className={btn} disabled={busy} onClick={() => complete("diet")}>Confirm plan</button><Link href="/member/ai-diet" className={btn2}>Open planner</Link></div>}
    </Card>); })}</div></div>);
}
