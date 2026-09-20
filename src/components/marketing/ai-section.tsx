"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { ButtonLink, Eyebrow } from "@/components/ui/kit";
import { Sparkle } from "@/components/ui/ai-badge";

/* ---------------------------------------------------------------------------
   What the AI does. Shared by the consumer and military landings.

   This section exists because the AI was invisible on every marketing surface —
   it only ever appeared inside the demo apps, which meant anyone reading the
   site rather than clicking through it would conclude there wasn't any.

   Three claims, and every one of them is a thing that runs today against a
   real model. Nothing aspirational is listed here; the ask-message drafting is
   still scripted, so it is deliberately absent. A capability list that mixes
   shipped and planned is how a demo turns into a thing you have to walk back.
------------------------------------------------------------------------- */

const USES = [
  {
    t: "It reads the document, so nobody types it in",
    d: "Photograph a discharge certificate or a policy. It works out what the document is, pulls out the dates, the named beneficiaries and the claim numbers, files it in the right row and sets its re-check date.",
    why: "Filling the record is the whole friction. Every product in this category loses people at exactly this step, and no amount of good design fixes typing.",
  },
  {
    t: "It reads your documents against each other",
    d: "Nobody sits down and reads twelve documents side by side. This does, and reports only where two of them disagree — a policy that overrides a will, a form still naming an ex-spouse, an executor nobody ever invited.",
    why: "This is the part no human does. The findings are specific, checkable, and occasionally alarming in a useful way.",
  },
  {
    t: "It shows you where it read that",
    d: "Every field it extracts can be challenged. Ask where a beneficiary name came from and it quotes the line back with the page number.",
    why: "A record people act on has to be auditable. An answer you cannot check is worth less than no answer.",
  },
] as const;

const REFUSALS = [
  "Write a will, or any legal document. That is regulated work and it is not ours.",
  "Decide which of two conflicting documents is correct. It reports the disagreement and stops.",
  "Tell anyone what they are entitled to. Only the agency decides a benefit.",
  "Answer open questions about a family's private documents in a chat box.",
];

export function WhatTheAiDoes({ ctaHref = "/mil/console/conflicts" }: { ctaHref?: string }) {
  return (
    <section id="ai" className="relative border-t border-line bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>
              <span className="inline-flex items-center gap-1.5">
                <Sparkle className="h-3 w-3" />
                What the AI does
              </span>
            </Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] leading-[1.06] text-balance">
              It does the reading nobody has time to do.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 text-[15.5px] leading-relaxed text-muted text-pretty">
              Three jobs, all of them running right now — you can watch each one work in
              the demo. The test applied to every one: does the model do work a person
              would otherwise skip, or does it produce an opinion someone might act on?
              The first is the product. The second is liability in a product&rsquo;s
              clothes.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
          {USES.map((u, i) => (
            <StaggerItem key={u.t}>
              <div className="flex h-full flex-col bg-bg p-6 sm:p-7">
                <span className="font-mono text-[11px] text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-[19px] leading-snug text-ink text-balance">
                  {u.t}
                </h3>
                <p className="mt-3.5 text-[14px] leading-relaxed text-muted text-pretty">
                  {u.d}
                </p>
                <p className="mt-auto pt-5 text-[13px] leading-relaxed text-accent text-pretty">
                  {u.why}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-start">
          <Reveal delay={0.1}>
            <div>
              <div className="label-micro">And four things it will not do</div>
              <ul className="mt-4 space-y-3">
                {REFUSALS.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-crit" />
                    <span className="text-[14px] leading-relaxed text-muted text-pretty">
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="rounded-[var(--radius-card)] border border-line bg-bg p-6">
              <p className="text-[14.5px] leading-relaxed text-ink text-pretty">
                The scan is the one to watch. Press it and it takes about forty seconds,
                because it is genuinely reading fourteen documents and writing what it
                finds — not replaying something written in advance.
              </p>
              <ButtonLink href={ctaHref} size="sm" className="mt-5">
                Watch it run
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
