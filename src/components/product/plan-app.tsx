"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge, Button, Card, Dot } from "@/components/ui/kit";
import {
  PLAN_BILLS,
  PLAN_EVENTS,
  PLAN_FEED,
  PLAN_MODULES,
  PLAN_STORE,
  PLAN_VAULT,
} from "@/lib/domain/plan-demo";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The five-module app, as specified.

   Tabs rather than a dashboard-of-everything, because five modules of this
   size do not co-exist on one screen — which is itself a finding worth seeing
   rather than arguing about.
------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

export function PlanApp() {
  const [tab, setTab] = useState(PLAN_MODULES[0].id);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(1.8rem,3.4vw,2.5rem)] leading-[1.06] text-ink">
              The Vance family
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              6 members · Tier 1 access · Family plan
            </p>
          </div>
          <Badge tone="warn">
            <Dot tone="warn" pulse />
            Demo data
          </Badge>
        </div>

        {/* Module tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto border-b border-line pb-px">
          {PLAN_MODULES.map((m) => {
            const active = tab === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setTab(m.id)}
                className={cn(
                  "relative shrink-0 px-3.5 py-3 text-[13.5px] transition-colors duration-200",
                  active ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {m.title}
                {active && (
                  <motion.span
                    layoutId="plan-tab"
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", visualDuration: 0.3, bounce: 0.1 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {tab === "memories" && <Memories />}
            {tab === "wills" && <Wills />}
            {tab === "calendar" && <CalendarBills />}
            {tab === "lockbox" && <Lockbox />}
            {tab === "store" && <Storefront />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* --- 01 Memories --------------------------------------------------------- */

function Memories() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <Card className="min-w-0 overflow-hidden">
        <div className="border-b border-line px-5 py-3.5">
          <div className="label-micro">Family wall</div>
        </div>
        <div className="divide-y divide-line">
          {PLAN_FEED.map((f, i) => (
            <div key={i} className="flex gap-3.5 px-5 py-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-[12px] text-accent">
                {f.who[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] leading-snug text-ink">
                  <span className="font-medium">{f.who}</span> {f.what}
                </p>
                <p className="mt-1 text-[12px] text-faint">{f.when}</p>
                {f.kind === "media" && (
                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 4 }).map((_, k) => (
                      <div
                        key={k}
                        className="aspect-square rounded-[6px] bg-elevated"
                        aria-hidden
                      />
                    ))}
                  </div>
                )}
                {f.kind === "audio" && (
                  <div className="mt-3 flex items-center gap-2 rounded-[var(--radius-field)] border border-line bg-elevated px-3 py-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] text-accent-ink">
                      ▶
                    </span>
                    <div className="flex h-5 flex-1 items-center gap-[3px]" aria-hidden>
                      {Array.from({ length: 34 }).map((_, k) => (
                        <span
                          key={k}
                          className="w-[2px] rounded-full bg-line-strong"
                          style={{ height: `${20 + Math.abs(Math.sin(k * 1.4)) * 70}%` }}
                        />
                      ))}
                    </div>
                    <span className="tnum text-[11px] text-faint">2:14</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="min-w-0 space-y-5">
        <Card className="p-5">
          <div className="label-micro">Circle</div>
          <div className="mt-3.5 space-y-2.5">
            {["Ruth Vance", "Harold Vance", "Daniel Vance", "Alicia Ellison-Ward"].map((n) => (
              <div key={n} className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-elevated text-[11px] text-muted">
                  {n[0]}
                </span>
                <span className="text-[13.5px] text-ink">{n}</span>
              </div>
            ))}
          </div>
          <Button size="sm" variant="secondary" className="mt-4 w-full">
            Invite by text
          </Button>
        </Card>
        <Card className="p-5">
          <div className="label-micro">Storage</div>
          <p className="mt-3 text-[14px] text-muted">
            <span className="font-display text-2xl text-ink">4.2</span> GB of 25 GB used
          </p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
            <div className="h-full w-[17%] rounded-full bg-accent" />
          </div>
        </Card>
      </div>
    </div>
  );
}

/* --- 02 Trusts & Wills --------------------------------------------------- */

const DOCS = [
  { name: "Last will and testament", state: "Draft in progress", tone: "warn" as const },
  { name: "Revocable living trust", state: "Not started", tone: "neutral" as const },
  { name: "Durable power of attorney", state: "Executed 5 Nov 2024", tone: "ok" as const },
  { name: "Healthcare directive", state: "Executed 14 Mar 2026", tone: "ok" as const },
  { name: "Guardianship designation", state: "Not started", tone: "neutral" as const },
];

function Wills() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <Card className="min-w-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="label-micro">Documents</div>
          <Button size="sm">Start a document</Button>
        </div>
        <div className="divide-y divide-line">
          {DOCS.map((d) => (
            <div key={d.name} className="flex items-center gap-3 px-5 py-4">
              <Dot tone={d.tone} />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-ink">{d.name}</p>
                <p className="mt-0.5 text-[12px] text-faint">{d.state}</p>
              </div>
              <span className="text-[12.5px] text-accent">Open</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="min-w-0 space-y-5">
        <Card className="p-5">
          <div className="label-micro">Guided questionnaire</div>
          <p className="mt-3 text-[14px] leading-relaxed text-muted">
            Answer a series of questions about your family, property and wishes. N.O.K.
            assembles the documents and tells you what needs witnessing or notarising.
          </p>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <span className="label-micro">Will — step 4 of 11</span>
              <span className="tnum text-[11px] text-muted">36%</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
              <div className="h-full w-[36%] rounded-full bg-accent" />
            </div>
          </div>
          <Button size="sm" className="mt-4 w-full">
            Continue
          </Button>
        </Card>
        <Card className="p-5">
          <div className="label-micro">Assigned</div>
          <p className="mt-3 text-[13.5px] text-muted">
            Executor: <span className="text-ink">Marion Keel</span>
          </p>
          <p className="mt-1.5 text-[13.5px] text-muted">
            Attorney: <span className="text-ink">Priya Anand</span>
          </p>
        </Card>
      </div>
    </div>
  );
}

/* --- 03 Calendars & Bill Pay --------------------------------------------- */

function CalendarBills() {
  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
      <Card className="min-w-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="label-micro">Shared bills</div>
          <span className="text-[12px] text-faint">4 tracked</span>
        </div>
        <div className="divide-y divide-line">
          {PLAN_BILLS.map((b) => (
            <div key={b.name} className="flex items-center gap-3 px-5 py-4">
              <Dot tone={b.state === "due" ? "warn" : b.state === "paid" ? "ok" : "neutral"} />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-ink">{b.name}</p>
                <p className="mt-0.5 text-[12px] text-faint">
                  {b.due} · {b.who}
                </p>
              </div>
              <span className="tnum shrink-0 text-[14px] text-ink">{b.amount}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-line bg-elevated px-5 py-3.5">
          <Button size="sm" className="w-full">
            Pay now
          </Button>
        </div>
      </Card>

      <Card className="min-w-0 overflow-hidden">
        <div className="border-b border-line px-5 py-3.5">
          <div className="label-micro">This week</div>
        </div>
        <div className="divide-y divide-line">
          {PLAN_EVENTS.map((e) => (
            <div key={e.title} className="flex items-center gap-3 px-5 py-4">
              <span className="w-16 shrink-0 font-mono text-[11px] text-accent">{e.when}</span>
              <p className="min-w-0 flex-1 text-[14px] text-ink">{e.title}</p>
              <span className="shrink-0 rounded-full bg-elevated px-2.5 py-1 text-[11px] text-muted">
                {e.tag}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* --- 04 Lockbox ---------------------------------------------------------- */

function Lockbox() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <Card className="min-w-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="label-micro">Vault · {PLAN_VAULT.length} items</div>
          <Badge tone={unlocked ? "ok" : "neutral"}>{unlocked ? "Unlocked" : "Locked"}</Badge>
        </div>
        <div className="divide-y divide-line">
          {PLAN_VAULT.map((v) => {
            const hidden = v.tier === 3 && !unlocked;
            return (
              <div key={v.name} className="flex items-center gap-3 px-5 py-4">
                <Dot tone={hidden ? "neutral" : "ok"} />
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[14px]", hidden ? "select-none blur-[5px]" : "text-ink")}>
                    {v.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-faint">
                    {v.kind} · Tier {v.tier}
                  </p>
                </div>
                {hidden && <span className="label-micro shrink-0">Tier 3</span>}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="min-w-0 p-5">
        <div className="label-micro">Biometric unlock</div>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          Tier 3 items require biometric authentication plus multi-party verification.
        </p>
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => setUnlocked((u) => !u)}
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full border-2 transition-colors duration-300",
              unlocked ? "border-accent bg-accent-soft" : "border-line-strong hover:border-accent",
            )}
            aria-label={unlocked ? "Lock vault" : "Unlock vault with biometrics"}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 1 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5ZM5 11v1a7 7 0 0 0 14 0v-1M12 19v3"
                stroke={unlocked ? "var(--accent)" : "var(--faint)"}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <p className="mt-4 text-center text-[12.5px] text-faint">
          {unlocked ? "Face ID verified" : "Tap to authenticate"}
        </p>
      </Card>
    </div>
  );
}

/* --- 05 Storefront ------------------------------------------------------- */

function Storefront() {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["All", "Documents", "Gifting", "Pre-need", "Diagnostics", "Subscription"].map(
            (t, i) => (
              <span
                key={t}
                className={cn(
                  "rounded-full border px-3 py-1 text-[12.5px]",
                  i === 0
                    ? "border-accent text-accent"
                    : "border-line text-muted",
                )}
              >
                {t}
              </span>
            ),
          )}
        </div>
        <span className="text-[12.5px] text-faint">Cart · 0</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PLAN_STORE.map((p) => (
          <Card key={p.name} className="group overflow-hidden">
            <div className="aspect-[4/3] bg-elevated" aria-hidden />
            <div className="p-5">
              <span className="label-micro">{p.tag}</span>
              <h3 className="mt-2.5 text-[15px] font-medium leading-snug text-ink">{p.name}</h3>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[15px] text-ink">{p.price}</span>
                <Button size="sm" variant="secondary">
                  Add
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
