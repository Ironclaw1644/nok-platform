"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHydrated } from "@/components/motion/primitives";
import { Dot } from "@/components/ui/kit";
import { computeReadiness, effectiveStatus, isReady, readinessVerdict } from "@/lib/domain/readiness";
import type { VaultRecord } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The readiness instrument.

   This is the single most important visual in the product, because it is the
   only place the core argument becomes visible: a blocking gap caps the score.
   The ring fills to 88% and then snaps back to 60% as the missing record
   registers — deliberately, so the viewer feels the cap rather than reading
   about it.
------------------------------------------------------------------------- */

const R = 54;
const CIRC = 2 * Math.PI * R;

const STATUS_LABEL: Record<string, string> = {
  verified: "Verified",
  on_file: "On file",
  stale: "Needs re-check",
  requested: "Requested",
  missing: "Missing",
};

/* A stale blocking record IS a gap (see isReady) but it is NOT absent. Saying
   "missing" about a document the family already has in a drawer sends them
   looking for it. */
const GAP_PHRASE: Record<string, string> = {
  missing: "is missing",
  stale: "is out of date",
  requested: "is still being retrieved",
};

export function ReadinessInstrument({
  records,
  className,
  animate = true,
  label = "Survivor readiness",
  register = "military",
  maxRows,
}: {
  records: VaultRecord[];
  className?: string;
  animate?: boolean;
  /** Cap the visible rows WITHOUT changing the score. Scoring a slice would
   *  make the marketing card and the console disagree about the same person,
   *  which reads as a bug and undermines the one number the product sells. */
  maxRows?: number;
  /** NOKM reads "survivor readiness"; the consumer surface says something a
   *  daughter would say out loud. Same instrument, different register. */
  label?: string;
  register?: "military" | "family";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // Gated: decides the percentage rendered, so it must match the server.
  const prefersReduce = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = prefersReduce && hydrated;
  const breakdown = useMemo(() => computeReadiness(records), [records]);
  const verdict = readinessVerdict(breakdown, register);

  const target = breakdown.score;
  const [shownRaw, setShown] = useState(0);
  const [revealedRaw, setRevealed] = useState(0);

  // Derived, not stored. useReducedMotion resolves after first paint, so
  // writing the end state through setState here would cascade a render.
  const still = reduce || !animate;
  const shown = still ? target : shownRaw;
  const revealed = still ? records.length : revealedRaw;

  // Rows are truncated for display only. The score above always reflects the
  // full register.
  const visible = maxRows ? records.slice(0, maxRows) : records;
  const hidden = records.length - visible.length;

  useEffect(() => {
    if (!inView || reduce || !animate) return;

    // Phase 1: rows stream in.
    const rowTimer = window.setInterval(
      () => setRevealed((n) => (n >= records.length ? n : n + 1)),
      90,
    );

    // Phase 2: ring overshoots to the naive "completion %" the user expects…
    const naive = records.filter(isReady).length / records.length;
    let raf = 0;
    const start = performance.now();
    const RISE = 1500;
    const HOLD = 420;
    const SNAP = 620;

    const tick = (now: number) => {
      const t = now - start;
      if (t < RISE) {
        const p = 1 - Math.pow(2, -9 * (t / RISE));
        setShown(naive * p);
      } else if (t < RISE + HOLD) {
        setShown(naive);
      } else if (t < RISE + HOLD + SNAP) {
        // …then drops to the true, capped score. The drop is the point.
        const p = (t - RISE - HOLD) / SNAP;
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(naive + (target - naive) * eased);
      } else {
        setShown(target);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.clearInterval(rowTimer);
      cancelAnimationFrame(raf);
    };
  }, [inView, reduce, animate, target, records]);

  const capped = shown > target + 0.02;
  const ringTone = capped ? "var(--warn)" : verdict.tone === "crit" ? "var(--crit)" : verdict.tone === "ok" ? "var(--ok)" : "var(--accent)";

  return (
    <div
      ref={ref}
      className={cn(
        "surface-card relative overflow-hidden p-5 sm:p-6",
        className,
      )}
    >
      {/* Console sweep. Pure CSS, runs off the JS thread. */}
      {!reduce && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/8 to-transparent"
          style={{ animation: "sweep 7s ease-in-out infinite" }}
        />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="label-micro">{label}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className="tnum font-display text-5xl leading-none"
              style={{ color: ringTone }}
            >
              {Math.round(shown * 100)}
            </span>
            <span className="text-lg text-faint">%</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Dot tone={verdict.tone} pulse={verdict.tone !== "ok"} />
            <span
              className="text-[13px] font-medium"
              style={{ color: `var(--${verdict.tone})` }}
            >
              {verdict.label}
            </span>
          </div>
        </div>

        <svg width="128" height="128" viewBox="0 0 128 128" className="shrink-0 -rotate-90">
          <circle cx="64" cy="64" r={R} fill="none" stroke="var(--line)" strokeWidth="6" />
          <motion.circle
            cx="64"
            cy="64"
            r={R}
            fill="none"
            stroke={ringTone}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - shown)}
            style={{ transition: "stroke 400ms ease" }}
          />
          {/* Cap marker at 60% — visible proof the ceiling is a rule, not a bug. */}
          <circle
            cx="64"
            cy="64"
            r={R}
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="10"
            strokeDasharray={`2 ${CIRC}`}
            strokeDashoffset={-CIRC * 0.6}
            opacity={0.9}
          />
        </svg>
      </div>

      <p className="relative mt-3 text-[13px] leading-relaxed text-muted">{verdict.detail}</p>

      <div className="relative mt-5 space-y-px">
        {visible.map((r, i) => {
          const status = effectiveStatus(r);
          const ready = isReady(r);
          const tone =
            status === "missing"
              ? "crit"
              : status === "stale" || status === "requested"
                ? "warn"
                : "ok";
          return (
            <motion.div
              key={r.id}
              initial={false}
              animate={{
                opacity: i < revealed ? 1 : 0,
                x: i < revealed ? 0 : -6,
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex items-center justify-between gap-3 border-b border-line/60 py-2 last:border-0",
                !ready && r.criticality === "blocking" && "bg-crit/5",
              )}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Dot tone={tone} pulse={!ready && r.criticality === "blocking"} />
                <span className="truncate text-[13px] text-ink">{r.title}</span>
                {r.criticality === "blocking" && (
                  <span className="label-micro shrink-0 text-faint">Blocking</span>
                )}
              </div>
              <span
                className={cn(
                  "shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]",
                  tone === "crit" ? "text-crit" : tone === "warn" ? "text-warn" : "text-faint",
                )}
              >
                {STATUS_LABEL[status]}
              </span>
            </motion.div>
          );
        })}

        {hidden > 0 && (
          <div className="pt-2.5 text-[11.5px] text-faint">
            + {hidden} more record{hidden === 1 ? "" : "s"}, all counted in the score above
          </div>
        )}
      </div>

      {breakdown.gaps.length > 0 && (
        <div className="relative mt-5 rounded-[var(--radius-field)] border border-crit/25 bg-crit/6 p-3.5">
          <div className="label-micro text-crit">Why the ceiling</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
            <span className="font-medium">{breakdown.gaps[0].title}</span>{" "}
            {GAP_PHRASE[effectiveStatus(breakdown.gaps[0])] ?? "is missing"}.{" "}
            {breakdown.gaps[0].unlocks.length}{" "}
            {register === "family" ? "thing" : "benefit"}
            {breakdown.gaps[0].unlocks.length === 1 ? "" : "s"} depend on it, so{" "}
            {register === "family" ? "this" : "readiness"} cannot go above 60% no matter what
            else is filed.
          </p>
        </div>
      )}
    </div>
  );
}
