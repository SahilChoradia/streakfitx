import "./globals.css";
import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";
import Toast from "@/components/Toast";
const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-display" });
export const metadata: Metadata = { title: "RewardFlex – streak-based gym rewards", description: "Build a daily fitness streak and unlock gym rewards." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={display.variable}><body className="font-sans antialiased">{children}<Toast /></body></html>);
}
