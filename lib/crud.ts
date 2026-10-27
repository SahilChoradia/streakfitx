import { NextResponse } from "next/server";
import { connectDB } from "./db";
import { requireAdmin } from "./auth";
const no = () => NextResponse.json({ error: "Forbidden" }, { status: 403 });
const err = (e: any) => NextResponse.json({ error: e.message || "Request failed" }, { status: 400 });
/** Admin-only GET/POST/PUT/DELETE handlers for a Mongoose model. DELETE takes ?id=. */
export function crud(Model: any, sort: any = { createdAt: -1 }) {
  return {
    GET: async () => { if (!(await requireAdmin())) return no(); await connectDB(); return NextResponse.json({ items: await Model.find().sort(sort) }); },
    POST: async (req: Request) => { if (!(await requireAdmin())) return no(); await connectDB();
      try { return NextResponse.json({ item: await Model.create(await req.json()) }, { status: 201 }); } catch (e) { return err(e); } },
    PUT: async (req: Request) => { if (!(await requireAdmin())) return no(); await connectDB();
      try { const { _id, id, createdAt, updatedAt, __v, ...rest } = await req.json();
        const item = await Model.findByIdAndUpdate(_id || id, rest, { new: true, runValidators: true });
        return item ? NextResponse.json({ item }) : NextResponse.json({ error: "Not found" }, { status: 404 }); } catch (e) { return err(e); } },
    DELETE: async (req: Request) => { if (!(await requireAdmin())) return no(); await connectDB();
      try { await Model.findByIdAndDelete(new URL(req.url).searchParams.get("id")); return NextResponse.json({ success: true }); } catch (e) { return err(e); } },
  };
}
