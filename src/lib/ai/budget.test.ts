import assert from "node:assert/strict";
import test from "node:test";
import { checkAllowed, costOf } from "./budget.ts";

/* The spend guard is the only thing between a public demo endpoint and an
   open invoice, so it gets tested like it matters. */

test("cost is computed at Opus 5 rates", () => {
  // 1M in + 1M out = $5 + $25
  assert.equal(costOf({ input_tokens: 1_000_000, output_tokens: 1_000_000 }), 30);
  // A realistic single scan: ~6k in, ~1.5k out
  const c = costOf({ input_tokens: 6_000, output_tokens: 1_500 });
  assert.ok(c > 0 && c < 0.1, `a single scan should cost cents, got $${c}`);
});

test("a fresh address is allowed", () => {
  assert.equal(checkAllowed("203.0.113.1").ok, true);
});

test("an address is cut off after the hourly limit", () => {
  const ip = "203.0.113.2";
  let denied = 0;
  // Default limit is 20/hour; 25 attempts must produce refusals.
  for (let i = 0; i < 25; i++) {
    if (!checkAllowed(ip).ok) denied++;
  }
  assert.ok(denied > 0, "rate limiter never refused");
});

test("a refusal carries a 429 and a human-readable reason", () => {
  const ip = "203.0.113.3";
  let last: ReturnType<typeof checkAllowed> | null = null;
  for (let i = 0; i < 40; i++) last = checkAllowed(ip);
  assert.ok(last && !last.ok);
  if (last && !last.ok) {
    assert.equal(last.status, 429);
    assert.ok(last.reason.length > 10, "reason should be readable, not a code");
  }
});

test("limiting one address does not affect another", () => {
  const busy = "203.0.113.4";
  for (let i = 0; i < 40; i++) checkAllowed(busy);
  assert.equal(checkAllowed("203.0.113.5").ok, true);
});
