"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { NokmMark } from "@/components/marketing/mil-chrome";
import { DemoSession } from "@/components/product/demo-session";
import { DEMO_PROFILE } from "@/lib/domain/demo";
import { cn } from "@/lib/utils";

/* One screen, one question. Five small pages beat one dense dashboard —
   especially in a room, where anything that needs explaining is a cost. */
const TABS = [
  { href: "/mil/console", label: "Readiness" },
  { href: "/mil/console/conflicts", label: "Conflicts" },
  { href: "/mil/console/release", label: "Release" },
  { href: "/mil/console/add", label: "Add a document" },
  { href: "/mil/console/packet", label: "Survivor packet" },
] as const;

export function ConsoleShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/mil">
                <NokmMark />
              </Link>
              <span aria-hidden className="h-4 w-px bg-line" />
              <span className="label-micro">Console</span>
            </div>
            <div className="flex items-center gap-3">
              <DemoSession />
            </div>
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
                      layoutId="console-tab"
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

      {/* <main> rather than <div>: axe flagged landmark-one-main and 66
          out-of-landmark regions here. A screen-reader user otherwise has no
          way to skip the header and jump to the record list — which on this
          page is the entire content. */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl leading-none text-ink">{DEMO_PROFILE.name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
              <span>{DEMO_PROFILE.rank}</span>
              <span aria-hidden className="text-faint">·</span>
              <span>
                {DEMO_PROFILE.branch}, {DEMO_PROFILE.component}
              </span>
              <span aria-hidden className="text-faint">·</span>
              <span className="tnum">{DEMO_PROFILE.serviceYears}</span>
            </p>
          </div>
          <div className="text-right">
            <div className="label-micro">Authorised to direct disposition</div>
            <div className="mt-1.5 text-[13px] text-ink">{DEMO_PROFILE.padd}</div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

/**
 * The one-line answer to "what am I looking at".
 *
 * Every screen carries one. If a screen needs more than a sentence to explain,
 * it is doing more than one job and should be split.
 */
export function ScreenIntro({ title, line }: { title: string; line: string }) {
  return (
    <div className="mb-6 max-w-2xl">
      <h2 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-[1.1] text-ink">
        {title}
      </h2>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{line}</p>
    </div>
  );
}
