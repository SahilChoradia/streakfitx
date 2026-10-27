"use client";
import CrudPage from "@/components/CrudPage";
export default function P() {
  return <CrudPage title="Membership plans" noun="plan" endpoint="/api/admin/subscriptions"
    fields={[{ key: "name", label: "Name" }, { key: "price", label: "Price (₹)", type: "number" }, { key: "durationMonths", label: "Duration (months)", type: "number" }, { key: "features", label: "Features (comma separated)", type: "list" }, { key: "badge", label: "Badge" }]}
    cols={[{ key: "name", label: "Name" }, { key: "price", label: "Price", fmt: v => "₹" + Number(v).toLocaleString("en-IN") }, { key: "durationMonths", label: "Months" }, { key: "features", label: "Features", fmt: v => v.join(", ") }]} />;
}
