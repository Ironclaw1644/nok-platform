import type { Criticality, ReadinessBreakdown, RecordStatus, VaultRecord } from "./types";

/* Local rather than imported from @/lib/utils so this module has no runtime
   imports at all — which lets readiness.test.ts run on Node's type-stripping
   loader with no bundler, no alias resolution and no test framework. The
   scoring rule is the one piece of logic the whole product rests on; it should
   be the easiest thing in the repo to test. */
function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

/* ---------------------------------------------------------------------------
   Readiness scoring.

   The scoring rule is the product's opinion, so it lives in one testable
   function rather than being spread across components.

   Two deliberate choices:

   1. WEIGHTED, NOT COUNTED. A completion percentage that treats "burial flag
      preference" the same as "DD-214" is a vanity metric. Blocking records are
      worth 5x a standard one, so the number moves when something that actually
      matters changes.

   2. A SINGLE BLOCKING GAP CAPS THE SCORE AT 60%. This is the important one.
      If the one document that gates every survivor benefit is missing, the
      family is not "92% ready" — they are stuck. Showing a high number next to
      a blocking gap is the exact failure mode that makes readiness dashboards
      useless, so the cap is enforced in the model, not left to the UI.
------------------------------------------------------------------------- */

const WEIGHT: Record<Criticality, number> = {
  blocking: 5,
  high: 2,
  standard: 1,
};

/** Fraction of credit a record earns toward readiness. */
const STATUS_CREDIT: Record<RecordStatus, number> = {
  verified: 1,
  on_file: 0.6, // present but unchecked — it may be the wrong year's copy
  stale: 0.45,
  requested: 0.25, // retrieval in flight counts for something, not for much
  missing: 0,
};

/** A record is "stale" once it is past its review interval, regardless of
 *  what status it was last saved with. Computed, never stored — stored
 *  staleness is always out of date by definition. */
export function effectiveStatus(r: VaultRecord): RecordStatus {
  if (r.status !== "verified") return r.status;
  if (!r.reviewDays || !r.lastVerified) return r.status;
  return daysSince(r.lastVerified) > r.reviewDays ? "stale" : "verified";
}

/**
 * Whether a record would actually serve the person who needs it.
 *
 * The interesting case is STALE, and the answer depends on criticality:
 *
 * - A stale **blocking** record is NOT ready. These are the records that gate
 *   everything else, and the failure mode is not absence — it is a document
 *   that is present, trusted, and wrong. An emergency-data form that predates
 *   a divorce still names the ex-spouse as the person authorised to direct
 *   disposition. The family does not discover this by noticing a gap; they
 *   discover it when the wrong person gets the call. Treating that as "held"
 *   would be the single most dangerous thing this scoring function could do.
 *
 * - A stale **high or standard** record IS ready. A will three years past its
 *   review date is still a will. Flag it, do not fail the family over it.
 *
 * This asymmetry is the rule. It is here, in one place, rather than emerging
 * accidentally from how the UI happens to filter.
 */
export function isReady(r: VaultRecord): boolean {
  const s = effectiveStatus(r);
  if (s === "verified" || s === "on_file") return true;
  if (s === "stale") return r.criticality !== "blocking";
  return false;
}

export function computeReadiness(records: VaultRecord[]): ReadinessBreakdown {
  let earned = 0;
  let possible = 0;

  const tally = {
    blocking: { total: 0, ready: 0 },
    high: { total: 0, ready: 0 },
    standard: { total: 0, ready: 0 },
  };

  let staleCount = 0;
  const gaps: VaultRecord[] = [];

  for (const r of records) {
    const status = effectiveStatus(r);
    const w = WEIGHT[r.criticality];
    possible += w;
    earned += w * STATUS_CREDIT[status];

    tally[r.criticality].total += 1;
    if (isReady(r)) tally[r.criticality].ready += 1;
    if (status === "stale") staleCount += 1;
    // `gaps` is everything that would fail the family today — which includes a
    // stale blocking record, per isReady() above. Keeping this in step with
    // isReady rather than hard-coding statuses is what stops the UI saying
    // "missing" about a record that is actually present and out of date.
    if (!isReady(r)) gaps.push(r);
  }

  let score = possible === 0 ? 0 : earned / possible;

  // The cap. A blocking gap means the family cannot proceed, whatever else
  // is filed.
  const hasBlockingGap = records.some(
    (r) => r.criticality === "blocking" && !isReady(r),
  );
  if (hasBlockingGap) score = Math.min(score, 0.6);

  gaps.sort((a, b) => WEIGHT[b.criticality] - WEIGHT[a.criticality]);

  return { score, ...tally, gaps, staleCount };
}

/**
 * Human-readable verdict. Kept next to the scoring so the words and the number
 * can never drift apart.
 *
 * Two registers, same thresholds. "Not survivable" is correct language for a
 * readiness console read by an adult planning for it; it is the wrong language
 * for a daughter who just opened the app. The severity does not change — only
 * the sentence does. Softening the THRESHOLD would be dishonest; softening the
 * WORDING is just knowing who is reading.
 */
export function readinessVerdict(
  b: ReadinessBreakdown,
  register: "military" | "family" = "military",
): {
  label: string;
  tone: "ok" | "warn" | "crit";
  detail: string;
} {
  const family = register === "family";
  const blockingGaps = b.blocking.total - b.blocking.ready;

  if (blockingGaps > 0) {
    return {
      label: family ? "Gaps that matter" : "Not survivable",
      tone: "crit",
      // "missing or out of date", not "missing" — a stale blocking record
      // counts here too, and calling a document that exists "missing" is the
      // kind of small inaccuracy that costs a family an afternoon.
      detail: family
        ? `${blockingGaps} thing${blockingGaps > 1 ? "s" : ""} that everything else depends on ${blockingGaps > 1 ? "are" : "is"} missing or out of date.`
        : `${blockingGaps} record${blockingGaps > 1 ? "s" : ""} that every other benefit depends on ${blockingGaps > 1 ? "are" : "is"} missing or out of date.`,
    };
  }
  if (b.score >= 0.9) {
    return {
      label: family ? "In good shape" : "Ready",
      tone: "ok",
      detail: family
        ? "If you had to hand this over tomorrow, it would hold up."
        : "A survivor packet generated today would be complete.",
    };
  }
  if (b.score >= 0.7) {
    return {
      label: family ? "Mostly there" : "Mostly ready",
      tone: "warn",
      detail: family
        ? `${b.staleCount} record${b.staleCount === 1 ? " has" : "s have"} gone out of date.`
        : `${b.staleCount} record${b.staleCount === 1 ? "" : "s"} past re-verification.`,
    };
  }
  return {
    label: "Incomplete",
    tone: "warn",
    detail: family
      ? "Enough is blank that someone would be guessing."
      : "Enough is missing that a family would be improvising.",
  };
}
