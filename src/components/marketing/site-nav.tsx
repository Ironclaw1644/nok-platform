"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useHydrated } from "@/components/motion/primitives";
import { ButtonLink } from "@/components/ui/kit";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   One nav for all three surfaces.

   Previously each surface had its own header, which meant three places to fix
   anything and three chances to drift. This takes the mark and the section
   links as props; everything else — the version links, the demo CTA, the
   mobile panel — is identical everywhere by construction.

   Sticky on every breakpoint, and deliberately NOT auto-hiding on scroll: on a
   long page about a serious subject, a header that disappears and reappears is
   a distraction, and on mobile it is the only way back out.
------------------------------------------------------------------------- */

export interface NavLink {
  href: string;
  label: string;
}

const VERSIONS = [
  { href: "/plan", n: "1", label: "As specified" },
  { href: "/", n: "2", label: "Consumer" },
  { href: "/mil", n: "3", label: "Military" },
] as const;

export function SiteNav({
  mark,
  links,
  current,
  cta,
}: {
  mark: ReactNode;
  links: NavLink[];
  current: "/plan" | "/" | "/mil";
  cta: { href: string; label: string };
}) {
  const { scrollY } = useScroll();
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const prefersReduce = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = prefersReduce && hydrated;

  useMotionValueEvent(scrollY, "change", (v) => setStuck(v > 24));

  // A menu open over a scrolled page that keeps scrolling underneath is the
  // most common mobile-nav bug. Lock the body while it is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes, because a full-screen panel with no keyboard exit is a trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-500",
          stuck || open
            ? "border-line bg-bg/90 backdrop-blur-xl"
            : "border-transparent",
        )}
      >
        <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href={current} onClick={() => setOpen(false)} className="shrink-0">
            {mark}
          </Link>

          {/* Desktop */}
          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13.5px] text-muted transition-colors duration-200 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <span aria-hidden className="h-4 w-px bg-line" />
            {VERSIONS.filter((v) => v.href !== current).map((v) => (
              <Link
                key={v.href}
                href={v.href}
                className="text-[13.5px] text-muted transition-colors duration-200 hover:text-ink"
              >
                {v.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ButtonLink href={cta.href} size="sm" className="hidden sm:inline-flex">
              {cta.label}
            </ButtonLink>

            {/* Hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-field)] border border-line transition-colors duration-200 hover:border-line-strong lg:hidden"
            >
              <span className="relative block h-3 w-4" aria-hidden>
                <motion.span
                  className="absolute left-0 block h-[1.5px] w-4 rounded-full bg-ink"
                  animate={open ? { top: 5.5, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: reduce ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.span
                  className="absolute left-0 top-[5.5px] block h-[1.5px] w-4 rounded-full bg-ink"
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: reduce ? 0 : 0.18 }}
                />
                <motion.span
                  className="absolute left-0 block h-[1.5px] w-4 rounded-full bg-ink"
                  animate={open ? { top: 5.5, rotate: -45 } : { top: 11, rotate: 0 }}
                  transition={{ duration: reduce ? 0 : 0.26, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[64px] z-40 max-h-[calc(100dvh-64px)] overflow-y-auto border-b border-line bg-bg lg:hidden"
          >
            <nav className="mx-auto max-w-6xl px-5 pb-8 pt-5 sm:px-8">
              <div className="label-micro">On this page</div>
              <ul className="mt-3 space-y-0.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-[var(--radius-field)] px-3 py-2.5 text-[15px] text-ink transition-colors duration-150 hover:bg-elevated"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="label-micro mt-7">The three versions</div>
              <ul className="mt-3 space-y-0.5">
                {VERSIONS.map((v) => {
                  const active = v.href === current;
                  return (
                    <li key={v.href}>
                      <Link
                        href={v.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-[var(--radius-field)] px-3 py-2.5 text-[15px] transition-colors duration-150",
                          active ? "bg-accent-soft text-accent" : "text-ink hover:bg-elevated",
                        )}
                      >
                        <span className="font-mono text-[11px] text-faint">{v.n}</span>
                        {v.label}
                        {active && <span className="label-micro ml-auto">You are here</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-7 space-y-2">
                <ButtonLink
                  href="/start"
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Try the demo
                </ButtonLink>
                <ButtonLink
                  href={cta.href}
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  {cta.label}
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
