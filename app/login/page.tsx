"use client";
import { useState } from "react";
export default function Login() {
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json();
    if (!r.ok) { setErr(d.error); setBusy(false); return; }
    location.href = d.user.role === "admin" ? "/admin/dashboard" : "/member/dashboard";
  }
  const cls = "w-full rounded-lg bg-white/10 px-3 py-2 text-white outline-none focus:ring-2 ring-emerald-400";
  return (
    <main className="min-h-screen grid place-items-center bg-slate-950 p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="text-2xl font-semibold text-white">Sign in to RewardFlex</h1>
        <input required type="email" placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} className={cls} />
        <input required type="password" placeholder="Password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} className={cls} />
        {err && <p className="text-sm text-red-400" role="alert">{err}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-emerald-500 py-2 font-medium text-slate-950 disabled:opacity-60">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
