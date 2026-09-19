import assert from "node:assert/strict";
import test from "node:test";
import {
  computeReadiness,
  effectiveStatus,
  isReady,
  readinessVerdict,
} from "./readiness.ts";
import type { Criticality, RecordStatus, VaultRecord } from "./types.ts";

/* Run with: npm test
   No framework, no bundler — node:test on the type-stripping loader. */

let seq = 0;
function rec(
  criticality: Criticality,
  status: RecordStatus,
  extra: Partial<VaultRecord> = {},
): VaultRecord {
  return {
    id: `r${seq++}`,
    title: `record ${seq}`,
    category: "legal",
    status,
    criticality,
    minTier: 2,
    unlocks: ["something"],
    ...extra,
  };
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);
}

test("empty register scores zero rather than dividing by zero", () => {
  const b = computeReadiness([]);
  assert.equal(b.score, 0);
  assert.equal(b.gaps.length, 0);
});

test("all verified with no blocking gaps scores 1", () => {
  const b = computeReadiness([
    rec("blocking", "verified"),
    rec("high", "verified"),
    rec("standard", "verified"),
  ]);
  assert.equal(b.score, 1);
});

test("a single blocking gap caps the score at 60%", () => {
  // Nine of ten records perfect. Naive completion would read ~90%.
  const records = [
    rec("blocking", "missing"),
    ...Array.from({ length: 9 }, () => rec("standard", "verified")),
  ];
  const b = computeReadiness(records);
  assert.ok(b.score <= 0.6, `expected <= 0.60, got ${b.score}`);
});

test("the cap is a ceiling, not a floor — a worse register still scores lower", () => {
  const oneGap = computeReadiness([
    rec("blocking", "missing"),
    ...Array.from({ length: 9 }, () => rec("standard", "verified")),
  ]);
  const allGone = computeReadiness([
    rec("blocking", "missing"),
    ...Array.from({ length: 9 }, () => rec("standard", "missing")),
  ]);
  assert.ok(
    allGone.score < oneGap.score,
    "capping must not flatten every failing register to the same number",
  );
  assert.equal(allGone.score, 0);
});

test("blocking records are weighted 5x standard ones", () => {
  // One blocking missing among standards, vs one standard missing among
  // standards. Compare against their own all-verified baselines.
  const withBlockingGap = computeReadiness([
    rec("blocking", "missing"),
    rec("standard", "verified"),
  ]);
  const withStandardGap = computeReadiness([
    rec("standard", "missing"),
    rec("standard", "verified"),
  ]);
  // 1/6 vs 1/2 before the cap; the cap only tightens the first.
  assert.ok(withBlockingGap.score < withStandardGap.score);
  assert.equal(withStandardGap.score, 0.5);
});

test("on_file earns partial credit — present is not the same as verified", () => {
  const onFile = computeReadiness([rec("standard", "on_file")]);
  const verified = computeReadiness([rec("standard", "verified")]);
  assert.ok(onFile.score > 0, "a held document should count for something");
  assert.ok(onFile.score < verified.score, "unchecked must not score as checked");
});

test("verified goes stale once past its review interval", () => {
  const fresh = rec("high", "verified", { lastVerified: daysAgo(10), reviewDays: 365 });
  const old = rec("high", "verified", { lastVerified: daysAgo(400), reviewDays: 365 });
  assert.equal(effectiveStatus(fresh), "verified");
  assert.equal(effectiveStatus(old), "stale");
});

test("records with no review interval never go stale", () => {
  const r = rec("standard", "verified", { lastVerified: daysAgo(4000), reviewDays: null });
  assert.equal(effectiveStatus(r), "verified");
});

test("staleness is computed, never trusted from the stored status", () => {
  // Stored as verified, but long past due. A stored staleness flag would be
  // out of date by definition.
  const r = rec("high", "verified", { lastVerified: daysAgo(900), reviewDays: 180 });
  const b = computeReadiness([r]);
  assert.equal(b.staleCount, 1);
  assert.ok(b.score < 1);
});

