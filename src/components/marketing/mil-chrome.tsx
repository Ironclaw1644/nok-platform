"use client";

import Link from "next/link";
import { SiteNav } from "@/components/marketing/site-nav";
import { Dot } from "@/components/ui/kit";
import { cn } from "@/lib/utils";

/* Fielded-equipment mark: a bracketed N, like a stencil on a case. */
export function NokmMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M1 5V1h4M21 5V1h-4M1 17v4h4M21 17v4h-4" stroke="var(--accent)" strokeWidth="1.5" />
        <path
          d="M7 15.5v-9l8 9v-9"
          stroke="var(--ink)"
          strokeWidth="1.75"
          strokeLinecap="square"
        />
      </svg>
      <span className="font-mono text-[13px] font-medium tracking-[0.18em] text-ink">NOKM</span>
    </span>
  );
}

const NAV = [
  { href: "#gap", label: "The gap" },
  { href: "#system", label: "System" },
  { href: "#scale", label: "At scale" },
  { href: "#security", label: "Security" },
];

export function MilNav() {
  return (
    <SiteNav
      mark={<NokmMark />}
      links={NAV}
      current="/mil"
      cta={{ href: "/mil/console", label: "Open console" }}
    />
  );
}

export function MilFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <NokmMark />
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              Survivor readiness infrastructure. A product of Next of Kin, a Series LLC
              formed in the State of Alabama.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Dot tone="warn" pulse />
              <span className="label-micro">Pre-release · not an official DoD or VA service</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 text-[13px] sm:gap-16">
            <div>
              <div className="label-micro mb-3">Product</div>
              <ul className="space-y-2 text-muted">
                <li>
                  <Link href="/mil/console" className="transition-colors hover:text-ink">
                    Readiness console
                  </Link>
                </li>
                <li>
                  <Link href="/mil/console/packet" className="transition-colors hover:text-ink">
                    Survivor packet
                  </Link>
                </li>
                <li>
                  <a href="#security" className="transition-colors hover:text-ink">
                    Security model
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="label-micro mb-3">Other surface</div>
              <ul className="space-y-2 text-muted">
                <li>
                  <Link href="/" className="transition-colors hover:text-ink">
                    Next of Kin (consumer)
                  </Link>
                </li>
                <li>
                  <Link href="/app" className="transition-colors hover:text-ink">
                    Family record
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-faint">
            Form numbers and benefit descriptions shown in this product are drawn from a
            verified register and carry a source citation. Nothing here is legal advice, a
            benefits determination, or a substitute for a VA accredited representative.
          </p>
        </div>
      </div>
    </footer>
  );
}
