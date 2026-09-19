"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Dot } from "@/components/ui/kit";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The invite loop.

   This is the consumer product's actual mechanic, animated, because it is the
   thing no competitor's marketing shows: the record is not filled in by the
   person who will die. It is filled in by the person who will need it, asking.

   The sequence deliberately ends on a record that is still missing. A demo
   that resolves to "all complete" teaches the wrong expectation — the product
   is a standing conversation, not a checklist you finish once.
------------------------------------------------------------------------- */

type Beat =
  | { kind: "sent"; text: string }
  | { kind: "typing" }
  | { kind: "received"; text: string; from: string }
  | { kind: "record"; title: string; by: string }
  | { kind: "gap"; title: string };

const BEATS: Beat[] = [
  { kind: "sent", text: "Mom — I started a place for the important stuff. Can you add where the deed is?" },
  { kind: "typing" },
  { kind: "received", from: "Ruth", text: "Blue folder in the office closet. I'll put it in tonight." },
  { kind: "record", title: "Property deed", by: "Ruth" },
  { kind: "record", title: "Insurance policy", by: "Ruth" },
  { kind: "gap", title: "Will" },
];

const STEP_MS = 1500;

export function InviteLoop({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    // Reduced motion shows the finished sequence, derived at render below —
    // never pushed through setState, which would cascade a render once
    // useReducedMotion resolves after first paint.
    if (!inView || reduce) return;
    if (n >= BEATS.length) {
      // Hold on the unresolved gap, then run it again.
      const t = window.setTimeout(() => setN(0), 5200);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(
      () => setN((v) => v + 1),
      BEATS[n]?.kind === "typing" ? 1100 : STEP_MS,
    );
    return () => window.clearTimeout(t);
  }, [n, inView, reduce]);

  const shown = BEATS.slice(0, reduce ? BEATS.length : n);

  return (
    <div
      ref={ref}
      className={cn(
        "surface-card relative flex min-h-[27rem] flex-col overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft font-display text-[13px] text-accent">
          R
        </span>
        <div className="min-w-0">
          <div className="text-[13.5px] font-medium text-ink">Ruth — Mom</div>
          <div className="text-[11.5px] text-faint">Tier 1 · joined 3 weeks ago</div>
        </div>
        <span className="ml-auto">
          <Dot tone="ok" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <AnimatePresence mode="popLayout">
          {shown.map((b, i) => (
            <motion.div
              key={`${i}-${b.kind}`}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", visualDuration: 0.42, bounce: 0.18 }}
            >
              {b.kind === "sent" && (
                <div className="flex justify-end">
                  <p className="max-w-[86%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2.5 text-[13.5px] leading-snug text-accent-ink">
                    {b.text}
                  </p>
                </div>
              )}

              {b.kind === "typing" && (
                <div className="flex justify-start">
                  <span className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-elevated px-3.5 py-3">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-faint"
                        animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.18 }}
                      />
                    ))}
                  </span>
                </div>
              )}

              {b.kind === "received" && (
                <div className="flex justify-start">
                  <p className="max-w-[86%] rounded-2xl rounded-bl-sm bg-elevated px-3.5 py-2.5 text-[13.5px] leading-snug text-ink">
                    {b.text}
                  </p>
                </div>
              )}

              {b.kind === "record" && (
                <div className="flex items-center gap-2.5 rounded-[var(--radius-field)] border border-ok/30 bg-ok/6 px-3.5 py-2.5">
                  <Dot tone="ok" />
                  <span className="flex-1 text-[13px] text-ink">{b.title}</span>
                  <span className="text-[11.5px] text-muted">added by {b.by}</span>
                </div>
              )}

              {b.kind === "gap" && (
                <div className="flex items-center gap-2.5 rounded-[var(--radius-field)] border border-crit/30 bg-crit/6 px-3.5 py-2.5">
                  <Dot tone="crit" pulse />
                  <span className="flex-1 text-[13px] text-ink">{b.title}</span>
                  <span className="text-[11.5px] font-medium text-crit">still missing</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="border-t border-line bg-elevated/60 px-5 py-3.5">
        <p className="text-[12.5px] leading-relaxed text-muted">
          The record fills in because someone asked — not because a reminder fired at a
          person with no reason to care.
        </p>
      </div>
    </div>
  );
}
