import type Anthropic from "@anthropic-ai/sdk";
import { EFFORT, MODEL, getClient, refusalOf } from "./client";
import { record } from "./budget";
import type { Member, VaultRecord } from "@/lib/domain/types";

/* ---------------------------------------------------------------------------
   Cross-document conflict analysis. docs/ai.md §2.

   The feature worth selling, and the one that justifies Opus. Extraction is
   mechanical; noticing that a policy beneficiary silently overrides a will is
   reasoning across a whole record at once.

   The prompt spends most of its length on what NOT to do. That is deliberate:
   the failure mode here is not missing a conflict, it is confidently telling a
   family which document wins — which is legal advice, and which this product
   must never give.
------------------------------------------------------------------------- */

export interface AiFinding {
  id: string;
  severity: "crit" | "warn";
  title: string;
  detail: string;
  /** Record titles the conflict is between. At least two, or it is not a conflict. */
  sources: string[];
  /** A next step that is logistics, never legal advice. */
  action: string;
}

export interface ScanResult {
  findings: AiFinding[];
  usageUsd: number;
}

const REPORT_TOOL: Anthropic.Tool = {
  name: "report_conflicts",
  description: "Report contradictions found across the record. Call exactly once.",
  strict: true,
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["findings"],
    properties: {
      findings: {
        type: "array",
        description: "Empty array is a valid and useful answer.",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["id", "severity", "title", "detail", "sources", "action"],
          properties: {
            id: { type: "string", description: "short kebab-case slug" },
            severity: {
              type: "string",
              enum: ["crit", "warn"],
              description:
                "crit only when the conflict would change who receives something or who holds authority. Everything else is warn.",
            },
            title: { type: "string", description: "One line, plain language." },
            detail: {
              type: "string",
              description:
                "Two or three sentences. State what disagrees with what, and why it matters.",
            },
            sources: {
              type: "array",
              items: { type: "string" },
              description: "The record titles involved. At least two.",
            },
            action: {
              type: "string",
              description:
                "A logistical next step. Never a legal recommendation, never which document should win.",
            },
          },
        },
      },
    },
  },
};

const SYSTEM = `You are checking one family's records against each other for contradictions.

WHAT TO LOOK FOR
- A beneficiary designation that disagrees with a will. Designations on
  policies and accounts govern regardless of what a will says; that mismatch is
  the single most common and most costly one.
- A person named in a document who is not in the circle, or who has left it.
- Authority designations (who may act, who may direct disposition, who is the
  health proxy) that predate a divorce, remarriage, death or estrangement.
- A document executed before a major life event it should account for.
- Key-holders or executors named but never actually enrolled.
- A record that is present but too old to be trusted for what it governs.

HARD RULES
1. Report only that two things DISAGREE. Never say which is correct, never
   recommend a legal remedy, never predict an outcome. That is the practice of
   law and you must not do it.
2. Every finding needs at least two sources. One document alone cannot
   contradict anything.
3. Do not invent facts. Work only from what you are given. If the record is
   consistent, return an empty findings array — that is a real answer and a
   good one.
4. severity "crit" is reserved for conflicts that would change who receives
   something or who holds authority. Do not inflate.
5. The action field is logistics: re-file this, confirm that, re-send an
   invite. It is never "change your will" or "you should".

Write plainly. No hedging, no padding. A family reads this.`;

function serialise(records: VaultRecord[], members: Member[]): string {
  const r = records
    .map((x) =>
      [
        `- ${x.title}`,
        `  category: ${x.category}`,
        `  status: ${x.status}`,
        `  importance: ${x.criticality}`,
        x.lastVerified ? `  last verified: ${x.lastVerified}` : null,
        x.reviewDays ? `  review interval: ${x.reviewDays} days` : null,
        x.unlocks.length ? `  governs: ${x.unlocks.join("; ")}` : null,
        x.note ? `  note: ${x.note}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  const m = members
    .map(
      (x) =>
        `- ${x.name} — ${x.relationship}, tier ${x.tier}, ${x.state}${x.isKeyHolder ? ", key-holder" : ""}`,
    )
    .join("\n");

  return `RECORDS\n${r}\n\nCIRCLE\n${m}`;
}

export async function scanForConflicts(
  records: VaultRecord[],
  members: Member[],
): Promise<ScanResult | { error: string }> {
  const client = getClient();
  if (!client) return { error: "not_configured" };

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      system: SYSTEM,
      thinking: { type: "adaptive" },
      // High effort: this is the reasoning task, and the whole point is
      // catching the conflict a person would not have noticed.
      output_config: { effort: EFFORT.conflicts },
      tools: [REPORT_TOOL],
      tool_choice: { type: "auto" },
      messages: [
        {
          role: "user",
          content: `${serialise(records, members)}\n\nCheck these against each other and call report_conflicts.`,
        },
      ],
    });

    const refused = refusalOf(msg);
    if (refused) return { error: `refused:${refused}` };

    const call = msg.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "report_conflicts",
    );
    if (!call) return { error: "no_findings_returned" };

    const { findings } = call.input as { findings: AiFinding[] };

    // Enforce rule 2 in code as well as in the prompt. A "conflict" citing one
    // source is the model drifting toward advice, and it should not reach a UI.
    const valid = (findings ?? []).filter((f) => Array.isArray(f.sources) && f.sources.length >= 2);

    return { findings: valid, usageUsd: record(msg.usage) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}
