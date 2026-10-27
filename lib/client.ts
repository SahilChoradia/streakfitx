"use client";
import { useCallback, useEffect, useState } from "react";
export const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
export async function api<T = any>(url: string, init?: { method?: string; body?: any }): Promise<T> {
  const r = await fetch(url, { method: init?.method || "GET", headers: { "Content-Type": "application/json" }, body: init?.body ? JSON.stringify(init.body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d;
}
export function useApi<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null), [error, setError] = useState(""), [loading, setLoading] = useState(true);
  const reload = useCallback(async () => { try { setData(await api<T>(url)); setError(""); } catch (e: any) { setError(e.message); } finally { setLoading(false); } }, [url]);
  useEffect(() => { reload(); }, [reload]);
  return { data, error, loading, reload };
}
export function compressImage(file: File, max = 640): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => { const i = new Image(); i.onload = () => { const s = Math.min(1, max / i.width), c = document.createElement("canvas"); c.width = i.width * s; c.height = i.height * s; c.getContext("2d")!.drawImage(i, 0, 0, c.width, c.height); res(c.toDataURL("image/jpeg", 0.65)); }; i.onerror = rej; i.src = fr.result as string; };
    fr.onerror = rej; fr.readAsDataURL(file);
  });
}
