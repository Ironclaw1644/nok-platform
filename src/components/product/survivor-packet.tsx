"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Badge, Button, Dot } from "@/components/ui/kit";
import { DEMO_MILITARY_RECORDS, DEMO_MEMBERS, DEMO_PROFILE } from "@/lib/domain/demo";
import { FORMS, isVerified } from "@/lib/domain/forms";
import { computeReadiness, isReady } from "@/lib/domain/readiness";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The survivor packet.

   This is the product's payoff and the reason the rest of it exists: a single
   ordered bundle handed to a family and a casualty assistance officer on the
   worst day, instead of a folder of scans.

   Two rules encoded here:
   - Missing records are printed as missing, at the top, with the retrieval
     path. A packet that quietly omits what it does not have is worse than no
     packet, because the family will assume it is complete.
   - Every form number carries its citation, and an unverified number renders
     as a visible gap rather than as text. See lib/domain/forms.ts.
------------------------------------------------------------------------- */

const STEPS = [
  "Reconstructing account key from key-holder shares",
  "Decrypting tier 3 records",
  "Resolving form register and citations",
  "Ordering by benefit deadline",
  "Sealing packet",
];

export function SurvivorPacket() {
  const reduce = useReducedMotion();
  const [generated, setGenerated] = useState(false);
  const [step, setStep] = useState(-1);

  const records = DEMO_MILITARY_RECORDS;
  const breakdown = computeReadiness(records);
  const present = records.filter(isReady);
  const missing = records.filter((r) => !isReady(r));

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), reduce ? 80 : 520);
    return () => window.clearTimeout(t);
  }, [step, reduce]);

  useEffect(() => {
    if (step === STEPS.length) {
      const t = window.setTimeout(() => setGenerated(true), reduce ? 60 : 380);
      return () => window.clearTimeout(t);
    }
  }, [step, reduce]);

  return (
    <div className="space-y-5">
      {!generated && (
        <div className="surface-card p-6 sm:p-8">
          <div className="label-micro">Survivor packet</div>
          <h2 className="mt-4 max-w-xl font-display text-2xl leading-tight text-ink sm:text-3xl">
            Generated once, on the day it is needed.
          </h2>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted">
            In production this requires a completed release. Here it runs on demand so you
            can see what the family actually receives — including the parts that are
            missing.
          </p>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {step < 0 ? (
                <motion.div key="idle" exit={{ opacity: 0 }}>
                  <Button onClick={() => setStep(0)}>Generate packet</Button>
                </motion.div>
              ) : (
                <motion.ul
                  key="steps"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2.5"
                >
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
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <AnimatePresence>
        {generated && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Cover */}
            <div className="surface-card overflow-hidden">
              <div className="border-b border-line bg-elevated px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="label-micro">Survivor packet</div>
                    <h2 className="mt-2.5 font-display text-3xl leading-none text-ink">
                      {DEMO_PROFILE.name}
                    </h2>
                    <p className="mt-2 text-[13px] text-muted">
                      {DEMO_PROFILE.rank} · {DEMO_PROFILE.branch}, {DEMO_PROFILE.component} ·{" "}
                      <span className="tnum">{DEMO_PROFILE.serviceYears}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge tone={breakdown.gaps.length ? "crit" : "ok"}>
                      {breakdown.gaps.length ? "Incomplete packet" : "Complete packet"}
                    </Badge>
                    <span className="tnum text-[11.5px] text-faint">
                      {present.length} of {records.length} records included
                    </span>
                  </div>
                </div>
              </div>

              {/* Missing first. Always. */}
              {missing.length > 0 && (
                <div className="border-b border-line bg-crit/6 px-6 py-5">
                  <div className="flex items-center gap-2">
                    <Dot tone="crit" pulse />
                    <h3 className="text-[14px] font-medium text-crit">
                      Read this first — {missing.length} record
                      {missing.length > 1 ? "s" : ""} cannot be relied on
                    </h3>
                  </div>
                  <div className="mt-4 space-y-3.5">
                    {missing.map((r) => {
                      const form = r.formKey ? FORMS[r.formKey] : undefined;
                      return (
                        <div key={r.id} className="border-l-2 border-crit/40 pl-3.5">
                          <div className="flex flex-wrap items-baseline gap-x-2.5">
                            <span className="text-[13.5px] font-medium text-ink">{r.title}</span>
                            {form && (
                              <span className="font-mono text-[11.5px] text-muted">
                                {form.number}
                              </span>
                            )}
                            {r.criticality === "blocking" && (
                              <span className="label-micro text-crit">blocking</span>
                            )}
                          </div>
                          {/* A stale blocking record has no retrieval path — it
                              is already held. What the family needs is the
                              reason it cannot be trusted. */}
                          {(r.retrievalPath ?? r.note) && (
                            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                              {r.retrievalPath ?? r.note}
                            </p>
                          )}
                          <p className="mt-1.5 text-[12.5px] leading-relaxed text-faint">
                            Blocks: {r.unlocks.join(" · ")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* First 48 hours */}
              <div className="border-b border-line px-6 py-5">
                <div className="label-micro">First 48 hours</div>
                <ol className="mt-3.5 space-y-3">
                  {[
                    {
                      t: "Authority to direct disposition",
                      d: `${DEMO_PROFILE.padd}. Recorded on the emergency-data form. The funeral home will ask for this before anything else.`,
                    },
                    {
                      t: "Notify the service casualty office",
                      d: "They initiate the report of casualty, which most downstream claims reference.",
                    },
                    {
                      t: "Request certified death certificates",
                      d: "Order more than feels reasonable. Most claims below require an original, not a copy.",
                    },
                  ].map((s, i) => (
                    <li key={s.t} className="flex gap-3.5">
                      <span className="tnum mt-0.5 shrink-0 font-mono text-[11px] text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="text-[13.5px] font-medium text-ink">{s.t}</div>
                        <p className="mt-1 text-[13px] leading-relaxed text-muted">{s.d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Records index */}
              <div className="border-b border-line px-6 py-5">
                <div className="label-micro">Records included</div>
                <div className="mt-3.5 divide-y divide-line/70">
                  {present.map((r) => {
                    const form = r.formKey ? FORMS[r.formKey] : undefined;
                    const ok = r.formKey ? isVerified(r.formKey) : true;
                    return (
                      <div key={r.id} className="flex items-start gap-3 py-2.5">
                        <Dot tone="ok" />
                        <div className="-mt-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2.5">
                            <span className="text-[13.5px] text-ink">{r.title}</span>
                            {form && (
                              <span className="font-mono text-[11.5px] text-muted">
                                {form.number}
                              </span>
                            )}
                            {form && !ok && (
                              <span className="label-micro text-warn">citation pending</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[12px] leading-relaxed text-faint">
                            {r.unlocks.join(" · ")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contacts */}
              <div className="px-6 py-5">
                <div className="label-micro">Who to call</div>
                <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                  {DEMO_MEMBERS.filter((m) => m.state === "active").map((m) => (
                    <div
                      key={m.id}
                      className="rounded-[var(--radius-field)] border border-line px-3.5 py-2.5"
                    >
                      <div className="text-[13px] text-ink">{m.name}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-faint">
                        <span>{m.relationship}</span>
                        <span aria-hidden>·</span>
                        <span className="font-mono">{m.contactMasked}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="surface-card p-5">
              <p className="text-[12.5px] leading-relaxed text-faint">
                Form numbers above resolve from a source-cited register. Any entry marked
                &ldquo;citation pending&rdquo; has not yet been confirmed against an official
                publication and is withheld from production packets rather than printed on
                trust. Nothing in this packet is legal advice or a benefits determination.
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => { setGenerated(false); setStep(-1); }}>
                  Reset demo
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
