"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Counter, Magnetic, Reveal, SplitWords, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Badge, ButtonLink, Card, Dot, Eyebrow } from "@/components/ui/kit";
import { VersionSwitch } from "@/components/ui/version-switch";
import {
  PLAN_CHANNELS,
  PLAN_MODULES,
  PLAN_PIPELINE,
  PLAN_STAGES,
  PLAN_TIERS,
} from "@/lib/domain/plan-demo";
import { cn } from "@/lib/utils";

/* =========================================================================
   The AS-SPECIFIED surface — Next_of_Kin_Business_Plan_V9.pdf, rendered.

   Built to the same standard as the other two so the comparison is about
   scope. Every claim on this page is the plan's own claim, in the plan's own
   voice. My assessment of that scope lives in docs/decisions.md, not here.
========================================================================= */

export function PlanMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-accent">
        <span className="font-display text-[12px] leading-none text-accent-ink">N</span>
      </span>
      <span className="font-display text-[17px] leading-none tracking-tight text-ink">
        N.O.K.
      </span>
    </span>
  );
}

const NAV = [
  { href: "#modules", label: "Platform" },
  { href: "#access", label: "Access" },
  { href: "#channels", label: "Distribution" },
  { href: "#rollout", label: "Rollout" },
];

export function PlanNav() {
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
      <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/plan">
          <PlanMark />
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
          <VersionSwitch current="/plan" />
          <ButtonLink href="/plan/app" size="sm">
            Open the app
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

/* --- Hero ---------------------------------------------------------------- */

export function PlanHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[-16rem] h-[34rem] w-[52rem] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse at center, var(--glow), transparent 68%)" }}
        />
      </div>

      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="relative mx-auto max-w-4xl px-5 pb-20 pt-20 text-center sm:px-8 lg:pb-28 lg:pt-28"
      >
        <Reveal y={10}>
          <Eyebrow className="justify-center">Family information · commerce · communication</Eyebrow>
        </Reveal>

        <SplitWords
          as="h1"
          text="Everything your family will need, in one place."
          className="mx-auto mt-6 max-w-[20ch] font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.04] text-balance"
          delay={0.12}
        />

        <Reveal delay={0.5} y={14}>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-muted text-pretty">
            N.O.K. bridges secure asset orchestration, private family networking and legacy
            transfer — so you can organise your legal, financial and personal affairs while
            your loved ones stay connected and guided through life&apos;s key transitions.
            Built for iOS and Android, fully available on the web.
          </p>
        </Reveal>

        <Reveal delay={0.62} y={14}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <ButtonLink href="/plan/app" size="lg">
                Open the app
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="#modules" size="lg" variant="outline">
              See the five modules
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.74} y={14}>
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {PLAN_MODULES.map((m) => (
              <Badge key={m.id} tone="neutral" className="bg-surface">
                {m.title}
              </Badge>
            ))}
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}

/* --- Five modules -------------------------------------------------------- */

