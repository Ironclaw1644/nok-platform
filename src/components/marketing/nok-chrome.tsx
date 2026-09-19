"use client";

import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/kit";
import { VersionSwitch } from "@/components/ui/version-switch";
import { cn } from "@/lib/utils";

/* The consumer mark: two joined strokes — a line continuing through a break.
   Read it as a family line that survives the gap. */
export function NokMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline gap-2.5", className)}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M3 17V3l14 14V3" stroke="var(--ink)" strokeWidth="1.9" strokeLinecap="round" />
        <circle cx="17" cy="17" r="2" fill="var(--accent)" />
      </svg>
      <span className="font-display text-[19px] leading-none text-ink">Next of Kin</span>
    </span>
  );
}

const NAV = [
  { href: "#why", label: "Why it starts with you" },
  { href: "#how", label: "How it works" },
  { href: "#inside", label: "What's inside" },
  { href: "#honest", label: "What we don't do" },
];

export function NokNav() {
  const { scrollY } = useScroll();
  const [stuck, setStuck] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setStuck(v > 24));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-500",
        stuck ? "border-line bg-bg/85 backdrop-blur-xl" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/">
          <NokMark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[13.5px] text-muted transition-colors duration-200 hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <VersionSwitch current="/" />
          <ButtonLink href="/app" size="sm">
            See the record
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

export function NokFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <NokMark />
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
              A living family record. Built so the people who will need it are the people
              keeping it current.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-[13.5px] sm:gap-16">
            <div>
              <div className="label-micro mb-3">Product</div>
              <ul className="space-y-2 text-muted">
                <li>
                  <Link href="/app" className="transition-colors hover:text-ink">
                    The record
                  </Link>
                </li>
                <li>
                  <a href="#how" className="transition-colors hover:text-ink">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#honest" className="transition-colors hover:text-ink">
                    What we don&apos;t do
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="label-micro mb-3">Also from us</div>
              <ul className="space-y-2 text-muted">
                <li>
                  <Link href="/mil" className="transition-colors hover:text-ink">
                    NOKM — for service families
                  </Link>
                </li>
                <li>
                  <Link href="/mil/console" className="transition-colors hover:text-ink">
                    Readiness console
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">
            Next of Kin — a Series LLC formed in the State of Alabama.
          </p>
          <p className="text-xs text-faint">
            We are not a law firm and do not provide legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
