"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api, useApi } from "@/lib/client";
import { Modal, btn, btn2, btnDel, inp, rankCls } from "@/components/ui";
const blank = { name: "", email: "", password: "", role: "member", subscriptionPlan: "" };
export default function Members() {
  const { data, reload } = useApi<any>("/api/admin/users"), { data: pl } = useApi<any>("/api/admin/subscriptions"), { data: me } = useApi<any>("/api/auth/me");
  const [open, setOpen] = useState(false), [f, setF] = useState<any>(blank), [busy, setBusy] = useState(false);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  async function create(e: React.FormEvent) { e.preventDefault(); setBusy(true);
    try { await api("/api/admin/users", { method: "POST", body: f }); toast.success("User created"); setOpen(false); setF(blank); reload(); } catch (x: any) { toast.error(x.message); } setBusy(false); }
  async function del(u: any) { if (!confirm(`Delete ${u.name}?`)) return; try { await api(`/api/admin/users/${u._id}`, { method: "DELETE" }); toast.success("User deleted"); reload(); } catch (x: any) { toast.error(x.message); } }
  async function plan(u: any, p: string) { try { await api(`/api/admin/users/${u._id}`, { method: "PUT", body: { subscriptionPlan: p } }); toast.success("Plan updated"); reload(); } catch (x: any) { toast.error(x.message); } }
  return (<div><div className="flex items-center gap-3"><h1 className="flex-1 font-display text-5xl">Members</h1><button className={btn} onClick={() => setOpen(true)}>+ Create New User</button></div>
    <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/5"><table className="w-full text-left"><thead className="text-sm text-slate-400"><tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Streak</th><th /></tr></thead>
      <tbody>{data?.users.map((u: any) => <tr key={u._id} className="border-t border-white/10"><td className="p-3">{u.name}</td><td>{u.email}</td><td>{u.role}</td>
        <td><select className="rounded border border-white/10 bg-transparent px-2 py-1" aria-label={`Plan for ${u.name}`} value={u.subscription?.status === "active" ? u.subscription.plan : ""} onChange={e => plan(u, e.target.value)}>
          <option value="">None</option>{pl?.items.map((p: any) => <option key={p._id}>{p.name}</option>)}</select></td>
        <td>{u.streak} <span className={rankCls[u.rank]}>{u.rank}</span></td><td className="p-3 text-right">{me?.user?._id !== u._id && <button className={btnDel} onClick={() => del(u)}>Delete</button>}</td></tr>)}</tbody></table></div>
    <Modal open={open} onClose={() => setOpen(false)} title="Create new user"><form onSubmit={create} className="space-y-3">
      <label className="block text-sm text-slate-400">Name<input className={inp} value={f.name} onChange={set("name")} required /></label>
      <label className="block text-sm text-slate-400">Email<input className={inp} type="email" value={f.email} onChange={set("email")} required /></label>
      <label className="block text-sm text-slate-400">Password (8+ characters)<input className={inp} value={f.password} onChange={set("password")} minLength={8} required /></label>
      <label className="block text-sm text-slate-400">Role<select className={inp} value={f.role} onChange={set("role")}><option>member</option><option>admin</option></select></label>
      <label className="block text-sm text-slate-400">Plan<select className={inp} value={f.subscriptionPlan} onChange={set("subscriptionPlan")}><option value="">None</option>{pl?.items.map((p: any) => <option key={p._id}>{p.name}</option>)}</select></label>
      <div className="flex gap-2 pt-2"><button className={btn} disabled={busy}>Create user</button><button type="button" className={btn2} onClick={() => setOpen(false)}>Cancel</button></div></form></Modal></div>);
}
