"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button, Dot } from "@/components/ui/kit";
import { isReady } from "@/lib/domain/readiness";
import type { Member, VaultRecord } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The ask.

   The single most important interaction in the consumer product, and the one
   that does not exist in any competitor: turning a gap in the record into a
   message to a specific person.

   Note what it does NOT do — it does not send a generic reminder to the
   account owner. A nudge to someone with no reason to care is the mechanic
   that killed this whole category. An ask is from a named person, about one
   named thing, and it is awkward on purpose. Awkward gets answered.
------------------------------------------------------------------------- */

function draftFor(record: VaultRecord, from: string, to: string) {
  const first = to.split(" ")[0];
  return `${first} — it's ${from}. I started a family record with the important paperwork in it. Do you know where the ${record.title.toLowerCase()} is? I can add it, I just need to know it exists.`;
}

export function AskPanel({
  records,
  members,
  from = "Alicia",
}: {
  records: VaultRecord[];
  members: Member[];
  from?: string;
}) {
  const gaps = records.filter((r) => !isReady(r));
  const [recordId, setRecordId] = useState(gaps[0]?.id ?? "");
  const [memberId, setMemberId] = useState(
    members.find((m) => m.state === "active")?.id ?? "",
  );
  const [sent, setSent] = useState(false);

  const record = records.find((r) => r.id === recordId);
  const member = members.find((m) => m.id === memberId);

  if (gaps.length === 0) {
    return (
      <div className="surface-card p-5">
        <div className="flex items-center gap-2.5">
          <Dot tone="ok" />
          <span className="text-[13.5px] text-ink">Nothing left to ask about.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="label-micro">Ask someone</div>
        <span className="text-[11.5px] text-faint">
          {gaps.length} gap{gaps.length === 1 ? "" : "s"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="p-5"
          >
            <div className="flex items-start gap-2.5">
              <Dot tone="ok" />
              <div className="-mt-1">
                <p className="text-[13.5px] text-ink">
                  Sent to {member?.name}. The row stays open until they answer.
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-faint">
                  If nothing comes back in a week, we&apos;ll tell you — not them. Chasing
                  is your job, because it works when you do it and it doesn&apos;t when we do.
                </p>
              </div>
            </div>
            <Button size="sm" variant="secondary" className="mt-4" onClick={() => setSent(false)}>
              Ask about something else
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="compose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 p-5"
          >
            <div>
              <div className="label-micro mb-2">About</div>
              <div className="flex flex-wrap gap-1.5">
                {gaps.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setRecordId(g.id)}
                    className={cn(
                      "relative rounded-full border px-3 py-1 text-[12.5px] transition-colors duration-200",
                      recordId === g.id
                        ? "border-accent text-accent"
                        : "border-line text-muted hover:border-line-strong hover:text-ink",
                    )}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="label-micro mb-2">To</div>
              <div className="flex flex-wrap gap-1.5">
                {members
                  .filter((m) => m.state === "active")
                  .map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMemberId(m.id)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-[12.5px] transition-colors duration-200",
                        memberId === m.id
                          ? "border-accent text-accent"
                          : "border-line text-muted hover:border-line-strong hover:text-ink",
                      )}
                    >
                      {m.name.split(" ")[0]}
                    </button>
                  ))}
              </div>
            </div>

            {record && member && (
              <motion.div
                key={`${recordId}-${memberId}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[var(--radius-field)] border border-line bg-elevated p-3.5"
              >
                <div className="label-micro mb-2">Draft</div>
                <p className="text-[13.5px] leading-relaxed text-ink">
                  {draftFor(record, from, member.name)}
                </p>
              </motion.div>
            )}

            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] text-faint">Goes by text. Editable before it sends.</span>
              <Button size="sm" onClick={() => setSent(true)} disabled={!record || !member}>
                Send ask
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
