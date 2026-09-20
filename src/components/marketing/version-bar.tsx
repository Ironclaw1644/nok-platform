"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The version switcher, at the top of every surface.

   The three versions were only reachable from inside the nav — named on
   desktop, buried in the hamburger on mobile. That is fine for someone being
   walked through it and useless for someone sent a link, who has no reason to
   believe there is anything to switch to.

   So it sits above the fold, on its own line, on every breakpoint. Deliberately
   not sticky: the nav is already pinned, and two fixed bars on a phone costs
   more height than the switcher is worth once you have seen it.
------------------------------------------------------------------------- */

const VERSIONS = [
  { href: "/plan", n: "1", label: "As specified", short: "Version 1" },
  { href: "/", n: "2", label: "For families", short: "Version 2" },
  { href: "/mil", n: "3", label: "NOKM · military", short: "NOKM" },
] as const;

export function VersionBar({
  current,
}: {
  current: "/plan" | "/" | "/mil" | "/guide";
}) {
  return (
    /* The whole bar is the landmark, not just the links inside it: axe flagged
       the "switch version" label as content outside any region, because a nav
       nested in a plain div leaves its siblings homeless. */
    <nav aria-label="Mockup versions" className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-2.5 sm:px-8">
        <span className="label-micro shrink-0">
          <span className="hidden sm:inline">Mockup · switch version</span>
          <span className="sm:hidden">Versions</span>
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          {VERSIONS.map((v) => {
            const active = v.href === current;
            return (
              <Link
                key={v.href}
                href={v.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[12px] leading-5 transition-colors duration-200",
                  active
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line text-muted hover:border-line-strong hover:text-ink",
                )}
              >
                <span className="font-mono text-[11px] opacity-70">{v.n}</span>
                <span className="ml-1.5 hidden sm:inline">{v.label}</span>
                <span className="ml-1.5 sm:hidden">{v.short}</span>
              </Link>
            );
          })}
        </div>

        {current !== "/guide" && (
          <Link
            href="/guide"
            className="ml-auto shrink-0 text-[12px] text-accent transition-opacity duration-200 hover:opacity-75"
          >
            What is this?
          </Link>
        )}
      </div>
    </nav>
  );
}
