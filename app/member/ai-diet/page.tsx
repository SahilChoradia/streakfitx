"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, localDate } from "@/lib/client";
import { Card, btn, btn2, inp } from "@/components/ui";
export default function Diet() {
  const [f, setF] = useState<any>({ age: 28, weight: 70, height: 172, goal: "maintain weight", diet: "vegetarian" }), [plan, setPlan] = useState<any>(null), [busy, setBusy] = useState(false);
  useEffect(() => { api(`/api/ai/diet-plan?date=${localDate()}`).then(r => setPlan(r.plan)).catch(() => {}); }, []);
  async function go(e: React.FormEvent) { e.preventDefault(); setBusy(true);
    try { setPlan((await api("/api/ai/diet-plan", { method: "POST", body: { ...f, localDate: localDate() } })).plan); toast.success("Plan ready"); } catch (x: any) { toast.error(x.message); } setBusy(false); }
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const L = (t: string, c: any) => <label className="block text-sm text-slate-400">{t}{c}</label>;
  return (<div><h1 className="font-display text-5xl">AI diet planner</h1><div className="mt-6 grid items-start gap-5 md:grid-cols-[320px_1fr]">
    <form onSubmit={go} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 print:hidden">
      {L("Age", <input className={inp} type="number" min={14} max={90} value={f.age} onChange={set("age")} required />)}
      {L("Weight (kg)", <input className={inp} type="number" min={30} max={200} value={f.weight} onChange={set("weight")} required />)}
      {L("Height (cm)", <input className={inp} type="number" min={120} max={230} value={f.height} onChange={set("height")} required />)}
      {L("Goal", <select className={inp} value={f.goal} onChange={set("goal")}><option>lose fat</option><option>maintain weight</option><option>build muscle</option></select>)}
      {L("Diet", <select className={inp} value={f.diet} onChange={set("diet")}><option>vegetarian</option><option>vegan</option><option>non-vegetarian</option></select>)}
      <button className={btn + " w-full"} disabled={busy}>{busy ? "Generating…" : plan ? "Generate a new plan" : "Generate plan"}</button>
      <p className="text-xs text-slate-500">A new plan never repeats one from the last 7 days.</p></form>
    {plan ? <Card><div className="flex items-center gap-3"><h2 className="flex-1 font-display text-3xl">{plan.calories} kcal</h2><button onClick={() => window.print()} className={btn2 + " print:hidden"}>Print plan</button></div>
      <p className="text-slate-400">Protein {plan.protein} g · Carbs {plan.carbs} g · Fat {plan.fat} g</p>
      {["breakfast", "lunch", "snack", "dinner"].map(k => <div key={k} className="border-b border-white/10 py-3"><b className="mr-3 inline-block w-24 capitalize">{k}</b>{plan[k]}</div>)}
      <p className="mt-3 text-slate-300">Hydration: {plan.hydration}</p></Card> : <Card className="text-slate-400">Your plan appears here once generated.</Card>}</div></div>);
}
