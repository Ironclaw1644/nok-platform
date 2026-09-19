import Anthropic from "@anthropic-ai/sdk";

/* ---------------------------------------------------------------------------
   Anthropic client and the model policy.

   ONE MODEL. Claude Opus 5 does both jobs — document extraction and
   cross-document reasoning.

   The tempting alternative is a cascade: a cheaper model for bulk extraction,
   the expensive one only for reasoning. Resist it here, for three reasons.

   1. The volume does not justify it. A family holds a dozen documents, not a
      million. At $5/$25 per million tokens, ingesting a whole family's record
      costs low single-digit cents. Splitting models to save a fraction of a
      cent buys nothing and costs a second code path forever.
   2. Prompt caches are model-scoped. A cascade forfeits cache reuse across
      its models — so the "cheap" path can end up costing more per completed
      task than one model that reads a cached record.
   3. Extraction quality IS reasoning quality here. Reading a beneficiary
      designation off a scanned policy and noticing it contradicts the will
      are the same skill. A model that is worse at the first is worse at the
      second, and the second is the feature we would sell.

   Revisit only when measured volume makes it matter, and measure cost per
   completed task rather than per request — a cheaper call that needs a retry
   is not cheaper.
------------------------------------------------------------------------- */

export const MODEL = "claude-opus-5" as const;

/** Extraction is mechanical; reasoning over a whole record is not. */
export const EFFORT = {
  intake: "medium",
  conflicts: "high",
} as const;

export function isConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let cached: Anthropic | null = null;

/**
 * Returns null rather than throwing when unconfigured, so every caller has to
 * decide what to do without a key. Every AI surface in this product falls back
 * to its scripted path — the demo must never break because a key is missing.
 */
export function getClient(): Anthropic | null {
  if (!isConfigured()) return null;
  cached ??= new Anthropic({ maxRetries: 2, timeout: 120_000 });
  return cached;
}

/** Opus 5 can decline a request. HTTP is still 200, so this must be checked
 *  before reading content — otherwise a refusal reads as an empty response. */
export function refusalOf(msg: { stop_reason?: string | null; stop_details?: unknown }): string | null {
  if (msg.stop_reason !== "refusal") return null;
  const d = msg.stop_details as { category?: string | null } | null | undefined;
  return d?.category ?? "unspecified";
}

export function textOf(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}