export function PlanModules() {
  return (
    <section id="modules" className="relative border-t border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Core platform</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] leading-[1.06] text-balance">
              Five services, one secure ecosystem.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
              Delivered as a mobile application for iOS and Android, with full web access.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PLAN_MODULES.map((m) => (
            <StaggerItem key={m.id}>
              <Card className="group h-full p-6 transition-colors duration-300 hover:border-line-strong">
                <div className="flex items-baseline justify-between">
                  <span className="label-micro text-accent">{m.n}</span>
                </div>
                <h3 className="mt-4 font-display text-xl leading-tight text-ink">{m.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted text-pretty">
                  {m.blurb}
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-5">
                  {m.features.map((f) => (
                    <li key={f}>
                      <span className="inline-flex rounded-full bg-elevated px-2.5 py-1 text-[11.5px] text-muted">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </StaggerItem>
          ))}

          <StaggerItem>
            <div className="flex h-full flex-col justify-center rounded-[var(--radius-card)] border border-dashed border-line-strong p-6">
              <div className="label-micro">Also in the plan</div>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                Biometric onboarding by SMS invitation, three-tier access control, funeral home
                and advisor distribution, and a 13-month rollout to 50,000 members.
              </p>
              <a
                href="#access"
                className="mt-4 text-[13.5px] text-accent underline-offset-4 hover:underline"
              >
                Keep reading ↓
              </a>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

/* --- Access tiers -------------------------------------------------------- */

export function PlanAccess() {
  return (
    <section id="access" className="relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>Biometric access control</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] leading-[1.06] text-balance">
                Invited by phone. Unlocked by face.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
                The primary user invites loved ones and benefactors by mobile number. Invites
                carry cryptographic tokens tied to a permission role. Recipients enrol with
                native device biometrics, which unlock local keys and grant zero-knowledge
                access to the vaults and feeds designated for them.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-wrap gap-2">
                <Badge tone="accent">Face ID</Badge>
                <Badge tone="accent">Touch ID</Badge>
                <Badge tone="accent">Android BiometricPrompt</Badge>
              </div>
            </Reveal>
          </div>

          <Stagger className="space-y-4">
            {PLAN_TIERS.map((t) => (
              <StaggerItem key={t.tier}>
                <Card className="p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft font-mono text-[11px] text-accent">
                      T{t.tier}
                    </span>
                    <h3 className="font-display text-lg text-ink">{t.name}</h3>
                    <span className="text-[13px] text-faint">{t.roles}</span>
                  </div>
                  <p className="mt-4 text-[13.5px] text-muted">{t.control}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                    {t.grants.map((g) => (
                      <li key={g}>
                        <span className="inline-flex rounded-full bg-elevated px-2.5 py-1 text-[11.5px] text-muted">
                          {g}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* --- Distribution -------------------------------------------------------- */

export function PlanChannels() {
  return (
    <section id="channels" className="relative border-t border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Growth flywheel</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] leading-[1.06] text-balance">
              Funeral homes are the primary marketers.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
              A multi-channel model driven by direct consumer adoption, e-commerce
              transactions and industry partners seeking modern digital touchpoints for
              client families.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2">
          {PLAN_CHANNELS.map((c) => (
            <StaggerItem key={c.name}>
              <div className="h-full bg-bg p-6">
                <div className="flex items-center gap-2.5">
                  <Dot tone="accent" />
                  <span className="label-micro">{c.role}</span>
                </div>
                <h3 className="mt-3 font-display text-lg text-ink">{c.name}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-muted text-pretty">
                  {c.detail}
                </p>
                <p className="mt-4 border-t border-line pt-4 text-[13px] text-accent">{c.kpi}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* --- Rollout ------------------------------------------------------------- */

export function PlanRollout() {
  return (
    <section id="rollout" className="relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>13-month operational rollout</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] leading-[1.06] text-balance">
              Free to fifty thousand, then monetise.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <div className="mt-10 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <Counter to={50000} className="font-display text-5xl leading-none text-accent" />
            <span className="text-[15px] text-muted">member target by month six, at no cost</span>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
          {PLAN_STAGES.map((s) => (
            <StaggerItem key={s.stage}>
              <div className="h-full border-t-2 border-accent pt-6">
                <div className="flex items-baseline justify-between">
                  <span className="label-micro text-accent">{s.stage}</span>
                  <span className="label-micro">{s.months}</span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink">{s.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted text-pretty">
                  {s.detail}
                </p>
                <p className="mt-4 text-[13px] text-accent">{s.target}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* --- Pipeline ------------------------------------------------------------ */

export function PlanPipeline() {
  return (
    <section className="relative border-t border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Innovation pipeline</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] leading-[1.06] text-balance">
              What comes after the platform.
            </h2>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PLAN_PIPELINE.map((p) => (
            <StaggerItem key={p.title}>
              <Card className="h-full p-6">
                <h3 className="font-display text-lg leading-tight text-ink">{p.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted text-pretty">
                  {p.detail}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* --- CTA + footer -------------------------------------------------------- */

export function PlanCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse at center, var(--glow), transparent 68%)" }}
      />
      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(2rem,4vw,2.9rem)] leading-[1.06] text-balance">
            The whole platform, running.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted text-pretty">
            All five modules, the three access tiers, and the storefront — as specified.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/plan/app" size="lg">
              Open the app
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PlanFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <PlanMark />
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
              Next of Kin — a Series LLC formed in the State of Alabama.
            </p>
          </div>
          <div className="text-[13.5px]">
            <div className="label-micro mb-3">Compare</div>
            <ul className="space-y-2 text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  Version 2 — the inverted consumer build
                </Link>
              </li>
              <li>
                <Link href="/mil" className="transition-colors hover:text-ink">
                  Version 3 — NOKM, military and government
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* The one honest marker on this surface. Everything above is the
            plan's own voice; this says which document it came from. */}
        <div className="mt-10 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-faint">
            This surface renders Next of Kin Business Plan V9 as written, for comparison
            against two alternative builds. Several modules shown here carry licensing or
            regulatory requirements that are not reflected in this demo.
          </p>
        </div>
      </div>
    </footer>
  );
}
