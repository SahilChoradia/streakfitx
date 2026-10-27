import Shell from "@/components/Shell";
const items: [string, string][] = [["/admin/dashboard", "Dashboard"], ["/admin/members", "Members"], ["/admin/water", "Water"], ["/admin/events", "Events"], ["/admin/subscriptions", "Plans"], ["/admin/offers", "Offers"], ["/admin/contact", "Messages"]];
export default function L({ children }: { children: React.ReactNode }) { return <Shell items={items} label="Admin">{children}</Shell>; }
