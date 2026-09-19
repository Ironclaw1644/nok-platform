"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Badge, ButtonLink, Card, Dot, Eyebrow } from "@/components/ui/kit";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Pricing.

   The clearest hole in the demo: the business plan has a subscription model
   and no surface ever states a number, so the first question in any room is
   one nobody can answer.

   Every figure here is a PROPOSAL, anchored to published competitor pricing
   rather than invented — the anchors are named on the page so the reasoning
   travels with the number. Change them; that is what they are for.
------------------------------------------------------------------------- */

const CONSUMER = [
  {
    name: "Free",
    price: "$0",
    per: "",
    line: "Enough to start the conversation.",
    features: [
      "Up to 5 records",
      "3 people in your circle",
      "The ask — nudge one person at a time",
      "Gaps and review reminders",
    ],
    cta: { href: "/start", label: "Start free" },
    highlight: false,
    note: "Deliberately generous. A record with three rows in it is worth more to us than a trial that expires.",
  },
  {
    name: "Family",
    price: "$8",
    per: "/month, billed yearly",
    line: "The whole record, the whole family.",
    features: [
      "Unlimited records and documents",
      "Up to 8 people, all three tiers",
      "Quorum release with challenge window",
      "Document intake from a photo",
      "Cross-document conflict scan",
    ],
    cta: { href: "/start", label: "Try the demo" },
    highlight: true,
    note: "$96/year. Everplans lists $75, GoodTrust $149 then $39, Clocr $59.99 — this sits above the floor because it does more than store.",
  },
  {
    name: "Complete",
    price: "$16",
    per: "/month, billed yearly",
    line: "For families with counsel already involved.",
    features: [
      "Everything in Family",
      "Unlimited circle, multiple households",
      "Attorney and advisor seats at no charge",
      "Priority records retrieval support",
      "Annual reviewed export",
    ],
    cta: { href: "/start", label: "Try the demo" },
    highlight: false,
    note: "The tier that exists so Family looks like the sensible choice, and because some families genuinely need it.",
  },
];

const INSTITUTIONAL = [
  {
    name: "NOKM — unit or VSO",
    price: "Per covered member",
    line: "Readiness across a population, without seeing anyone's documents.",
    features: [
      "Aggregate readiness dashboard",
      "Blocking-gap breakdown by record type",
      "Outreach lists, no record access",
      "Survivor packet export for the family and the CAO",
    ],
  },
  {
    name: "Funeral home / advisor",
    price: "Revenue share or flat",
    line: "Co-branded onboarding for client families.",
    features: [
      "White-labelled setup flow",
      "Referral tracking",
      "Family record handover at need",
    ],
    caution:
      "Pre-need revenue share is insurance-regulated per state and likely requires licensure. Flat-fee software is the clean version of this deal.",
  },
];

export function Pricing() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-14rem] h-[30rem] w-[46rem] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse at center, var(--glow), transparent 68%)" }}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
          <Reveal y={10}>
            <Eyebrow className="justify-center">Proposed pricing</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 font-display text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.05] text-balance">
              What it should cost, and why.
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-muted text-pretty">
              These are proposals, not decisions. Each one is anchored to what
              competitors actually charge rather than picked from the air, and the
              anchor is printed next to it so you can argue with the reasoning
              instead of the number.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Stagger className="grid gap-5 lg:grid-cols-3">
            {CONSUMER.map((t) => (
              <StaggerItem key={t.name}>
                <Card
                  className={cn(
                    "flex h-full flex-col p-6",
                    t.highlight && "border-accent ring-1 ring-accent/30",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl text-ink">{t.name}</h2>
                    {t.highlight && <Badge tone="accent">Most families</Badge>}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="font-display text-4xl leading-none text-ink">{t.price}</span>
                    <span className="text-[13px] text-faint">{t.per}</span>
                  </div>
                  <p className="mt-3 text-[14px] text-accent">{t.line}</p>

                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-muted">
                        <Dot tone={t.highlight ? "accent" : "neutral"} />
                        <span className="-mt-1">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-faint">
                    {t.note}
                  </p>

                  <ButtonLink
                    href={t.cta.href}
                    className="mt-5 w-full"
                    variant={t.highlight ? "primary" : "secondary"}
                  >
                    {t.cta.label}
                  </ButtonLink>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow>Institutional</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] leading-[1.06] text-balance">
                Where the real money is.
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 text-[15px] leading-relaxed text-muted text-pretty">
                Consumer subscriptions in this category churn. Every company that grew in
                it sells to an organisation instead — and an organisation has a budget
                line, a renewal date and a reason to care that a consumer does not.
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-5 md:grid-cols-2">
            {INSTITUTIONAL.map((t) => (
              <StaggerItem key={t.name}>
                <Card className="h-full p-6">
                  <h3 className="font-display text-xl text-ink">{t.name}</h3>
                  <p className="mt-2 text-[14px] text-accent">{t.price}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{t.line}</p>
                  <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-muted">
                        <Dot tone="accent" />
                        <span className="-mt-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                  {t.caution && (
                    <div className="mt-5 rounded-[var(--radius-field)] border border-warn/30 bg-warn/6 p-3.5">
                      <div className="label-micro text-warn">Before signing anything</div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{t.caution}</p>
                    </div>
                  )}
                </Card>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <p className="mt-10 max-w-3xl text-[13px] leading-relaxed text-faint">
              Competitor prices cited above were verified in September 2026 and are listed
              in the research notes. Institutional pricing is deliberately unquoted — it
              depends on population size and on whether the buyer is a unit, a veterans
              service organisation or a state department, and quoting a number before
              that conversation is how you leave money on the table.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
