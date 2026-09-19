"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { InviteLoop } from "@/components/marketing/invite-loop";
import { Magnetic, Reveal, SplitWords } from "@/components/motion/primitives";
import { ButtonLink, Eyebrow } from "@/components/ui/kit";

export function NokHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute right-[-10%] top-[-20%] h-[40rem] w-[40rem] rounded-full opacity-60"
          style={{ background: "radial-gradient(circle at center, var(--accent-soft), transparent 65%)" }}
        />
      </div>

      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14 lg:pb-32 lg:pt-24"
      >
        <div>
          <Reveal y={10}>
            <Eyebrow>For the one who will have to find it</Eyebrow>
          </Reveal>

          <SplitWords
            as="h1"
            text="You don't know where anything is."
            className="mt-6 max-w-[17ch] font-display text-[clamp(2.3rem,4.8vw,3.7rem)] leading-[1.04] text-balance"
            delay={0.12}
          />

          <Reveal delay={0.5} y={14}>
            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-muted text-pretty">
              Not the will, not the deed, not the policy, not the password to the account the
              bills come out of. Neither does your brother. And the person who does know has
              no particular reason to write it down today.
            </p>
          </Reveal>

          <Reveal delay={0.6} y={14}>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-ink text-pretty">
              So Next of Kin starts with you asking, not with them filing.
            </p>
          </Reveal>

          <Reveal delay={0.7} y={14}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <ButtonLink href="/app" size="lg">
                  See what a record looks like
                </ButtonLink>
              </Magnetic>
              <ButtonLink href="#why" size="lg" variant="outline">
                Why this way
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.82} y={14}>
            <p className="mt-8 text-[13px] leading-relaxed text-faint">
              No bill pay. No marketplace. No DNA kits. A record, and the conversation that
              keeps it current.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.3} y={26} amount={0.2}>
          <InviteLoop />
        </Reveal>
      </motion.div>
    </section>
  );
}