test("a stale NON-blocking record is still held — a due date, not a gap", () => {
  const r = rec("high", "verified", { lastVerified: daysAgo(900), reviewDays: 180 });
  assert.equal(effectiveStatus(r), "stale");
  assert.ok(isReady(r), "a will past its review date is still a will");
  assert.equal(computeReadiness([r]).gaps.length, 0);
});

test("a stale BLOCKING record is NOT held — present and wrong is the danger", () => {
  // An emergency-data form that predates a divorce still names the ex-spouse.
  // The family does not notice a gap; they notice the wrong person being called.
  const r = rec("blocking", "verified", { lastVerified: daysAgo(900), reviewDays: 180 });
  assert.equal(effectiveStatus(r), "stale");
  assert.equal(isReady(r), false);
  assert.ok(computeReadiness([r]).score <= 0.6, "must trigger the blocking cap");
  assert.equal(computeReadiness([r]).gaps.length, 1);
});

test("verdict says 'missing or out of date', never just 'missing'", () => {
  // A stale blocking record is a gap but is not absent. Calling it missing
  // sends a family looking for a document they already have.
  const b = computeReadiness([
    rec("blocking", "verified", { lastVerified: daysAgo(900), reviewDays: 180 }),
  ]);
  for (const reg of ["military", "family"] as const) {
    const v = readinessVerdict(b, reg);
    assert.match(v.detail, /out of date/);
  }
});

test("gaps are ordered by criticality so the UI can take gaps[0]", () => {
  const b = computeReadiness([
    rec("standard", "missing", { title: "low" }),
    rec("blocking", "missing", { title: "high" }),
    rec("high", "missing", { title: "mid" }),
  ]);
  assert.deepEqual(
    b.gaps.map((g) => g.title),
    ["high", "mid", "low"],
  );
});

test("a requested record counts as a gap, not as held", () => {
  const r = rec("blocking", "requested");
  assert.equal(isReady(r), false);
  const b = computeReadiness([r]);
  assert.equal(b.gaps.length, 1);
  assert.ok(b.score > 0, "retrieval in flight should earn some credit");
});

test("verdict is crit whenever a blocking gap exists, whatever the score", () => {
  const b = computeReadiness([
    rec("blocking", "missing"),
    ...Array.from({ length: 20 }, () => rec("standard", "verified")),
  ]);
  assert.equal(readinessVerdict(b).tone, "crit");
});

test("both registers agree on severity and differ only in wording", () => {
  const cases = [
    computeReadiness([rec("blocking", "missing")]),
    computeReadiness([rec("blocking", "verified"), rec("standard", "verified")]),
    computeReadiness([
      rec("blocking", "verified"),
      rec("standard", "on_file"),
      rec("standard", "on_file"),
    ]),
  ];
  for (const b of cases) {
    const mil = readinessVerdict(b, "military");
    const fam = readinessVerdict(b, "family");
    assert.equal(mil.tone, fam.tone, "tone must not soften with register");
    assert.notEqual(mil.detail, fam.detail, "wording should be register-specific");
  }
});

test("tallies count every record exactly once", () => {
  const b = computeReadiness([
    rec("blocking", "verified"),
    rec("blocking", "missing"),
    rec("high", "on_file"),
    rec("standard", "missing"),
  ]);
  assert.deepEqual(b.blocking, { total: 2, ready: 1 });
  assert.deepEqual(b.high, { total: 1, ready: 1 });
  assert.deepEqual(b.standard, { total: 1, ready: 0 });
});

test("score is always within [0,1]", () => {
  const statuses: RecordStatus[] = ["verified", "on_file", "stale", "requested", "missing"];
  const crits: Criticality[] = ["blocking", "high", "standard"];
  for (const s of statuses) {
    for (const c of crits) {
      const score = computeReadiness([rec(c, s), rec(c, s)]).score;
      assert.ok(score >= 0 && score <= 1, `${c}/${s} produced ${score}`);
    }
  }
});
