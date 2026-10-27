import PublicHeader from "@/components/PublicHeader";
import ContactForm from "@/components/ContactForm";
import { Card } from "@/components/ui";
export const metadata = { title: "About – RewardFlex" };
export default function About() {
  return (<div><PublicHeader /><div className="mx-auto max-w-5xl px-5 py-10">
    <h1 className="font-display text-6xl">About RewardFlex</h1>
    <p className="mt-4 max-w-2xl text-lg text-slate-400">RewardFlex turns daily habits into a visible streak. Admins create member accounts, members complete four daily tasks, and streak milestones unlock perks. Water photos are reviewed by an admin so the streak stays honest.</p>
    <div className="mt-10 grid gap-6 md:grid-cols-2"><Card><h2 className="font-display text-3xl">Ranks</h2><ul className="mt-3 space-y-1 text-slate-300"><li>Bronze: 0–9 days</li><li>Silver: 10–29 days</li><li>Gold: 30–59 days</li><li>Platinum: 60+ days</li></ul></Card>
      <Card><h2 className="mb-3 font-display text-3xl">Contact us</h2><ContactForm /></Card></div></div></div>);
}
