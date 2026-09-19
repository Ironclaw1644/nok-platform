"use client";

import { Counter, Parallax, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Badge, ButtonLink, Card, Dot, Eyebrow } from "@/components/ui/kit";
import { DEMO_CONSUMER_RECORDS } from "@/lib/domain/demo";
import { cn } from "@/lib/utils";

/* =========================================================================
   SECTION — Why it starts with you
   The product thesis. Everything else on this page is downstream of it.
========================================================================= */

export function WhyInverted() {
  return (
    <section id="why" className="relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>The thesis</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-display text-[clamp(2.1rem,4.8vw,3.4rem)] leading-[1.02] text-balance">
            Every digital vault before this one was sold to the wrong person.
          </h2>
        </Reveal>

        <div className="mt-8 space-y-5 text-[16px] leading-relaxed text-muted text-pretty">
          <Reveal delay={0.12}>
            <p>
              The category has been tried, well funded, for more than a decade. The pattern
              is consistent enough to be a law: a company builds a beautiful vault, sells a
              subscription to a healthy sixty-year-old, and then watches them never open it
              again. Retention collapses, the company gets bought by an insurer or a funeral
              group for its customer list, and the product is switched off.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p>
              The diagnosis is usually &ldquo;people avoid thinking about death.&rdquo; That
              is true and it is not the problem. The problem is that the person being asked
              to do the work is the only person in the family who will never need the result.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-ink">
              Their daughter will. So sell it to her.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.26}>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
            <div className="bg-surface p-6">
              <div className="label-micro">The old shape</div>
              <p className="mt-3 font-display text-xl leading-snug text-muted">
                Parent buys a vault. Parent fills it alone. Nobody checks it for nine years.
              </p>
              <ul className="mt-4 space-y-2 text-[13.5px] text-faint">
                <li>Churns at renewal</li>
                <li>Contents silently go stale</li>
                <li>Family still improvises on the day</li>
              </ul>
            </div>
            <div className="bg-surface p-6">
              <div className="label-micro text-accent">This shape</div>
              <p className="mt-3 font-display text-xl leading-snug text-ink">
                Adult child opens it. Invites the parent. Both see what is still missing.
              </p>
              <ul className="mt-4 space-y-2 text-[13.5px] text-muted">
                <li className="flex items-start gap-2">
                  <Dot tone="accent" />
                  <span className="-mt-1">The anxious person is the active user</span>
                </li>
                <li className="flex items-start gap-2">
                  <Dot tone="accent" />
                  <span className="-mt-1">Gaps are visible to more than one person</span>
                </li>
                <li className="flex items-start gap-2">
                  <Dot tone="accent" />
                  <span className="-mt-1">Every invite is a second household</span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-8 text-[14px] leading-relaxed text-faint">
            It is the same vault. The difference is entirely in who is holding it, and that
            difference is the only thing in this category that has never been properly tried.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION — How it works
========================================================================= */

const STEPS = [
  {
    n: "One",
    title: "You start it",
    body: "Not your parents. You open the record, add the three things you already know, and see how much of it is blank. That blankness is the product — it is the first honest picture anyone in the family has had.",
  },
  {
    n: "Two",
    title: "You ask one person",
    body: "An invite goes by text. They enrol on their own phone with Face ID and answer one question, not forty. Each answer fills a row that everyone in the circle can see filled.",
  },
  {
    n: "Three",
    title: "It stays current",
    body: "Records age. A healthcare directive from 2021 is not done, it is due. The record tells whoever is paying attention — which, because of how this started, is you.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative border-t border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,4.8vw,3.4rem)] leading-[1.02] text-balance">
              Three steps, and only one of them is yours to finish.
            </h2>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-6 lg:grid-cols-3">
          {STEPS.map((s) => (
            <StaggerItem key={s.n}>
              <div className="h-full border-t-2 border-accent pt-6">
                <div className="label-micro text-accent">{s.n}</div>
                <h3 className="mt-4 font-display text-2xl text-ink">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted text-pretty">
                  {s.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION — What's inside
========================================================================= */

const GROUPS = [
  {
    title: "The legal ones",
    tone: "accent" as const,
    items: ["Will", "Power of attorney", "Healthcare directive", "Guardianship"],
    note: "We hold and track them. We do not draft them — see below.",
  },
  {
    title: "The ones with money attached",
    tone: "accent" as const,
    items: ["Life insurance", "Property deed", "Account register", "Pensions and benefits"],
    note: "What exists and where, not balances.",
  },
  {
    title: "The ones nobody wrote down",
    tone: "accent" as const,
    items: ["Funeral wishes", "Who speaks", "Care instructions", "Letters and recordings"],
    note: "Released to named people, on the day.",
  },
];

export function WhatsInside() {
  return (
    <section id="inside" className="relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>What&apos;s inside</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-[clamp(2.1rem,4.8vw,3.2rem)] leading-[1.02] text-balance">
                {/* Counted from the data. A hand-typed number in a headline
                    drifts the first time the record list changes. */}
                {DEMO_CONSUMER_RECORDS.length} rows, not a filing system.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
                The temptation is to build storage for everything. Storage for everything is
                how a record becomes a drawer. This is a short, opinionated list of what a
                family is actually asked for, in the order they are asked for it.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-7">
                <ButtonLink href="/app" variant="secondary">
                  Open a live record
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Stagger className="space-y-5">
            {GROUPS.map((g) => (
              <StaggerItem key={g.title}>
                <Card className="p-6">
                  <h3 className="font-display text-xl text-ink">{g.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((i) => (
                      <li key={i}>
                        <Badge tone="neutral" className="bg-elevated">
                          {i}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t border-line pt-4 text-[13px] text-faint">
                    {g.note}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION — The day
========================================================================= */

export function TheDay() {
  return (
    <section className="relative border-t border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <Eyebrow className="justify-center">The day</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-6 font-display text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.02] text-balance">
            Two people agree, a week passes, and the record opens.
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-muted text-pretty">
            Not a support ticket. Not a password in a safe deposit box nobody can open
            without the will that is inside it. Two named key-holders agree, everyone on the
            account is notified, and a seven-day window runs in which the whole thing can be
            called off. Then the executor has everything, in order, with the next step on top.
          </p>
        </Reveal>

        <Parallax distance={24} className="mt-12">
          <Reveal delay={0.18}>
            <div className="mx-auto grid max-w-xl gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3">
              {[
                { k: "Key-holders", v: 4, s: "named by you" },
                { k: "Needed to open", v: 2, s: "never one" },
                { k: "Days to cancel", v: 7, s: "by you, silently" },
              ].map((i) => (
                <div key={i.k} className="bg-bg px-4 py-5">
                  <div className="label-micro">{i.k}</div>
                  <div className="mt-2 font-display text-4xl leading-none text-ink">
                    <Counter to={i.v} />
                  </div>
                  <div className="mt-1.5 text-[12px] text-faint">{i.s}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </Parallax>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION — What we don't do
   The scope cuts, stated as a feature. This section is the honest core of
   the whole build and it is deliberately not buried.
========================================================================= */

const CUTS = [
  {
    t: "We don't pay your bills",
    d: "Taking money in to pay someone else's obligations is money transmission, and doing it across the country is a multi-year licensing project before a single bill is paid. A family record should not be waiting on fifty state regulators.",
  },
  {
    t: "We don't write your will",
    d: "Generating legal documents as a non-lawyer is regulated state by state and still unsettled where AI is involved. We hold the will, track whether it has aged out, and tell you when to go back to a lawyer. That is the honest version of the job.",
  },
  {
    t: "We don't sell you a DNA test",
    d: "Diagnostic testing is a laboratory business with its own certification regime. It shares no engineering, no compliance surface, and no customer moment with a family record. It was in the original plan. It is not in this product.",
  },
  {
    t: "We don't run a marketplace",
    d: "Flowers, gift cards and memorial goods are a different company wearing this one's logo. Every hour spent on a storefront is an hour not spent on the only thing anyone will judge us by on the day.",
  },
];

export function WhatWeDont() {
  return (
    <section id="honest" className="relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Scope</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,4.8vw,3.4rem)] leading-[1.02] text-balance">
              Four things we removed on purpose.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
              All four were in the plan this was built from. Each one is a real business —
              and each one, attached to this one, is the reason it would never ship.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
          {CUTS.map((c) => (
            <StaggerItem key={c.t}>
              <div className="h-full bg-surface p-6">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-2 h-px w-5 shrink-0 bg-crit"
                  />
                  <div>
                    <h3 className="text-[16px] font-medium text-ink">{c.t}</h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-muted text-pretty">
                      {c.d}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* =========================================================================
   SECTION — CTA
========================================================================= */

export function NokCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{ background: "radial-gradient(ellipse at center, var(--accent-soft), transparent 68%)" }}
      />
      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <Reveal>
          <h2 className="font-display text-[clamp(2.3rem,5.6vw,3.8rem)] leading-[1] text-balance">
            Start it yourself. Ask them tomorrow.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-muted text-pretty">
            The record below is real and running. Open it, look at what is missing, and
            notice that the missing parts are the ones you would have had to ask about
            anyway.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className={cn("mt-9 flex flex-wrap justify-center gap-3")}>
            <ButtonLink href="/app" size="lg">
              Open the record
            </ButtonLink>
            <ButtonLink href="/mil" size="lg" variant="outline">
              For service families
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
