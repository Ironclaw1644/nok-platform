"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Badge, ButtonLink, Card, Dot, Eyebrow, Meter } from "@/components/ui/kit";
import { DEMO_UNITS } from "@/lib/domain/demo";
import { cn } from "@/lib/utils";

/* =========================================================================
   SECTION — The gap
   A vertical timeline whose spine draws itself as you scroll. Deliberately
   not a horizontal scroll-jack: this content is read, not browsed, and
   hijacking the wheel on a page about bereavement is a poor trade.
========================================================================= */

const TIMELINE = [
  {
    when: "Hour 0",
    title: "Notification",
    body: "The service contacts whoever the emergency-data form names. Not whoever the family assumes. If that form predates a divorce, a remarriage or an estrangement, the wrong person gets the call — and they hold the authority that goes with it.",
    tone: "crit" as const,
  },
  {
    when: "Day 1",
    title: "Authority over remains",
    body: "The funeral home needs to know who may legally direct disposition. That authority is recorded, not assumed, and a family disagreeing about it at this point has no way to resolve it quickly.",
    tone: "crit" as const,
  },
  {
    when: "Day 2–3",
    title: "Honors, flag, cemetery",
    body: "Military funeral honors and a government headstone both ask the same question — prove the service — and both accept the same answer. The burial flag and a place in a national cemetery are separate requests on their own forms, which the family discovers mid-week, one phone call at a time.",
    tone: "warn" as const,
  },
  {
    when: "Day 3–7",
    title: "Life insurance",
    body: "Paid to the beneficiary as designated on file. Not as remembered, not as intended, not as written in the will. Families discover the difference at exactly the wrong moment.",
    tone: "warn" as const,
  },
  {
    when: "Week 2–8",
    title: "Survivor compensation and annuity",
    body: "Survivor compensation, the retired-pay annuity election, accrued benefits. Longer forms, slower queues, and each one gated behind the records from day three.",
    tone: "warn" as const,
  },
  {
    when: "Month 2+",
    title: "Still waiting",
    body: "If the discharge certificate could not be produced in week one, this is where the family still is: a records request in a queue, a funeral already held without honors, benefits accruing against a claim nobody can open.",
    tone: "crit" as const,
  },
];

