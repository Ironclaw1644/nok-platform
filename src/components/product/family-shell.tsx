"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { NokMark } from "@/components/marketing/nok-chrome";
import { DemoSession } from "@/components/product/demo-session";
import { cn } from "@/lib/utils";

/* One screen, one question — same rule as the console. A single page holding
   the record, the gaps, the circle, the ask and the intake reads as capable to
   whoever built it and as noise to everyone else. */
const TABS = [
  { href: "/app", label: "The record" },
  { href: "/app/conflicts", label: "What disagrees" },
  { href: "/app/ask", label: "Ask someone" },
  { href: "/app/add", label: "Add a document" },
] as const;

export function FamilyShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex h-[60px] items-center justify-between gap-4">
            <Link href="/">
              <NokMark />
            </Link>
            <DemoSession />
          </div>
          <nav className="-mb-px flex gap-6 overflow-x-auto">
            {TABS.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={cn(
                    "relative shrink-0 py-3 text-[13px] transition-colors duration-200",
                    active ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {t.label}
                  {active && (
                    <motion.span
                      layoutId="family-tab"
                      className="absolute inset-x-0 -bottom-px h-px bg-accent"
                      transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-8">
        <div className="mb-7">
          <h1 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.08] text-ink">
            The Vance family record
          </h1>
          <p className="mt-2 text-[14.5px] text-muted">
            Started by <span className="text-ink">Alicia</span> — the daughter, not the parents.
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
