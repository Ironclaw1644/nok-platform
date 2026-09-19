"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge, Button, Dot } from "@/components/ui/kit";
import { ACCESS_TIERS, DEMO_RELEASE } from "@/lib/domain/demo";
import type { Member, ReleaseState } from "@/lib/domain/types";
import { cn, daysSince, formatDate } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Release protocol panel.

   Interactive on purpose. "The executor gets access when you die" is the
   sentence every product in this category writes and none of them explain.
   Clicking through the states here is the fastest way to show that the
   mechanism is quorum + a cancellable window, not a promise.
------------------------------------------------------------------------- */

export function ReleasePanel({ members }: { members: Member[] }) {
  const [state, setState] = useState<ReleaseState>(DEMO_RELEASE.state);
  const [signers, setSigners] = useState<string[]>([]);

  const keyHolders = members.filter((m) => m.isKeyHolder && m.state === "active");
  const quorum = DEMO_RELEASE.quorum;
  const met = signers.length >= quorum;
  const daysToCheckIn = DEMO_RELEASE.checkInDays - daysSince(DEMO_RELEASE.lastCheckIn);

  function toggleSigner(id: string) {
    setSigners((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function reset() {
    setState("armed");
    setSigners([]);
  }

  const tone = state === "armed" ? "ok" : state === "challenged" ? "warn" : "crit";

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="label-micro">Release protocol</div>
        <Badge tone={tone}>
          <Dot tone={tone} pulse={state !== "armed"} />
          {state === "armed" ? "Armed" : state === "challenged" ? "Challenge open" : "Released"}
        </Badge>
      </div>

      <div className="space-y-5 p-5">
        <AnimatePresence mode="wait">
          {state === "armed" && (
            <motion.div
              key="armed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <p className="text-[13px] leading-relaxed text-muted">
                Tier 3 is sealed. Opening it requires{" "}
                <span className="text-ink">{quorum} of {keyHolders.length}</span> key-holders to
                agree, followed by a {DEMO_RELEASE.challengeWindowDays}-day window in which
                Marcus can cancel.
              </p>

              <div className="rounded-[var(--radius-field)] border border-line bg-elevated p-4">
                <div className="flex items-center justify-between">
                  <span className="label-micro">Proof of life</span>
                  <span
                    className={cn(
                      "tnum text-[12px]",
                      daysToCheckIn < 14 ? "text-warn" : "text-muted",
                    )}
                  >
                    {daysToCheckIn > 0 ? `${daysToCheckIn} days remaining` : "overdue"}
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-faint">
                  Last check-in {formatDate(DEMO_RELEASE.lastCheckIn)}. A missed check-in does
                  not release anything by itself — it only notifies key-holders that they may
                  begin a request.
                </p>
              </div>

              <div>
                <div className="label-micro mb-2.5">Key-holders</div>
                <div className="space-y-2">
                  {keyHolders.map((m) => (
                    <label
                      key={m.id}
                      className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-field)] border border-line px-3.5 py-2.5 transition-colors duration-200 hover:border-line-strong"
                    >
                      <input
                        type="checkbox"
                        checked={signers.includes(m.id)}
                        onChange={() => toggleSigner(m.id)}
                        className="h-3.5 w-3.5 accent-[var(--accent)]"
                      />
                      <span className="flex-1 text-[13px] text-ink">{m.name}</span>
                      <span className="text-[11.5px] text-faint">{m.relationship}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="tnum text-[12px] text-faint">
                  {signers.length} / {quorum} shares
                </span>
                <Button size="sm" disabled={!met} onClick={() => setState("challenged")}>
                  Request release
                </Button>
              </div>
            </motion.div>
          )}

          {state === "challenged" && (
            <motion.div
              key="challenged"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div className="rounded-[var(--radius-field)] border border-warn/30 bg-warn/6 p-4">
                <div className="flex items-center gap-2">
                  <Dot tone="warn" pulse />
                  <span className="text-[13px] font-medium text-warn">
                    Challenge window open · {DEMO_RELEASE.challengeWindowDays} days
                  </span>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink">
                  Quorum was met. Every device on the account has been notified, including
                  Marcus&apos;s. If this request is not cancelled within{" "}
                  {DEMO_RELEASE.challengeWindowDays} days, tier 3 opens to the executor.
                </p>
              </div>

              <div className="space-y-2">
                {signers.map((id) => {
                  const m = keyHolders.find((k) => k.id === id);
                  if (!m) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 rounded-[var(--radius-field)] border border-line px-3.5 py-2.5"
                    >
                      <Dot tone="ok" />
                      <span className="flex-1 text-[13px] text-ink">{m.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ok">
                        signed
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[12.5px] leading-relaxed text-faint">
                The window is the entire point. A release that cannot be cancelled is a
                release that can be coerced — by a relative, by a creditor, or by anyone who
                gains control of two devices.
              </p>

              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={reset}>
                  Cancel request
                </Button>
                <Button size="sm" variant="outline" onClick={() => setState("released")}>
                  Skip window (demo)
                </Button>
              </div>
            </motion.div>
          )}

          {state === "released" && (
            <motion.div
              key="released"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div className="rounded-[var(--radius-field)] border border-crit/30 bg-crit/6 p-4">
                <div className="flex items-center gap-2">
                  <Dot tone="crit" pulse />
                  <span className="text-[13px] font-medium text-crit">Tier 3 released</span>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink">
                  The account key has been reconstructed from {quorum} shares. The executor
                  now has the full vault and the survivor packet. Every access from this
                  point is logged and visible to all key-holders.
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={reset}>
                Reset demo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-line pt-4">
          <div className="label-micro mb-2.5">Access tiers</div>
          <div className="space-y-1.5">
            {ACCESS_TIERS.map((t) => {
              const unlocked = t.tier < 3 || state === "released";
              return (
                <div
                  key={t.tier}
                  className="flex items-center gap-3 rounded-[var(--radius-field)] border border-line px-3.5 py-2.5"
                >
                  <span className="font-mono text-[11px] text-faint">T{t.tier}</span>
                  <span className="flex-1 text-[13px] text-ink">{t.name}</span>
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-[0.14em]",
                      unlocked ? "text-ok" : "text-faint",
                    )}
                  >
                    {unlocked ? "open" : `sealed · ${t.quorum} of ${DEMO_RELEASE.totalShares}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