export function TheGap() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });

  return (
    <section id="gap" className="relative border-t border-line py-24 sm:py-32">
      {/* Constrained to a reading column rather than the 7xl page width. A
          timeline set in a half-empty grid reads as a layout accident; set as
          a document column it reads as deliberate. */}
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div>
          <Reveal>
            <Eyebrow>What actually happens</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.03] text-balance">
              The benefits are earned. The week is a paperwork emergency.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
              Nothing below is a software problem. It is a sequencing problem — a set of
              records that had to be correct before anyone needed them, discovered at the
              one moment nobody has the attention to fix them.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16 pl-8 sm:pl-12">
          {/* Spine */}
          <div aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-line sm:left-[15px]" />
          <motion.div
            aria-hidden
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-accent sm:left-[15px]"
            style={reduce ? { scaleY: 1 } : { scaleY }}
          />

          <div className="space-y-12 sm:space-y-14">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.when} y={20} amount={0.5}>
                <div className="relative">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -left-8 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-bg sm:-left-12",
                      t.tone === "crit" ? "bg-crit" : "bg-warn",
                    )}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="label-micro text-accent">{t.when}</span>
                    <h3 className="text-lg font-medium text-ink">{t.title}</h3>
                  </div>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-muted text-pretty">
                    {t.body}
                  </p>
                  {i === TIMELINE.length - 1 && (
                    <div className="mt-5 inline-flex items-center gap-2.5 rounded-[var(--radius-field)] border border-accent/30 bg-accent/6 px-3.5 py-2.5">
                      <Dot tone="accent" pulse />
                      <span className="text-[13px] text-ink">
                        Every item above is decided before day zero, or not at all.
                      </span>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION — The system
========================================================================= */

const PILLARS = [
  {
    n: "01",
    title: "Verify",
    lede: "A record on file is not a record that works.",
    body: "Every document carries a source, a last-checked date and a re-verification clock. An emergency-data form from 2023 is not marked complete — it is marked due. The product's job is to know the difference between having a document and having the right one.",
    points: ["Source-cited form register", "Per-record review interval", "Change detection on beneficiaries"],
  },
  {
    n: "02",
    title: "Hold",
    lede: "Encrypted so that we cannot read it, and honest about what that costs.",
    body: "Records are encrypted client-side under a key the server never sees. Recovery is a quorum of key-holders, not a support ticket — which means losing a device is survivable and a subpoena to us produces ciphertext.",
    points: ["Client-side envelope encryption", "Quorum recovery, no vendor backdoor", "Tiered release by role"],
  },
  {
    n: "03",
    title: "Release",
    lede: "One packet, on the day it is needed.",
    body: "When the release protocol fires, the family and the casualty assistance officer receive a single complete bundle: every record, every form number with its citation, every next step in sequence. Not a folder. A packet.",
    points: ["Quorum-gated release", "Challenge window before opening", "Ordered next-step checklist"],
  },
];

export function TheSystem() {
  return (
    <section id="system" className="relative border-t border-line bg-surface py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-fine opacity-50 mask-fade-b" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>The system</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.03] text-balance">
              Three jobs. Nothing else.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted text-pretty">
              A readiness product that also sells flowers is not a readiness product. The
              scope below is the entire scope.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.n}>
              <Card className="group h-full p-6 transition-colors duration-300 hover:border-line-strong">
                <div className="flex items-baseline justify-between">
                  <span className="label-micro text-accent">{p.n}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    core
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl text-ink">{p.title}</h3>
                <p className="mt-2 text-[14px] font-medium text-accent">{p.lede}</p>
                <p className="mt-3.5 text-[14px] leading-relaxed text-muted text-pretty">{p.body}</p>
                <ul className="mt-5 space-y-2 border-t border-line pt-5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-[13px] text-muted">
                      <Dot tone="accent" />
                      <span className="-mt-1">{pt}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION — At scale (the institutional sale)
========================================================================= */

export function AtScale() {
  const aggregate = DEMO_UNITS.reduce(
    (acc, u) => {
      acc.pop += u.population;
      acc.ready += u.ready * u.population;
      acc.blocked += u.blocked;
      return acc;
    },
    { pop: 0, ready: 0, blocked: 0 },
  );
  const readyPct = aggregate.ready / aggregate.pop;

  return (
    <section id="scale" className="relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <Reveal>
              <Eyebrow>At scale</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.03] text-balance">
                An organisation sees the score. Never the document.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
                This is the line the whole institutional model rests on. A unit, a veterans
                service organisation or a state department of veterans affairs can see that
                a population has gaps, and can act on that — outreach, a records drive, a
                pre-need filing day. What they cannot see is a single person&apos;s file.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 text-[15px] leading-relaxed text-muted text-pretty">
                Readiness aggregates. Records do not. If that boundary is not absolute, no
                service member enrols, and a readiness product with no enrolment is a
                spreadsheet.
              </p>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-wrap gap-2">
                <Badge tone="accent">Unit command view</Badge>
                <Badge tone="accent">VSO caseload</Badge>
                <Badge tone="accent">State veterans affairs</Badge>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal y={22}>
              <Card className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4">
                  <div>
                    <div className="label-micro">Aggregate readiness</div>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <Counter
                        to={readyPct * 100}
                        suffix="%"
                        className="font-display text-3xl leading-none text-ink"
                      />
                      <span className="text-[13px] text-faint">
                        of <Counter to={aggregate.pop} className="tnum" /> tracked
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="label-micro">Blocking gaps</div>
                    <div className="mt-1.5 flex items-baseline justify-end gap-2">
                      <Counter
                        to={aggregate.blocked}
                        className="font-display text-3xl leading-none text-crit"
                      />
                      <span className="text-[13px] text-faint">people</span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-line">
                  {DEMO_UNITS.map((u, i) => (
                    <Reveal key={u.id} delay={i * 0.06} y={10} amount={0.6}>
                      <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-elevated">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[13px] tracking-wide text-ink">
                              {u.name}
                            </span>
                            <span className="text-[11px] text-faint">{u.population}</span>
                            <span
                              className={cn(
                                "font-mono text-[10px]",
                                u.trend30d >= 0 ? "text-ok" : "text-crit",
                              )}
                            >
                              {u.trend30d >= 0 ? "▲" : "▼"} {Math.abs(Math.round(u.trend30d * 100))}%
                            </span>
                          </div>
                          <Meter
                            value={u.ready}
                            tone={u.ready >= 0.75 ? "ok" : u.ready >= 0.6 ? "warn" : "crit"}
                            className="mt-2.5"
                          />
                        </div>
                        <div className="text-right">
                          <div className="tnum text-[15px] text-ink">
                            {Math.round(u.ready * 100)}%
                          </div>
                          <div className="text-[11px] text-crit">{u.blocked} blocked</div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <div className="border-t border-line bg-elevated px-5 py-3.5">
                  <p className="text-[12px] leading-relaxed text-faint">
                    Aggregates only. No record, filename, or document content from any
                    individual account is reachable from this view — enforced at the query
                    layer, not by UI convention.
                  </p>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION — Security model
========================================================================= */

const SECURITY = [
  {
    k: "Client-side envelope encryption",
    v: "Every record is sealed with a per-record key; those keys are wrapped by an account key that is generated and unwrapped only on your device. The server stores ciphertext and wrapped keys. It cannot open either.",
  },
  {
    k: "Passkeys, not a biometric database",
    v: "Face ID and Android biometrics unlock a key held in the device's secure element. No biometric template is transmitted, stored, or matched by us — because none is ever collected. The original plan described this as biometric authentication; it is more accurately device-held key custody, and the distinction matters for what we are able to promise.",
  },
  {
    k: "Quorum recovery",
    v: "The account key is split into shares across named key-holders. Any two can reconstruct it. Losing a phone is therefore survivable, and no single person — including us — can open the vault alone.",
  },
  {
    k: "Challenge window",
    v: "A release request opens a seven-day window during which the account holder can cancel it. A release that cannot be cancelled is a release that can be coerced.",
  },
  {
    k: "What we cannot promise",
    v: "If every key-holder is lost and the account key is gone, the records are unrecoverable. That is the honest cost of the vendor having no backdoor, and it is stated here rather than discovered later.",
  },
];

export function SecurityModel() {
  return (
    <section id="security" className="relative border-t border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Reveal>
              <Eyebrow>Security model</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.03] text-balance">
                Stated plainly, including the part that is a cost.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
                Every product in this category claims bank-grade encryption. Almost none
                will tell you what happens when you lose the phone, or what a subpoena
                returns. Both are below.
              </p>
            </Reveal>
          </div>

          <Stagger className="space-y-px overflow-hidden rounded-[var(--radius-card)] border border-line">
            {SECURITY.map((s, i) => (
              <StaggerItem key={s.k}>
                <div
                  className={cn(
                    "bg-bg p-5 sm:p-6",
                    i === SECURITY.length - 1 && "border-t-2 border-warn/30 bg-warn/4",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Dot tone={i === SECURITY.length - 1 ? "warn" : "ok"} />
                    <div className="-mt-1">
                      <h3 className="text-[15px] font-medium text-ink">{s.k}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted text-pretty">
                        {s.v}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION — CTA
========================================================================= */

export function MilCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse at center, var(--glow), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <Eyebrow className="justify-center">Working demo</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-display text-[clamp(2.2rem,5.2vw,3.6rem)] leading-[1.02] text-balance">
            The console is real. Open it.
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted text-pretty">
            Seeded with a retired sergeant first class whose discharge certificate went
            missing in a move — the most ordinary failure there is, and the one that caps
            his family&apos;s readiness at sixty percent.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/mil/console" size="lg">
              Open the console
            </ButtonLink>
            <ButtonLink href="/mil/console/packet" size="lg" variant="outline">
              See a survivor packet
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
