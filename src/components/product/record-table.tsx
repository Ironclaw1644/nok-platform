"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge, Dot } from "@/components/ui/kit";
import { FORMS, isVerified } from "@/lib/domain/forms";
import { effectiveStatus, isReady } from "@/lib/domain/readiness";
import type { RecordStatus, VaultRecord } from "@/lib/domain/types";
import { cn, formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<RecordStatus, string> = {
  verified: "Verified",
  on_file: "On file",
  stale: "Re-check due",
  requested: "Requested",
  missing: "Missing",
};

const STATUS_TONE: Record<RecordStatus, "ok" | "warn" | "crit" | "neutral"> = {
  verified: "ok",
  on_file: "neutral",
  stale: "warn",
  requested: "warn",
  missing: "crit",
};

const CATEGORY_LABEL: Record<string, string> = {
  service: "Service",
  benefit: "Benefit",
  legal: "Legal",
  medical: "Medical",
  financial: "Financial",
  personal: "Personal",
};

export function RecordTable({ records }: { records: VaultRecord[] }) {
  const [open, setOpen] = useState<string | null>(records.find((r) => !isReady(r))?.id ?? null);
  const [filter, setFilter] = useState<"all" | "gaps">("all");

  const shown = filter === "gaps" ? records.filter((r) => !isReady(r)) : records;

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="label-micro">Records · {records.length}</div>
        <div className="flex items-center gap-1 rounded-full border border-line p-0.5">
          {(["all", "gaps"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "relative rounded-full px-3 py-1 text-[12px] transition-colors duration-200",
                filter === f ? "text-accent-ink" : "text-muted hover:text-ink",
              )}
            >
              {filter === f && (
                <motion.span
                  layoutId="record-filter"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }}
                />
              )}
              <span className="relative">
                {f === "all" ? "All" : `Gaps (${records.filter((r) => !isReady(r)).length})`}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-line">
        {shown.map((r) => {
          const status = effectiveStatus(r);
          const tone = STATUS_TONE[status];
          const expanded = open === r.id;
          const form = r.formKey ? FORMS[r.formKey] : undefined;
          const formOk = r.formKey ? isVerified(r.formKey) : false;

          return (
            <div key={r.id} className={cn(!isReady(r) && r.criticality === "blocking" && "bg-crit/4")}>
              <button
                onClick={() => setOpen(expanded ? null : r.id)}
                aria-expanded={expanded}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200 hover:bg-elevated sm:px-5"
              >
                <Dot tone={tone === "neutral" ? "neutral" : tone} pulse={!isReady(r) && r.criticality === "blocking"} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="text-[14px] font-medium text-ink">{r.title}</span>
                    {r.criticality === "blocking" && (
                      <span className="label-micro text-crit">Blocking</span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-faint">
                    <span>{CATEGORY_LABEL[r.category]}</span>
                    {r.lastVerified && (
                      <>
                        <span aria-hidden>·</span>
                        <span>checked {formatDate(r.lastVerified)}</span>
                      </>
                    )}
                    {form && (
                      <>
                        <span aria-hidden>·</span>
                        <span className="font-mono">{form.number}</span>
                      </>
                    )}
                  </div>
                </div>

                <span
                  className={cn(
                    "shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]",
                    tone === "crit" ? "text-crit" : tone === "warn" ? "text-warn" : tone === "ok" ? "text-ok" : "text-faint",
                  )}
                >
                  {STATUS_LABEL[status]}
                </span>

                <motion.span
                  aria-hidden
                  animate={{ rotate: expanded ? 90 : 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="shrink-0 text-faint"
                >
                  ›
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    key={`${r.id}-body`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 border-t border-line/70 bg-elevated/50 px-4 py-4 sm:px-5">
                      <div>
                        <div className="label-micro">Unlocks</div>
                        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                          {r.unlocks.map((u) => (
                            <li key={u} className="flex items-start gap-2 text-[13px] text-muted">
                              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                              {u}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {r.note && (
                        <div>
                          <div className="label-micro">Note</div>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{r.note}</p>
                        </div>
                      )}

                      {r.retrievalPath && !isReady(r) && (
                        <div className="rounded-[var(--radius-field)] border border-accent/25 bg-accent/6 p-3.5">
                          <div className="label-micro text-accent">How to get it</div>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
                            {r.retrievalPath}
                          </p>
                        </div>
                      )}

                      {form && (
                        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3.5">
                          <span className="font-mono text-[12px] text-ink">{form.number}</span>
                          <span className="text-[12px] text-muted">{form.title}</span>
                          {formOk ? (
                            <Badge tone="ok">Source verified</Badge>
                          ) : (
                            <Badge tone="warn">Awaiting source verification</Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[11.5px] text-faint">
                        <span>Visible from tier {r.minTier} and above</span>
                        {r.reviewDays && <span aria-hidden>·</span>}
                        {r.reviewDays && <span>re-checked every {r.reviewDays} days</span>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
