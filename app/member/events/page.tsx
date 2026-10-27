"use client";
import toast from "react-hot-toast";
import { api, useApi } from "@/lib/client";
import { Card, Chip, btn, btn2 } from "@/components/ui";
export default function Events() {
  const { data, reload } = useApi<any>("/api/events");
  async function rsvp(id: string) { try { const r = await api(`/api/events/${id}/register`, { method: "POST" }); toast.success(r.registered ? "You’re registered" : "RSVP cancelled"); reload(); } catch (e: any) { toast.error(e.message); } }
  if (!data) return <p className="text-slate-400">Loading…</p>;
  return (<div><h1 className="font-display text-5xl">Events</h1><div className="mt-6 grid gap-4 sm:grid-cols-2">{data.events.map((e: any) => <Card key={e._id}><Chip>{e.category}</Chip>
    <h2 className="mt-2 font-display text-3xl">{e.title}</h2><p className="text-slate-400">{new Date(e.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} · {e.location}</p>
    <p className="my-2 text-sm text-slate-500">{e.description} {e.count}/{e.capacity} registered</p>
    <button className={e.registered ? btn2 : btn} disabled={!e.registered && e.count >= e.capacity} onClick={() => rsvp(e._id)}>{e.registered ? "Cancel RSVP" : e.count >= e.capacity ? "Full" : "RSVP"}</button></Card>)}
    {!data.events.length && <p className="text-slate-400">No upcoming events yet.</p>}</div></div>);
}
