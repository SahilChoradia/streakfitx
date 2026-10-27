import Link from "next/link";
import { connectDB } from "@/lib/db";
import SubscriptionPlan from "@/lib/models/SubscriptionPlan";
import PublicHeader from "@/components/PublicHeader";
import { Ring, Card } from "@/components/ui";
export const dynamic = "force-dynamic";
const FALLBACK = [{ name: "Silver Monthly", price: 999, durationMonths: 1, features: ["Daily task tracking", "Streak rewards"] }, { name: "Gold Quarterly", price: 2499, durationMonths: 3, features: ["AI diet planner", "Event priority RSVP"] }, { name: "Platinum Elite", price: 8999, durationMonths: 12, features: ["Coach review", "Exclusive merchandise"] }];
const HABITS = [["Wake up", "Be up before 8:00 AM."], ["Drink water", "Photo proof, checked by your gym."], ["Exercise", "Share a workout video link."], ["Eat to plan", "Follow your AI diet plan."]];
export default async function Home() {
  let plans: any[] = FALLBACK;
  try { await connectDB(); const p = await SubscriptionPlan.find().sort({ price: 1 }).lean(); if (p.length) plans = p; } catch {}
  return (<div><PublicHeader />
    <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr]">
      <div><h1 className="font-display text-6xl leading-none md:text-8xl">Show up four times a day. Keep the streak.</h1>
        <p className="mt-5 max-w-md text-lg text-slate-400">Wake early, drink water, move, eat to plan. Finish all four and your streak grows, your rank climbs, and your gym pays you back.</p>
        <div className="mt-7 flex gap-3"><Link href="/login" className="rounded-lg bg-emerald-500 px-5 py-2.5 font-medium text-slate-950">Member login</Link><Link href="/about" className="rounded-lg border border-white/15 px-5 py-2.5">How it works</Link></div></div>
      <div className="grid place-items-center"><Ring done={4} streak={42} size={240} /></div></section>
    <section className="mx-auto max-w-5xl px-5 pb-16"><h2 className="font-display text-4xl">Four habits. One streak.</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{HABITS.map(([t, d]) => <Card key={t}><h3 className="font-display text-2xl">{t}</h3><p className="mt-1 text-slate-400">{d}</p></Card>)}</div></section>
    <section className="mx-auto max-w-5xl px-5 pb-16"><h2 className="font-display text-4xl">Plans</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">{plans.map((p: any) => <Card key={p.name}><h3 className="font-display text-2xl">{p.name}</h3>
        <p className="my-2 text-3xl font-semibold">₹{p.price.toLocaleString("en-IN")}<span className="text-base font-normal text-slate-400"> / {p.durationMonths} mo</span></p>
        <ul className="list-disc space-y-1 pl-5 text-slate-400">{(p.features || []).map((f: string) => <li key={f}>{f}</li>)}</ul></Card>)}</div>
      <p className="mt-3 text-sm text-slate-500">Accounts are created by your gym admin after you join.</p></section>
    <section className="mx-auto max-w-5xl px-5 pb-20"><h2 className="font-display text-4xl">What members say</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2"><Card>“I haven’t skipped a morning in six weeks. I just don’t want to lose the number.”<p className="mt-2 text-sm text-slate-400">Aarav, Gold member</p></Card>
        <Card>“The free training session at 30 days was exactly the push I needed.”<p className="mt-2 text-sm text-slate-400">Meera, Silver member</p></Card></div></section>
    <footer className="border-t border-white/10 py-8 text-center text-slate-400"><Link href="/login" className="text-emerald-400">Ready to start your streak? Log in →</Link></footer></div>);
}
