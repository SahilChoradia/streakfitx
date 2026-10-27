"use client";
import toast from "react-hot-toast";
import { api, useApi } from "@/lib/client";
import { Card, btn, btnDel } from "@/components/ui";
export default function Water() {
  const { data, reload } = useApi<any>("/api/admin/water/pending");
  async function act(id: string, what: "approve" | "reject") { try { await api(`/api/admin/water/${what}/${id}`, { method: "POST" }); toast.success(what === "approve" ? "Approved" : "Rejected"); reload(); } catch (e: any) { toast.error(e.message); } }
  return (<div><h1 className="font-display text-5xl">Water review queue</h1><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data?.tasks.map((t: any) => <Card key={t._id}>
    {/* eslint-disable-next-line @next/next/no-img-element */}<img src={t.proof} alt={`Water bottle photo from ${t.userId?.name}`} className="max-h-64 w-full rounded-lg object-cover" />
    <p className="mt-2 text-slate-300">{t.userId?.name}</p><p className="text-sm text-slate-500">{t.date}</p>
    <div className="mt-3 flex gap-2"><button className={btn} onClick={() => act(t._id, "approve")}>Approve</button><button className={btnDel} onClick={() => act(t._id, "reject")}>Reject</button></div></Card>)}
    {data && !data.tasks.length && <Card className="text-slate-400">Nothing waiting. New photos appear here.</Card>}</div></div>);
}
