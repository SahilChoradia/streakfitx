import Link from "next/link";
export default function PublicHeader() {
  return (<header className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
    <Link href="/" className="font-display text-2xl text-emerald-400">RewardFlex</Link><div className="flex-1" />
    <Link href="/about" className="text-slate-300 hover:text-white">About</Link>
    <Link href="/login" className="rounded-lg bg-emerald-500 px-4 py-1.5 font-medium text-slate-950">Log in</Link></header>);
}
