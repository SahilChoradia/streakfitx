"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/client";
import { btn, inp } from "./ui";
export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", subject: "", message: "" }), [busy, setBusy] = useState(false);
  async function send(e: React.FormEvent) { e.preventDefault(); setBusy(true);
    try { await api("/api/contact", { method: "POST", body: f }); toast.success("Message sent"); setF({ name: "", email: "", subject: "", message: "" }); } catch (x: any) { toast.error(x.message); } setBusy(false); }
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  return (<form onSubmit={send} className="space-y-3">
    <input className={inp} placeholder="Your name" value={f.name} onChange={set("name")} required aria-label="Your name" />
    <input className={inp} type="email" placeholder="Email" value={f.email} onChange={set("email")} required aria-label="Email" />
    <input className={inp} placeholder="Subject" value={f.subject} onChange={set("subject")} aria-label="Subject" />
    <textarea className={inp} rows={4} placeholder="Message" value={f.message} onChange={set("message")} required aria-label="Message" />
    <button className={btn} disabled={busy}>{busy ? "Sending…" : "Send message"}</button></form>);
}
