"use client";
import { ReactNode } from "react";
export const inp = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400";
export const btn = "rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50";
export const btn2 = "rounded-lg border border-white/15 px-4 py-2 hover:bg-white/10 disabled:opacity-50";
export const btnDel = "rounded-lg border border-red-400/60 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10";
export const rankCls: any = { Platinum: "text-cyan-300", Gold: "text-amber-300", Silver: "text-slate-300", Bronze: "text-orange-400" };
export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) =>
  <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 ${className}`}>{children}</div>;
export const Chip = ({ tone = "", children }: { tone?: "ok" | "wait" | "bad" | ""; children: ReactNode }) => {
  const c = tone === "ok" ? "border-emerald-400 text-emerald-300" : tone === "wait" ? "border-amber-400 text-amber-300" : tone === "bad" ? "border-red-400 text-red-300" : "border-white/15 text-slate-400";
  return <span className={`rounded-full border px-2.5 py-0.5 text-xs ${c}`}>{children}</span>;
};
export function Ring({ done, streak, size = 200 }: { done: number; streak: number; size?: number }) {
  const c = 327;
  return (<div className="relative grid place-items-center" style={{ width: size, height: size }}>
    <svg viewBox="0 0 120 120" width={size} height={size} className="-rotate-90" role="img" aria-label={`${done} of 4 tasks done`}>
      <circle cx="60" cy="60" r="52" fill="none" stroke="#26352f" strokeWidth="11" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="#34d399" strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * done) / 4} style={{ transition: "stroke-dashoffset .5s" }} />
    </svg>
    <div className="absolute text-center"><div className="font-display text-6xl leading-none">{streak}</div><div className="text-sm text-slate-400">day streak</div></div>
  </div>);
}
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (<div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4" onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-6">
      <h2 className="mb-4 font-display text-3xl">{title}</h2>{children}</div></div>);
}
