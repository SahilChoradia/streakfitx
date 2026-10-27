"use client";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { btn2 } from "./ui";

export default function Shell({ items, label, children }: { items: [string, string][]; label: string; children: ReactNode }) {
  const path = usePathname(), router = useRouter();
  const [open, setOpen] = useState(false);

  async function out() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [path]);

  // Close menu on escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [open]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1411]/95 backdrop-blur-md print:hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          {/* Logo & Role Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link href="/" className="font-display text-2xl text-emerald-400 shrink-0">
              RewardFlex
            </Link>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-400 shrink-0">
              {label}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center gap-1 overflow-x-auto px-2" aria-label="Main">
            {items.map(([href, name]) => {
              const active = path.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    active ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Logout Button */}
          <button onClick={out} className={`hidden md:inline-flex ${btn2}`}>
            Log out
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 md:hidden transition-colors"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {open && (
          <div className="border-t border-white/10 bg-[#0b1411] px-5 py-3 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
              {items.map(([href, name]) => {
                const active = path.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/20"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{name}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  setOpen(false);
                  out();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}

