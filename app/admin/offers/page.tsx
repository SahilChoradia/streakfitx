"use client";
import CrudPage from "@/components/CrudPage";
export default function P() {
  return <CrudPage title="Offers and rewards" noun="offer" endpoint="/api/admin/offers"
    fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea" }, { key: "requiredStreak", label: "Required streak (days)", type: "number" },
      { key: "category", label: "Category", type: "select", options: ["merchandise", "supplement", "discount", "service"] }, { key: "code", label: "Coupon code" }, { key: "expiryDate", label: "Expiry date (optional)", type: "date" }]}
    cols={[{ key: "title", label: "Title" }, { key: "requiredStreak", label: "Streak", fmt: v => v + " days" }, { key: "category", label: "Category" }, { key: "code", label: "Code" }]} />;
}
