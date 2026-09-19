"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Magnetic, Reveal, SplitWords } from "@/components/motion/primitives";
import { ReadinessInstrument } from "@/components/product/readiness-instrument";
import { ButtonLink, Eyebrow } from "@/components/ui/kit";
import { DEMO_MILITARY_RECORDS } from "@/lib/domain/demo";

export function MilHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Hero lifts and fades as the next section arrives. transform+opacity only.
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Layered background: coarse grid, fine grid, amber bloom. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid mask-fade-b" />
        <div className="absolute inset-0 bg-grid-fine mask-fade-radial opacity-60" />
        <motion.div
          className="absolute left-1/2 top-[-18rem] h-[36rem] w-[52rem] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse at center, var(--glow), transparent 68%)" }}
          animate={reduce ? undefined : { opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-32 lg:pt-28"
      >
        <div>
          <Reveal y={10}>
            <Eyebrow>Survivor readiness infrastructure</Eyebrow>
          </Reveal>

          <SplitWords
            as="h1"
            text="Every survivor benefit runs through one document."
            className="mt-6 max-w-[15ch] font-display text-[clamp(2.6rem,6.2vw,4.6rem)] leading-[0.97] text-balance"
            delay={0.15}
          />

          <Reveal delay={0.55} y={14}>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted text-pretty sm:text-base">
              It is also the one most families end up hunting for during the worst week of
              their lives — in a filing cabinet, in a storage unit, in a request queue that
              answers in weeks. NOKM keeps service records verified and current, and turns
              that week into a single export.
            </p>
          </Reveal>

          <Reveal delay={0.68} y={14}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <ButtonLink href="/mil/console" size="lg">
                  Open the readiness console
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="#gap" size="lg" variant="outline">
                What breaks today
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.8} y={14}>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
              {[
                { k: "Records tracked", v: "12", s: "per service member" },
                { k: "Verification", v: "Sourced", s: "every form number cited" },
                { k: "Export", v: "One packet", s: "for the family and the CAO" },
              ].map((i) => (
                <div key={i.k} className="bg-surface px-4 py-4">
                  <dt className="label-micro">{i.k}</dt>
                  <dd className="mt-2 font-display text-xl leading-none text-ink">{i.v}</dd>
                  <dd className="mt-1.5 text-[11px] leading-tight text-faint">{i.s}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.35} y={26} amount={0.15}>
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[24px] opacity-70"
              style={{ background: "radial-gradient(ellipse at 50% 0%, var(--glow), transparent 70%)" }}
            />
            <ReadinessInstrument
              records={DEMO_MILITARY_RECORDS.slice(0, 7)}
              className="relative"
            />
          </div>
        </Reveal>
      </motion.div>
    </section>
  );
}
