"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge, Button, Dot, Field, Input } from "@/components/ui/kit";
import type { Member, MemberState } from "@/lib/domain/types";
import { cn, formatDate } from "@/lib/utils";

const STATE_TONE: Record<MemberState, "ok" | "warn" | "crit" | "neutral"> = {
  active: "ok",
  invited: "warn",
  expired: "crit",
  declined: "neutral",
};

const STATE_LABEL: Record<MemberState, string> = {
  active: "active",
  invited: "invited",
  expired: "expired",
  declined: "declined",
};

export function MembersPanel({ members }: { members: Member[] }) {
  const [inviting, setInviting] = useState(false);
  const [sent, setSent] = useState(false);

  const byTier = [1, 2, 3].map((t) => ({
    tier: t,
    people: members.filter((m) => m.tier === t),
  }));

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="label-micro">Circle · {members.length}</div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setInviting((v) => !v);
            setSent(false);
          }}
        >
          {inviting ? "Close" : "Invite"}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {inviting && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-line bg-elevated/60"
          >
            <div className="space-y-3.5 p-5">
              {sent ? (
                <div className="flex items-start gap-2.5">
                  <Dot tone="ok" />
                  <div className="-mt-1">
                    <p className="text-[13px] text-ink">Invitation queued.</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-faint">
                      The recipient enrols a passkey on their own device before they can see
                      anything. Until they do, the invite holds a permission role and no
                      content — an unopened invite discloses nothing.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Field label="Mobile number" hint="Invites go by SMS. Numbers are stored hashed and shown masked.">
                    <Input placeholder="+1 (555) 000-0000" inputMode="tel" />
                  </Field>
                  <Field label="Relationship">
                    <Input placeholder="Daughter, executor, attorney…" />
                  </Field>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] text-faint">Tier is set after they enrol.</span>
                    <Button size="sm" onClick={() => setSent(true)}>
                      Send invite
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="divide-y divide-line">
        {byTier.map(({ tier, people }) =>
          people.length === 0 ? null : (
            <div key={tier} className="px-5 py-3.5">
              <div className="label-micro mb-2.5">Tier {tier}</div>
              <div className="space-y-2">
                {people.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <Dot tone={STATE_TONE[m.state]} pulse={m.state === "expired"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[13px] text-ink">{m.name}</span>
                        {m.isKeyHolder && (
                          <span className="label-micro shrink-0 text-accent">key</span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-faint">
                        <span>{m.relationship}</span>
                        <span aria-hidden>·</span>
                        <span className="font-mono">{m.contactMasked}</span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[10px] uppercase tracking-[0.14em]",
                        m.state === "active"
                          ? "text-ok"
                          : m.state === "invited"
                            ? "text-warn"
                            : m.state === "expired"
                              ? "text-crit"
                              : "text-faint",
                      )}
                    >
                      {STATE_LABEL[m.state]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
      </div>

      {members.some((m) => m.state === "expired") && (
        <div className="border-t border-line bg-crit/5 px-5 py-3.5">
          <div className="flex items-start gap-2.5">
            <Dot tone="crit" />
            <p className="-mt-1 text-[12.5px] leading-relaxed text-muted">
              One invite expired unaccepted. Expiry is deliberate — a permanently valid
              invite link is a permanently valid attack surface.{" "}
              {members
                .filter((m) => m.state === "expired" && m.invitedAt)
                .map((m) => `Sent ${formatDate(m.invitedAt!)}.`)
                .join(" ")}
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-line px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">
            {members.filter((m) => m.isKeyHolder && m.state === "active").length} active
            key-holders
          </Badge>
          <Badge tone="neutral">2 required for release</Badge>
        </div>
      </div>
    </div>
  );
}
