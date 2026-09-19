"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useHydrated } from "@/components/motion/primitives";
import { Badge, Button, Dot } from "@/components/ui/kit";
import { FORMS } from "@/lib/domain/forms";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   AI document intake.

   The highest-value AI surface in the product and the lowest-risk one: it
   classifies and extracts, it does not advise. See docs/ai.md §1.

   SCRIPTED, NOT LIVE. No model is called and nothing leaves the browser. The
   flow demonstrates the interaction and the shape of the output; it is not
   evidence that extraction works. The UI says so, because a demo that quietly
   implies a working model is the kind of thing that gets repeated in a room
   as if it were true.
------------------------------------------------------------------------- */

interface Sample {
  id: string;
  label: string;
  /** What the classifier "returns". */
  classified: string;
  formKey?: string;
  fields: { k: string; v: string }[];
  reviewDays: number | null;
  /** The genuinely useful part: something a human would have missed. */
  flag?: string;
}

const SAMPLES: Sample[] = [
  {
    id: "dd214",
    label: "Photo of a discharge certificate",
    classified: "Certificate of Release or Discharge from Active Duty",
    formKey: "dd214",
    fields: [
      { k: "Character of service", v: "Honorable" },
      { k: "Branch", v: "Army" },
      { k: "Service dates", v: "2001 – 2023" },
      { k: "Separation code", v: "present, unreadable in this scan" },
    ],
    reviewDays: null,
    flag: "One field could not be read confidently. Flagged rather than guessed.",
  },
  {
    id: "policy",
    label: "Life insurance policy PDF",
    classified: "Life insurance policy — term",
    fields: [
      { k: "Beneficiary", v: "Denise Ellison — 100%" },
      { k: "Policy number", v: "•••••• 4417" },
      { k: "Issued", v: "02 Jun 2026" },
    ],
    reviewDays: 365,
    flag: "Beneficiary differs from the will on file. Surfaced for review.",
  },
  {
    id: "directive",
    label: "Scan of a healthcare directive",
    classified: "Advance healthcare directive",
    fields: [
      { k: "Health proxy", v: "Denise Ellison" },
      { k: "Alternate proxy", v: "Jordan Ellison" },
      { k: "Executed", v: "22 Mar 2021" },
    ],
    reviewDays: 730,
    flag: "Executed over four years ago. Re-verification scheduled.",
  },
];

const STEPS = [
  "Reading document",
  "Identifying document type",
  "Extracting fields",
  "Checking against records on file",
  "Filing and setting review clock",
];

export function AiIntake({
  onFiled,
  className,
  compact = false,
}: {
  onFiled?: (title: string) => void;
  className?: string;
  compact?: boolean;
}) {
  const prefersReduce = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = prefersReduce && hydrated;

  const [picked, setPicked] = useState<Sample | null>(null);
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), reduce ? 70 : 620);
    return () => window.clearTimeout(t);
  }, [step, reduce]);

  useEffect(() => {
    if (step === STEPS.length) {
      const t = window.setTimeout(() => setDone(true), reduce ? 60 : 320);
      return () => window.clearTimeout(t);
    }
  }, [step, reduce]);

  function pick(s: Sample) {
    setPicked(s);
    setDone(false);
    setStep(0);
  }

  function reset() {
    setPicked(null);
    setStep(-1);
    setDone(false);
  }

  const form = picked?.formKey ? FORMS[picked.formKey] : undefined;

  return (
    <div className={cn("surface-card overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
        <div className="label-micro">Add a document</div>
        <Badge tone="neutral">Scripted demo · no model is called</Badge>
      </div>

      <AnimatePresence mode="wait">
        {!picked && (
          <motion.div
            key="pick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 p-5"
          >
            <p className="text-[14px] leading-relaxed text-muted">
              Photograph it or drop the file in. It gets identified, filed and put on a
              re-check schedule — so nobody types anything.
            </p>
            <div className="space-y-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => pick(s)}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-field)] border border-dashed border-line-strong px-4 py-3.5 text-left transition-colors duration-200 hover:border-accent hover:bg-accent-soft/40"
                >
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-elevated text-[15px] text-faint"
                  >
                    ↑
                  </span>
                  <span className="flex-1 text-[13.5px] text-ink">{s.label}</span>
                  <span className="label-micro shrink-0">Try it</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {picked && !done && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5"
          >
            <div className="relative mb-5 h-28 overflow-hidden rounded-[var(--radius-field)] border border-line bg-elevated">
              {/* document lines */}
              <div className="space-y-2 p-4" aria-hidden>
                {[92, 74, 84, 61, 78].map((w, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full bg-line-strong/60"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              {!reduce && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-transparent via-accent/25 to-transparent"
                  style={{ animation: "sweep 1.6s ease-in-out infinite" }}
                />
              )}
            </div>

            <ul className="space-y-2.5">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="w-5 shrink-0">
                    {i < step ? (
                      <Dot tone="ok" />
                    ) : i === step ? (
                      <Dot tone="accent" pulse />
                    ) : (
                      <Dot tone="neutral" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[12px] transition-colors duration-300",
                      i < step ? "text-muted" : i === step ? "text-ink" : "text-faint",
                    )}
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {picked && done && (
          <motion.div
            key="result"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-5"
          >
            <div className="flex items-start gap-2.5">
              <Dot tone="ok" />
              <div className="-mt-1 min-w-0">
                <p className="text-[14px] font-medium text-ink">{picked.classified}</p>
                {form && (
                  <p className="mt-0.5 font-mono text-[11.5px] text-muted">{form.number}</p>
                )}
              </div>
            </div>

            <dl className="divide-y divide-line rounded-[var(--radius-field)] border border-line">
              {picked.fields.map((f) => (
                <div key={f.k} className="flex items-baseline justify-between gap-4 px-3.5 py-2.5">
                  <dt className="label-micro shrink-0">{f.k}</dt>
                  <dd className="text-right text-[13px] text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>

            {picked.flag && (
              <div className="rounded-[var(--radius-field)] border border-warn/30 bg-warn/6 p-3.5">
                <div className="label-micro text-warn">Flagged</div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{picked.flag}</p>
              </div>
            )}

            <p className="text-[12.5px] text-faint">
              {picked.reviewDays
                ? `Re-check scheduled in ${picked.reviewDays} days.`
                : "No expiry — this one does not go stale."}
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => {
                  onFiled?.(picked.classified);
                  reset();
                }}
              >
                File it
              </Button>
              {!compact && (
                <Button size="sm" variant="secondary" onClick={reset}>
                  Try another
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
