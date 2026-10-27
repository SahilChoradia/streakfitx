"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { btn2 } from "./ui";
export default function Shell({ items, label, children }: { items: [string, string][]; label: string; children: ReactNode }) {
  const path = usePathname(), router = useRouter();
  async function out() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); router.refresh(); }
  return (<div className="min-h-screen">
    <header className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-3 print:hidden">
      <Link href="/" className="font-display text-2xl text-emerald-400">RewardFlex</Link>
      <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-400">{label}</span>
      <nav className="flex flex-1 gap-1 overflow-x-auto" aria-label="Main">
        {items.map(([href, name]) => <Link key={href} href={href} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm ${path.startsWith(href) ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>{name}</Link>)}
      </nav>
      <button onClick={out} className={btn2}>Log out</button>
    </header>
    <main className="mx-auto max-w-5xl px-5 py-8">{children}</main></div>);
}
