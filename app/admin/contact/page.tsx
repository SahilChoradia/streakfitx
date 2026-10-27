"use client";
import toast from "react-hot-toast";
import { api, useApi } from "@/lib/client";
import { Card, Chip, btn2 } from "@/components/ui";
export default function Contact() {
  const { data, reload } = useApi<any>("/api/admin/contact");
  async function mark(id: string, status: string) { try { await api("/api/admin/contact", { method: "PUT", body: { _id: id, status } }); reload(); } catch (e: any) { toast.error(e.message); } }
  return (<div><h1 className="font-display text-5xl">Messages</h1><div className="mt-6 space-y-3">{data?.items.map((m: any) => <Card key={m._id}>
    <div className="flex flex-wrap items-center gap-2"><b>{m.name}</b><a className="text-emerald-300" href={`mailto:${m.email}`}>{m.email}</a><Chip tone={m.status === "new" ? "wait" : m.status === "replied" ? "ok" : ""}>{m.status}</Chip></div>
    {m.subject && <p className="mt-1 font-medium">{m.subject}</p>}<p className="mt-1 whitespace-pre-wrap text-slate-300">{m.message}</p>
    <div className="mt-3 flex gap-2"><button className={btn2 + " !py-1 text-sm"} onClick={() => mark(m._id, "read")}>Mark read</button><button className={btn2 + " !py-1 text-sm"} onClick={() => mark(m._id, "replied")}>Mark replied</button></div></Card>)}
    {data && !data.items.length && <Card className="text-slate-400">No messages yet.</Card>}</div></div>);
}
