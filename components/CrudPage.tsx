"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { api, useApi } from "@/lib/client";
import { Modal, btn, btn2, btnDel, inp } from "./ui";
export type Field = { key: string; label: string; type?: "text" | "number" | "date" | "textarea" | "list" | "select"; options?: string[] };
export type Col = { key: string; label: string; fmt?: (v: any, item: any) => string };
export default function CrudPage({ title, noun, endpoint, fields, cols }: { title: string; noun: string; endpoint: string; fields: Field[]; cols: Col[] }) {
  const { data, reload } = useApi<any>(endpoint), [edit, setEdit] = useState<any>(null), items = data?.items || [];
  function open(it?: any) {
    const v: any = {};
    fields.forEach(f => { let x = it?.[f.key]; if (f.type === "date" && x) x = String(x).slice(0, 10); if (f.type === "list") x = (x || []).join(", "); v[f.key] = x ?? (f.type === "number" ? 0 : f.options?.[0] ?? ""); });
    setEdit({ _id: it?._id, v });
  }
  async function save(e: React.FormEvent) {
    e.preventDefault(); const body: any = {};
    fields.forEach(f => { let x = edit.v[f.key]; if (f.type === "number") x = Number(x); if (f.type === "list") x = String(x).split(",").map(s => s.trim()).filter(Boolean); body[f.key] = x; });
    try { await api(endpoint, { method: edit._id ? "PUT" : "POST", body: edit._id ? { _id: edit._id, ...body } : body }); toast.success("Saved"); setEdit(null); reload(); } catch (x: any) { toast.error(x.message); }
  }
  async function del(id: string) { if (!confirm(`Delete this ${noun}?`)) return; try { await api(`${endpoint}?id=${id}`, { method: "DELETE" }); reload(); } catch (x: any) { toast.error(x.message); } }
  return (<div><div className="flex items-center gap-3"><h1 className="flex-1 font-display text-5xl">{title}</h1><button className={btn} onClick={() => open()}>+ Add {noun}</button></div>
    <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/5"><table className="w-full text-left"><thead className="text-sm text-slate-400"><tr>{cols.map(c => <th key={c.key} className="p-3">{c.label}</th>)}<th /></tr></thead>
      <tbody>{items.map((it: any) => <tr key={it._id} className="border-t border-white/10">{cols.map(c => <td key={c.key} className="p-3">{c.fmt ? c.fmt(it[c.key], it) : String(it[c.key] ?? "")}</td>)}
        <td className="whitespace-nowrap p-3 text-right"><button className={btn2 + " mr-2 !px-3 !py-1.5 text-sm"} onClick={() => open(it)}>Edit</button><button className={btnDel} onClick={() => del(it._id)}>Delete</button></td></tr>)}
        {!items.length && <tr><td className="p-4 text-slate-400" colSpan={cols.length + 1}>Nothing here yet.</td></tr>}</tbody></table></div>
    <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?._id ? `Edit ${noun}` : `Add ${noun}`}>{edit && <form onSubmit={save} className="space-y-3">
      {fields.map(f => <label key={f.key} className="block text-sm text-slate-400">{f.label}{f.type === "textarea" ? <textarea className={inp} rows={3} value={edit.v[f.key]} onChange={e => setEdit({ ...edit, v: { ...edit.v, [f.key]: e.target.value } })} />
        : f.type === "select" ? <select className={inp} value={edit.v[f.key]} onChange={e => setEdit({ ...edit, v: { ...edit.v, [f.key]: e.target.value } })}>{f.options!.map(o => <option key={o}>{o}</option>)}</select>
        : <input className={inp} type={f.type === "number" || f.type === "date" ? f.type : "text"} value={edit.v[f.key]} onChange={e => setEdit({ ...edit, v: { ...edit.v, [f.key]: e.target.value } })} />}</label>)}
      <div className="flex gap-2 pt-2"><button className={btn}>Save</button><button type="button" className={btn2} onClick={() => setEdit(null)}>Cancel</button></div></form>}</Modal></div>);
}
