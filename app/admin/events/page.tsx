"use client";
import CrudPage from "@/components/CrudPage";
export default function P() {
  return <CrudPage title="Events" noun="event" endpoint="/api/admin/events"
    fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" }, { key: "date", label: "Date", type: "date" }, { key: "location", label: "Location" },
      { key: "category", label: "Category", type: "select", options: ["Marathon", "Bootcamp", "Workshop", "Competition"] }, { key: "capacity", label: "Capacity", type: "number" }]}
    cols={[{ key: "title", label: "Title" }, { key: "date", label: "Date", fmt: v => new Date(v).toLocaleDateString() }, { key: "category", label: "Category" }, { key: "registeredUsers", label: "Registered", fmt: (v, i) => `${v.length}/${i.capacity}` }]} />;
}
