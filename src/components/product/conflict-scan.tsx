"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useHydrated } from "@/components/motion/primitives";
import { Badge, Button, Dot } from "@/components/ui/kit";
import type { Member, VaultRecord } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Cross-document conflict scan. See docs/ai.md §2.

   The feature I would lead with. Nobody reads their twelve documents side by
   side, and the contradictions between them are exactly what causes the
   disasters — a beneficiary that outranks a will, a proxy who left the family,
   an executor who was never told.

   Deliberately narrow: it reports that two documents DISAGREE. It never says
   which is correct and never recommends a legal remedy. That boundary is what
   separates this from unauthorized practice of law.

   SCRIPTED, NOT LIVE. The findings below are authored, though each is derived
   from a real inconsistency present in the demo data rather than invented for
   effect — the expired invites and the stale emergency-data form are genuinely
   there in the record.
------------------------------------------------------------------------- */

type Severity = "crit" | "warn";

interface Finding {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  sources: string[];
  /** What the product does about it. Never legal advice. */
  action: string;
}

const STEPS = [
  "Reading 14 records",
  "Cross-referencing names against the circle",
  "Comparing beneficiaries and designations",
  "Checking dates against life events",
];

function deriveFindings(records: VaultRecord[], members: Member[]): Finding[] {
  const out: Finding[] = [];

  const stale = records.find(
    (r) => r.criticality === "blocking" && r.note?.toLowerCase().includes("wrong person"),
  );
  if (stale) {
    out.push({
      id: "padd",
      severity: "crit",
      title: "The person authorised to direct disposition may be wrong",
      detail:
        "The emergency-data form on file predates a divorce and remarriage. Whoever it names holds the authority — and it is not the person the circle suggests it should be.",
      sources: [stale.title, "Circle"],
      action: "Re-file the emergency-data form. Nothing else in the record can override it.",
    });
  }

  const expired = members.filter((m) => m.state === "expired" || m.state === "invited");
  const attorney = members.find((m) => m.relationship.toLowerCase().includes("attorney"));

  if (attorney && attorney.state !== "active") {
    out.push({
      id: "counsel",
      severity: "warn",
      title: "Estate counsel has never accepted their invite",
      detail: `${attorney.name} is assigned tier 3 but has not enrolled. Tier 3 needs two key-holders to open; one of the four named is not reachable.`,
      sources: ["Circle", "Release protocol"],
      action: "Re-send the invite, or name a different key-holder.",
    });
  }

  const hasPolicy = records.some((r) => r.title.toLowerCase().includes("life insurance"));
  const hasWill = records.some((r) => r.title.toLowerCase().includes("will"));
  if (hasPolicy && hasWill) {
    out.push({
      id: "beneficiary",
      severity: "crit",
      title: "The policy and the will name different people",
      detail:
        "A life insurance policy pays to the beneficiary designated on the policy, regardless of what the will says. These two documents currently disagree, and the policy is the one that governs.",
      sources: ["Life insurance election and beneficiaries", "Will"],
      action: "Both documents flagged for review together. We do not choose between them.",
    });
  }

  const directive = records.find((r) => r.category === "medical");
  if (directive) {
    out.push({
      id: "proxy",
      severity: "warn",
      title: "Healthcare directive is four years old",
      detail:
        "The named health proxy has not been confirmed since the directive was executed. People move, relationships change, and a proxy who cannot be reached is a proxy who does not exist.",
      sources: [directive.title],
      action: "Confirm the proxy is still willing and reachable.",
    });
  }

  if (expired.length) {
    out.push({
      id: "invites",
      severity: "warn",
      title: `${expired.length} invitation${expired.length > 1 ? "s have" : " has"} not been accepted`,
      detail:
        "An unaccepted invite grants nothing. Until each person enrols on their own device they cannot see anything, and they cannot act as a key-holder.",
      sources: ["Circle"],
      action: "Chase them. This one is genuinely your job, not ours.",
    });
  }

  return out;
}

export function ConflictScan({
  records,
  members,
  className,
}: {
  records: VaultRecord[];
  members: Member[];
  className?: string;
}) {
  const prefersReduce = useReducedMotion();
  const hydrated = useHydrated();
  const reduce = prefersReduce && hydrated;

  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const findings = deriveFindings(records, members);

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const t = window.setTimeout(() => setStep((s) => s + 1), reduce ? 70 : 560);
    return () => window.clearTimeout(t);
  }, [step, reduce]);

  useEffect(() => {
    if (step === STEPS.length) {
      const t = window.setTimeout(() => setDone(true), reduce ? 60 : 300);
      return () => window.clearTimeout(t);
    }
  }, [step, reduce]);

  const crit = findings.filter((f) => f.severity === "crit").length;

  return (
    <div className={cn("surface-card overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
        <div className="label-micro">Conflict scan</div>
        <Badge tone="neutral">Scripted demo</Badge>
      </div>

      <AnimatePresence mode="wait">
        {step < 0 && (
          <motion.div key="idle" exit={{ opacity: 0 }} className="space-y-4 p-5">
            <p className="text-[14px] leading-relaxed text-muted">
              Nobody reads their documents side by side. This does — and reports only where
              two of them <span className="text-ink">disagree</span>. It will not tell you
              which one is right.
            </p>
            <Button size="sm" onClick={() => setStep(0)}>
              Scan the record
            </Button>
          </motion.div>
        )}

        {step >= 0 && !done && (
          <motion.ul
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2.5 p-5"
          >
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className="w-5 shrink-0">
                  {i < step ? <Dot tone="ok" /> : i === step ? <Dot tone="accent" pulse /> : <Dot tone="neutral" />}
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

        {done && (
          <motion.div
            key="results"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="border-b border-line bg-elevated/60 px-5 py-3.5">
              <p className="text-[13.5px] text-ink">
                <span className="font-medium">{findings.length} conflicts</span> across 14
                records{crit > 0 && <> · {crit} that would change who gets what</>}
              </p>
            </div>

            <div className="divide-y divide-line">
              {findings.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={reduce ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduce ? 0 : i * 0.08, duration: 0.35 }}
                  className={cn("p-5", f.severity === "crit" && "bg-crit/4")}
                >
                  <div className="flex items-start gap-3">
                    <Dot tone={f.severity} pulse={f.severity === "crit"} />
                    <div className="-mt-1 min-w-0">
                      <h4 className="text-[14px] font-medium text-ink">{f.title}</h4>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{f.detail}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {f.sources.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-elevated px-2.5 py-1 text-[11px] text-muted"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-[12.5px] leading-relaxed text-accent">{f.action}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-line px-5 py-3.5">
              <p className="text-[12px] leading-relaxed text-faint">
                Reports contradictions only. It does not decide which document is correct,
                and nothing here is legal advice.
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="mt-3"
                onClick={() => {
                  setStep(-1);
                  setDone(false);
                }}
              >
                Run again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
