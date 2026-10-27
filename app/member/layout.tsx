import Shell from "@/components/Shell";
const items: [string, string][] = [["/member/dashboard", "Dashboard"], ["/member/tasks", "Tasks"], ["/member/ai-diet", "AI diet"], ["/member/rewards", "Rewards"], ["/member/rank", "Rank"], ["/member/events", "Events"], ["/member/subscription", "Membership"]];
export default function L({ children }: { children: React.ReactNode }) { return <Shell items={items} label="Member">{children}</Shell>; }
